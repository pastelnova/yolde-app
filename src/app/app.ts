import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
}
