import { httpResource } from '@angular/common/http';
import { Injectable, linkedSignal, Signal, signal } from '@angular/core';
import { ArticleInterface } from '../models/article.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  type = signal<string>('global');
  pageSize = signal(3);

  currentPage = linkedSignal({
    source: () => this.type(),
    computation: () => 1,
  });

  getArticlePerPage(type: Signal<string>, page: Signal<number>) {
    return httpResource<{
      articles: ArticleInterface[];
      articlesCount: number;
    }>(() => {
      const limit = this.pageSize();
      const currentType = type();
      const offset = (page() - 1) * limit;

      switch (currentType) {
        case 'global':
          return `/articles?offset=${offset}&limit=${limit}`;
        case 'feed':
          return `/articles/feed?offset=${offset}&limit=${limit}`;
        default:
          return undefined;
      }
    });
  }
}
