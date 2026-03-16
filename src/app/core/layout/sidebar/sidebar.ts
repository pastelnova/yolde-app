import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TagService } from '../../../shared/services/tag.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);
  tagsService = inject(TagService);

  tags = computed(() => {
    return this.tagsService.tags();
  });

  onTagClick(tag: string) {
    this.router.navigate(['/'], {
      queryParams: { tag },
    });
  }
}
