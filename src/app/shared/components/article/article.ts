import { Component, input } from '@angular/core';
import { ArticleInterface } from '../../models/article.interface';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-article',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  article = input.required<ArticleInterface>();
}
