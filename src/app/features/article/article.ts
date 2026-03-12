import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ArticleInterface } from '../../shared/models/article.interface';
import { ArticleService } from '../../shared/services/article.service';

@Component({
  selector: 'app-article',
  imports: [JsonPipe],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class ArticleComponent {
  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);

  private slug = toSignal(
    this.route.params.pipe(map((params) => params['slug'])),
    {
      initialValue: '',
    },
  );
  article = computed(
    () => this.articleResource.value()?.article ?? ({} as ArticleInterface),
  );

  articleResource = this.articleService.getArticleBySlug(this.slug);
}
