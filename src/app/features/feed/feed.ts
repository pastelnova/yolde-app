import { Component, computed, inject } from '@angular/core';
import { Article } from '../../shared/components/article/article';
import { authStore } from '../../core/auth/store/auth.store';
import { AuthService } from '../../core/auth/services/auth.service';
import { ArticleService } from '../../shared/services/article.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, Article, RouterModule, Pagination],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private authService = inject(AuthService);
  articleService = inject(ArticleService);
  router = inject(Router);
  store = inject(authStore);

  private user = computed(
    () => this.authService.getCurrentUserResource.value()?.user,
  );

  articles = computed(
    () => this.articleService.getArticlesResources.value()?.articles ?? [],
  );
  articlesCount = computed(
    () => this.articleService.getArticlesResources.value()?.articlesCount ?? 0,
  );
  isLoading = computed(() =>
    this.articleService.getArticlesResources.isLoading(),
  );

  getGlobalArticles() {
    this.articleService.type.set('global');
  }

  getPersonalFeedArticles() {
    if (this.user()) {
      this.articleService.type.set('feed');
    } else {
      this.router.navigate(['/login']);
    }
  }
}
