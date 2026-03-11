import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { authStore } from '../../../core/auth/store/auth.store';
import { ArticleInterface } from '../../models/article.interface';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  private articleService = inject(ArticleService);
  private store = inject(authStore);
  private router = inject(Router);
  article = input.required<ArticleInterface>();

  isFavorited = signal(false);
  favoritesCount = signal(0);
  isLoading = signal(false);

  constructor() {
    effect(() => {
      this.isFavorited.set(this.article().favorited);
      this.favoritesCount.set(this.article().favoritesCount);
    });
  }

  toggleLike(slug: string) {
    if (!this.store.currentUser()) {
      this.router.navigate(['/signin']);
      return;
    }
    if (this.isLoading()) return;

    const wasFavorited = this.isFavorited();
    const operation$ = wasFavorited
      ? this.articleService.unlikeArticle(slug)
      : this.articleService.likeArticle(slug);

    this.isLoading.set(true);
    this.isFavorited.set(!wasFavorited);

    operation$.subscribe({
      next: (updatedArticle) => {
        this.favoritesCount.set(updatedArticle.favoritesCount);
        this.isLoading.set(false);
      },
      error: () => {
        this.isFavorited.set(wasFavorited);
        this.isLoading.set(false);
      },
    });
  }
}
