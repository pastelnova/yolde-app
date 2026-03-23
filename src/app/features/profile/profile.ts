import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { ProfileService } from '../../shared/services/profile.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProfileInterface } from '../../shared/models/profile.interface';
import { authStore } from '../../core/auth/store/auth.store';
import { ArticlePreview } from '../../shared/components/article-preview/article-preview';
import { Pagination } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, UpperCasePipe, ArticlePreview, Pagination],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  store = inject(authStore);
  private profileService = inject(ProfileService);
  articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isFollowing = signal(false);
  isFollowLoading = signal(false);

  private username = toSignal(this.route.params.pipe(map((params) => params['username'])), { initialValue: '' });

  profile = computed(() => this.profileResource.value()?.profile ?? ({} as ProfileInterface));
  profileResource = this.profileService.getProfile(this.username);

  articlesResource = this.articleService.getArticlePerPage(this.articleService.type, this.articleService.currentPage);
  isLoading = computed(() => this.articlesResource.isLoading());
  articles = computed(() => this.articlesResource.value()?.articles ?? []);

  private authorCountResource = this.articleService.getArticlesCount(this.username, 'author');
  private favoritedCountResource = this.articleService.getArticlesCount(this.username, 'favorited');
  articlesCount = computed(() => this.authorCountResource.value() ?? 0);
  favoritedCount = computed(() => this.favoritedCountResource.value() ?? 0);

  constructor() {
    effect(() => {
      this.articleService.type.set('author');
      this.articleService.activeAuthor.set(this.username());
      this.isFollowing.set(this.profile().following);
    });
  }

  toggleFollow(username: string) {
    if (!this.store.currentUser()) {
      this.router.navigate(['/signin']);
      return;
    }
    if (this.isFollowLoading()) return;

    const wasFollowing = this.isFollowing();
    const operation$ = wasFollowing
      ? this.articleService.unfollowAuthor(username)
      : this.articleService.followAuthor(username);

    this.isFollowLoading.set(true);
    this.isFollowing.set(!wasFollowing);

    operation$.subscribe({
      next: () => {
        this.isFollowLoading.set(false);
      },
      error: () => {
        this.isFollowing.set(wasFollowing);
        this.isFollowLoading.set(false);
      },
    });
  }

  getMyArticles() {
    this.articleService.type.set('author');
  }

  getFavoritedArticles() {
    this.articleService.type.set('favorited');
  }
}
