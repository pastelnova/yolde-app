import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, linkedSignal, Signal, signal } from '@angular/core';
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

  createArticle(article: Partial<ArticleInterface>): Observable<ArticleInterface> {
    return this.http
      .post<{ article: ArticleInterface }>('/articles', { article: article })
      .pipe(map((data) => data.article));
  }

  updateArticle(slug: string, article: Partial<ArticleInterface>): Observable<ArticleInterface> {
    return this.http
      .put<{ article: ArticleInterface }>(`/articles/${slug}`, { article: article })
      .pipe(map((data) => data.article));
  }

  deleteArticle(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  getArticleBySlug(slug: Signal<string>) {
    return httpResource<{ article: ArticleInterface }>(() => (slug() ? `/articles/${slug()}` : undefined));
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

  followAuthor(username: string): Observable<void> {
    return this.http.post<void>(`/profiles/${username}/follow`, {});
  }

  unfollowAuthor(username: string): Observable<void> {
    return this.http.delete<void>(`/profiles/${username}/follow`);
  }

  getEditorsPickArticle() {
    return httpResource<ArticleInterface>(() => `/articles?limit=20&offset=0`, {
      parse: (response) => {
        const articles = (response as { articles: ArticleInterface[] }).articles;
        const maxLikes = Math.max(...articles.map((a) => a.favoritesCount));
        const topArticles = articles.filter((a) => a.favoritesCount === maxLikes);
        return topArticles[Math.floor(Math.random() * topArticles.length)];
      },
    });
  }
}
