import { Component } from '@angular/core';
import { EditorsPick } from '../../shared/components/editors-pick/editors-pick';

@Component({
  selector: 'app-intro',
  imports: [EditorsPick],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro {}
