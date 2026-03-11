import { HttpClient, httpResource } from '@angular/common/http';
import {
  inject,
  Injectable,
  linkedSignal,
  Signal,
  signal,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArticleInterface } from '../models/article.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);

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

  getArticleTitles() {
    return httpResource<string[]>(() => `/articles?limit=10&offset=0`, {
      parse: (response) => {
        const data = response as { articles: ArticleInterface[] };
        return data.articles.map((article) => article.title);
      },
    });
  }

  likeArticle(slug: string): Observable<ArticleInterface> {
    return this.http
      .post<{ article: ArticleInterface }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unlikeArticle(slug: string): Observable<ArticleInterface> {
    return this.http
      .delete<{ article: ArticleInterface }>(`/articles/${slug}/favorite`)
      .pipe(map((data) => data.article));
  }
}
