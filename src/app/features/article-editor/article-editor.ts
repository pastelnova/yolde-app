import { Component, computed, effect, inject, signal } from '@angular/core';
import { authStore } from '../../core/auth/store/auth.store';
import { DatePipe } from '@angular/common';
import { ArticleFormInterface } from '../../shared/models/articleForm.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticleService } from '../../shared/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-article-editor',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './article-editor.html',
  styleUrl: './article-editor.scss',
})
export class ArticleEditor {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  store = inject(authStore);
  today = new Date();

  slug = toSignal(this.route.params.pipe(map((param) => (param['slug'] as string) ?? '')), {
    initialValue: '',
  });
  isEditMode = computed(() => !!this.slug());

  private articleResource = this.articleService.getArticleBySlug(this.slug);

  tagList = signal<string[]>([]);

  authorName = computed(() => this.store.currentUser()?.username ?? 'You');
  authorInitials = computed(() => {
    const username = this.store.currentUser()?.username ?? '';
    return username.slice(0, 2).toUpperCase() || 'ME';
  });

  articleForm: FormGroup<ArticleFormInterface> = new FormGroup<ArticleFormInterface>({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    body: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  tagField = new FormControl('');

  private bodyValue = toSignal(this.articleForm.controls.body.valueChanges, {
    initialValue: this.articleForm.controls.body.value,
  });

  charCount = computed(() => (this.bodyValue() ?? '').length);
  wordCount = computed(() => {
    const val = (this.bodyValue() ?? '').trim();
    return val ? val.split(/\s+/).length : 0;
  });
  paraCount = computed(() => {
    const val = (this.bodyValue() ?? '').trim();
    return val ? val.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  });
  readMins = computed(() => Math.max(1, Math.ceil(this.wordCount() / 200)));

  constructor() {
    effect(() => {
      const article = this.articleResource.value()?.article;
      if (article) {
        this.articleForm.patchValue({
          title: article.title,
          description: article.description,
          body: article.body,
        });
        this.tagList.set(article.tagList);
      }
    });
  }

  onTagKeydown(event: KeyboardEvent): void {
    const inputValue = this.tagField.value ?? '';
    if ((event.key === 'Enter' || event.key === ',') && inputValue.trim()) {
      event.preventDefault();
      this.addTag(inputValue);
      return;
    }
    if (event.key === 'Backspace' && !inputValue && this.tagList().length) {
      this.removeTag(this.tagList()[this.tagList().length - 1]);
    }
  }

  addTag(raw = ''): void {
    const tag = raw
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (!tag || this.tagList().includes(tag) || this.tagList().length >= 5) {
      this.tagField.reset();
      return;
    }

    this.tagList.update((currentTags) => [...currentTags, tag]);
    this.tagField.reset();
  }

  removeTag(tagToRemove: string) {
    this.tagList.update((currentTags) => currentTags.filter((tag) => tag !== tagToRemove));
  }

  onSubmit() {
    const pendingTag = (this.tagField.value ?? '').trim();
    if (pendingTag) {
      this.addTag(pendingTag);
    }

    if (this.articleForm.valid) {
      const formData = {
        ...this.articleForm.value,
        tagList: this.tagList(),
      };

      const request$ = this.isEditMode()
        ? this.articleService.updateArticle(this.slug(), formData)
        : this.articleService.createArticle(formData);

      request$.subscribe({
        next: (article) => {
          this.router.navigate(['/article/', article.slug]);
        },
        error: (error) => {
          console.error('Error saving article:', error);
        },
      });
    }
  }
}
