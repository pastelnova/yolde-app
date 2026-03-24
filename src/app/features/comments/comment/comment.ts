import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommentInterface } from '../../../shared/models/comment.interface';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-comment',
  imports: [UpperCasePipe, DatePipe, RouterLink, ConfirmModal],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class CommentComponent {
  comment = input.required<CommentInterface>();
  currentUsername = input<string | null | undefined>(null);
  delete = output<number>();

  showDeleteConfirm = signal(false);
}
