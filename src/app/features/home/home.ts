import { Component } from '@angular/core';
import { Intro } from '../intro/intro';
import { Main } from '../../core/layout/main/main';

@Component({
  selector: 'app-home',
  imports: [Intro, Main],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
