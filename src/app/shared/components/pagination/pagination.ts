import { Component, computed, inject, input } from '@angular/core';
import { ArticleInterface } from '../../models/article.interface';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  private articleService = inject(ArticleService);

  articles = input.required<ArticleInterface[]>();
  articlesCount = input.required<number>();
  isLoading = input.required<boolean>();
  pageSize = this.articleService.pageSize;

  totalPages = computed(() =>
    Math.ceil(this.articlesCount() / this.pageSize()),
  );

  currentPage = this.articleService.currentPage;

  goToPage(page: number | string) {
    if (typeof page === 'string') {
      return;
    }
    this.articleService.currentPage.set(page);
  }

  calculateTotalPages = (totalArticles: number, pageSize: number): number => {
    return Math.ceil(totalArticles / pageSize);
  };

  getVisiblePages(
    currentPage: number,
    totalPages: number,
    showPagesAround = 2,
  ): (number | string)[] {
    if (totalPages <= 7) {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const pages: (number | string)[] = [];
    const start = Math.max(2, currentPage - showPagesAround);
    const end = Math.min(totalPages - 1, currentPage + showPagesAround);

    // Always show first page
    pages.push(1);

    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }
}
