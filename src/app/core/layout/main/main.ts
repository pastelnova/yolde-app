import { Component } from '@angular/core';
import { Feed } from '../../../features/feed/feed';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main',
  imports: [Feed, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
