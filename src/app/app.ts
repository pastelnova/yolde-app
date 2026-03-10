import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Ticker } from './shared/components/ticker/ticker';
import { Nav } from './core/layout/nav/nav';
import { Footer } from './core/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ticker, Nav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('yolde-app');
  protected readonly router = inject(Router);
}
