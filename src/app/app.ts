import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Footer } from './core/layout/footer/footer';
import { Nav } from './core/layout/nav/nav';
import { Ticker } from './shared/components/ticker/ticker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ticker, Nav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly isDashboardRoute = computed(() => this.currentUrl().startsWith('/dashboard'));
}
