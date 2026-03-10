import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  getAllTagResources = httpResource<{ tags: string[] }>(() => `/tags`);

  tags = computed(() => this.getAllTagResources.value()?.tags ?? []);
}
