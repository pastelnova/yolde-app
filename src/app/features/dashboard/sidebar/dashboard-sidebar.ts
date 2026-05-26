import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideChevronDown,
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideLayoutGrid,
  LucideListChecks,
  LucidePlus,
  LucideSearch,
  LucideSettings,
  LucideStar,
  LucideUsers,
  LucideX,
} from '@lucide/angular';
import { currentUser, projects } from '../../../../lib/mock-data';

type Section = 'board' | 'issues' | 'members' | 'settings';

interface NavItem {
  section: Section;
  label: string;
  icon: 'board' | 'issues' | 'members' | 'settings';
}

const NAV_ITEMS: NavItem[] = [
  { section: 'board', label: 'Board', icon: 'board' },
  { section: 'issues', label: 'Issues', icon: 'issues' },
  { section: 'members', label: 'Members', icon: 'members' },
  { section: 'settings', label: 'Settings', icon: 'settings' },
];

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideChevronDown,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideLayoutGrid,
    LucideListChecks,
    LucidePlus,
    LucideSearch,
    LucideSettings,
    LucideStar,
    LucideUsers,
    LucideX,
  ],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebar {
  readonly collapsed = input(false);
  readonly isDrawer = input(false);
  readonly activeProjectSlug = input<string | null>(null);

  readonly toggleCollapsed = output<void>();
  readonly closeDrawer = output<void>();

  protected readonly navItems = NAV_ITEMS;
  protected readonly projects = projects;
  protected readonly user = currentUser;
  protected readonly favorites = projects.filter((p) => p.isFavorite);

  protected readonly switcherOpen = signal(false);

  protected readonly activeProject = computed(() => {
    const slug = this.activeProjectSlug();
    return projects.find((p) => p.slug === slug) ?? projects[0];
  });

  protected readonly isCompact = computed(() => this.collapsed() && !this.isDrawer());

  protected toggleSwitcher(): void {
    if (this.isCompact()) return;
    this.switcherOpen.update((v) => !v);
  }

  protected onNavClick(): void {
    if (this.isDrawer()) this.closeDrawer.emit();
  }

  protected projectRoute(slug: string, section: Section = 'board'): string[] {
    return ['/projects', slug, section];
  }
}
