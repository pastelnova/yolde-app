import { Component, computed, inject } from '@angular/core';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-ticker',
  imports: [],
  templateUrl: './ticker.html',
  styleUrl: './ticker.scss',
})
export class Ticker {
  articleService = inject(ArticleService);

  private titlesResource = this.articleService.getArticleTitles();
  titles = computed(() => this.titlesResource.value() ?? []);
}
