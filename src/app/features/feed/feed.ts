import { Component, computed, inject } from '@angular/core';
import { Article } from '../../shared/components/article/article';
import { authStore } from '../../core/auth/store/auth.store';
import { AuthService } from '../../core/auth/services/auth.service';
import { ArticleService } from '../../shared/services/article.service';

@Component({
  selector: 'app-feed',
  imports: [Article],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private authService = inject(AuthService);
  private articleService = inject(ArticleService);
  store = inject(authStore);

  private currentUser = computed(() => this.authService.getCurrentUserResource.value()?.user.username ?? '');

  articles = computed(() => this.articleService.getArticlesResources.value()?.articles ?? []);

  getGlobalArticles() {
    console.log('Fetching global articles...');
  }

  getPersonalFeedArticles() {
    console.log('Fetching your feed articles...');
  }
}
