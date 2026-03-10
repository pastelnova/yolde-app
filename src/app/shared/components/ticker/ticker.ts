import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-ticker',
  imports: [],
  templateUrl: './ticker.html',
  styleUrl: './ticker.scss',
})
export class Ticker {
  titles = signal<string[]>(['NEW', 'TRENDING', 'NEW', 'TRENDING', 'NEW', 'TRENDING', 'NEW', 'TRENDING']);
}
