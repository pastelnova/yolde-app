import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { authStore } from '../../core/auth/store/auth.store';
import { ArticlePreview } from '../../shared/components/article-preview/article-preview';
import { Pagination } from '../../shared/components/pagination/pagination';
import { ArticleService } from '../../shared/services/article.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { map } from 'rxjs';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, ArticlePreview, RouterModule, Pagination, LoadingSpinner],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  articleService = inject(ArticleService);
  router = inject(Router);
  store = inject(authStore);

  private user = computed(() => this.authService.getCurrentUserResource.value()?.user);

  articles = computed(() => this.articlesResource.value()?.articles ?? []);
  articlesCount = computed(() => this.articlesResource.value()?.articlesCount ?? 0);
  isLoading = computed(() => this.articlesResource.isLoading());

  articlesResource = this.articleService.getArticlePerPage(this.articleService.type, this.articleService.currentPage);

  activeTag = toSignal(this.route.queryParamMap.pipe(map((params) => (params.get('tag') ?? '').trim())), {
    initialValue: '',
  });
  isTagMode = computed(() => !!this.activeTag());

  constructor() {
    effect(() => {
      const tag = this.activeTag();
      this.articleService.activeTag.set(tag);
      if (tag) {
        this.articleService.type.set('tag');
      } else if (this.articleService.type() === 'tag') {
        this.articleService.type.set('global');
      }
    });
  }

  private navigateToHome() {
    this.router.navigate(['/'], {
      queryParams: { tag: null },
    });
  }

  getGlobalArticles() {
    this.navigateToHome();
    this.articleService.type.set('global');
  }

  getPersonalFeedArticles() {
    if (this.user()) {
      this.navigateToHome();
      this.articleService.type.set('feed');
    } else {
      this.router.navigate(['/signin']);
    }
  }

  clearTag() {
    this.navigateToHome();
    this.articleService.type.set('global');
  }
}
