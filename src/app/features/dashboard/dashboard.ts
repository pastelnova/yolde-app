import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DestroyRef,
  HostBinding,
  Injector,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LucideLayoutGrid, LucideList, LucideMenu, LucidePlus } from '@lucide/angular';
import { map } from 'rxjs';
import { projects, users } from '../../../lib/mock-data';
import { Board } from './board/board';
import { DashboardSidebar } from './sidebar/dashboard-sidebar';

const MAX_VISIBLE_MEMBERS = 5;

const COLLAPSED_KEY = 'yolde:sidebar:collapsed';

function loadCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(COLLAPSED_KEY);
    return raw === null ? false : JSON.parse(raw) === true;
  } catch {
    return false;
  }
}

@Component({
  selector: 'app-dashboard',
  imports: [Board, DashboardSidebar, LucideLayoutGrid, LucideList, LucideMenu, LucidePlus],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnDestroy {
  @HostBinding('class') readonly hostClass = 'dark block h-screen bg-background text-foreground';

  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly collapsed = signal(loadCollapsed());

  protected readonly activeProjectSlug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });

  protected readonly activeSection = toSignal(this.route.paramMap.pipe(map((p) => p.get('section') ?? 'board')), {
    initialValue: this.route.snapshot.paramMap.get('section') ?? 'board',
  });

  protected readonly activeProject = computed(() => {
    const slug = this.activeProjectSlug();
    return projects.find((p) => p.slug === slug) ?? projects[0];
  });

  protected readonly sectionLabel = computed(() => {
    const section = this.activeSection();
    return section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ');
  });

  protected readonly visibleMembers = users.slice(0, MAX_VISIBLE_MEMBERS);
  protected readonly hiddenMemberCount = Math.max(0, users.length - MAX_VISIBLE_MEMBERS);

  private overlayRef: OverlayRef | null = null;

  constructor() {
    effect(() => {
      const value = this.collapsed();
      try {
        localStorage.setItem(COLLAPSED_KEY, JSON.stringify(value));
      } catch {
        // ignore storage errors (private mode, etc.)
      }
    });
  }

  protected toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
  }

  protected openDrawer(): void {
    if (this.overlayRef) return;

    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().left().top(),
      height: '100vh',
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: ['dashboard-drawer-panel', 'dark'],
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const portal = new ComponentPortal(DashboardSidebar, null, this.injector);
    const ref: ComponentRef<DashboardSidebar> = overlayRef.attach(portal);
    ref.setInput('isDrawer', true);
    ref.setInput('collapsed', false);
    ref.setInput('activeProjectSlug', this.activeProjectSlug() ?? null);
    ref.instance.closeDrawer.subscribe(() => this.closeDrawer());

    overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDrawer());

    this.overlayRef = overlayRef;
  }

  protected closeDrawer(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    this.closeDrawer();
  }
}
