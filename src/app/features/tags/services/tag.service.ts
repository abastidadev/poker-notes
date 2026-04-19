import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Tag } from '../../../core/models/tag.model';
import { DEFAULT_TAGS } from '../../../core/constants/default-tags.const';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly storage = inject(StorageService);

  private readonly customTags = signal<Tag[]>(this.loadCustomTags());

  readonly allTags = computed<Tag[]>(() => [...DEFAULT_TAGS, ...this.customTags()]);
  readonly predefinedTags = computed<Tag[]>(() => DEFAULT_TAGS);

  constructor() {
    effect(() => this.storage.set('tags', this.customTags()));
  }

  getTagById(id: string): Tag | undefined {
    return this.allTags().find((t) => t.id === id);
  }

  getTagsByIds(ids: string[]): Tag[] {
    return ids.map((id) => this.getTagById(id)).filter((t): t is Tag => !!t);
  }

  addCustomTag(name: string, color: string): Tag {
    const tag: Tag = { id: crypto.randomUUID(), name, color, isCustom: true };
    this.customTags.update((tags) => [...tags, tag]);
    return tag;
  }

  updateTag(id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>): void {
    this.customTags.update((tags) => tags.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  deleteCustomTag(id: string): void {
    this.customTags.update((tags) => tags.filter((t) => t.id !== id));
  }

  private loadCustomTags(): Tag[] {
    return this.storage.get<Tag[]>('tags') ?? [];
  }
}
