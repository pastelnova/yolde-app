import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { authStore } from '../../core/auth/store/auth.store';
import { ArticlePreview } from '../../shared/components/article-preview/article-preview';
import { Pagination } from '../../shared/components/pagination/pagination';
import { ArticleService } from '../../shared/services/article.service';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, ArticlePreview, RouterModule, Pagination],
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

  articles = computed(() => this.articlesResource.value()?.articles ?? []);
  articlesCount = computed(
    () => this.articlesResource.value()?.articlesCount ?? 0,
  );
  isLoading = computed(() => this.articlesResource.isLoading());

  articlesResource = this.articleService.getArticlePerPage(
    this.articleService.type,
    this.articleService.currentPage,
  );

  getGlobalArticles() {
    this.articleService.type.set('global');
  }

  getPersonalFeedArticles() {
    if (this.user()) {
      this.articleService.type.set('feed');
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
