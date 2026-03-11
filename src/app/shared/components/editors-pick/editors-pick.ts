import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-editors-pick',
  imports: [DatePipe, UpperCasePipe],
  templateUrl: './editors-pick.html',
  styleUrl: './editors-pick.scss',
})
export class EditorsPick {
  private articleService = inject(ArticleService);
  private pickResource = this.articleService.getEditorsPickArticle();

  article = computed(() => this.pickResource.value());

  readingTime = computed(() => {
    const words = this.article()?.body?.trim().split(/\s+/).length ?? 0;
    return Math.max(1, Math.ceil(words / 200));
  });
}
