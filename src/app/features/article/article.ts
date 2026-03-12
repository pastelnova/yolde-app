import { DatePipe, JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { authStore } from '../../core/auth/store/auth.store';
import { ArticleInterface } from '../../shared/models/article.interface';
import { ArticleService } from '../../shared/services/article.service';

@Component({
  selector: 'app-article',
  imports: [JsonPipe, UpperCasePipe, DatePipe],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class ArticleComponent {
  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  store = inject(authStore);
  private router = inject(Router);

  isFavorited = signal(false);
  favoritesCount = signal(0);
  isFollowing = signal(false);
  isLoading = signal(false);

  private slug = toSignal(
    this.route.params.pipe(map((params) => params['slug'])),
    {
      initialValue: '',
    },
  );
  article = computed(
    () => this.articleResource.value()?.article ?? ({} as ArticleInterface),
  );

  articleResource = this.articleService.getArticleBySlug(this.slug);

  readingTime = computed(() => {
    const words = this.article()?.body?.trim().split(/\s+/).length ?? 0;
    return Math.max(1, Math.ceil(words / 200));
  });

  constructor() {
    effect(() => {
      this.isFavorited.set(this.article().favorited);
      this.favoritesCount.set(this.article().favoritesCount);
      this.isFollowing.set(this.article().author.following);
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
