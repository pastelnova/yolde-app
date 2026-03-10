import { Component, computed, inject } from '@angular/core';
import { TagService } from '../../../shared/services/tag.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  tagsService = inject(TagService);

  tags = computed(() => {
    return this.tagsService.tags();
  });
}
