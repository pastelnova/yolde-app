import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { ArticleInterface } from '../models/article.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  type = signal<string>('global');

  getArticlesResources = httpResource<{ articles: ArticleInterface[] }>(() => `/articles`);
  articles = computed(() => this.getArticlesResources.value()?.articles ?? []);
}
