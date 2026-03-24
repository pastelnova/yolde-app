import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { authStore } from '../../core/auth/store/auth.store';
import { CommentInterface } from '../../shared/models/comment.interface';
import { ArticleService } from '../../shared/services/article.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { CommentComponent } from './comment/comment';

@Component({
  selector: 'app-comments',
  imports: [UpperCasePipe, LoadingSpinner, CommentComponent],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class CommentsComponent {
  slug = input.required<string>();

  private articleService = inject(ArticleService);
  store = inject(authStore);
  private router = inject(Router);

  commentsCount = output<number>();

  commentsResource = this.articleService.getComments(this.slug);
  comments = computed<CommentInterface[]>(() => this.commentsResource.value()?.comments ?? []);

  constructor() {
    effect(() => {
      if (!this.commentsResource.isLoading()) {
        this.commentsCount.emit(this.comments().length);
      }
    });
  }

  readonly COMMENTS_PREVIEW = 5;
  showAllComments = signal(false);
  visibleComments = computed(() =>
    this.showAllComments() ? this.comments() : this.comments().slice(0, this.COMMENTS_PREVIEW),
  );

  commentBody = signal('');
  isPostingComment = signal(false);

  postComment() {
    const body = this.commentBody().trim();
    if (!body || this.isPostingComment()) return;
    if (!this.store.currentUser()) {
      this.router.navigate(['/signin']);
      return;
    }

    this.isPostingComment.set(true);
    this.articleService.createComment(this.slug(), body).subscribe({
      next: () => {
        this.commentsResource.reload();
        this.commentBody.set('');
        this.isPostingComment.set(false);
      },
      error: () => {
        this.isPostingComment.set(false);
      },
    });
  }

  deleteComment(commentId: number) {
    this.articleService.deleteComment(this.slug(), commentId).subscribe({
      next: () => {
        this.commentsResource.reload();
      },
    });
  }
}
