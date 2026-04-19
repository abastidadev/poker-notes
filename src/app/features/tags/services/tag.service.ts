import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Tag } from '../../../core/models/tag.model';
import { DEFAULT_TAGS } from '../../../core/constants/default-tags.const';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly storage = inject(StorageService);

  private readonly tagsSignal = signal<Tag[]>(this.loadTags());

  readonly allTags = this.tagsSignal.asReadonly();
  readonly predefinedTags = computed<Tag[]>(() => this.allTags().filter((t) => !t.isCustom));

  constructor() {
    effect(() => this.storage.set('all_tags', this.tagsSignal()));
  }

  getTagById(id: string): Tag | undefined {
    return this.allTags().find((t) => t.id === id);
  }

  getTagsByIds(ids: string[]): Tag[] {
    return ids.map((id) => this.getTagById(id)).filter((t): t is Tag => !!t);
  }

  addCustomTag(name: string, color: string): Tag {
    const tag: Tag = { id: crypto.randomUUID(), name, color, isCustom: true };
    this.tagsSignal.update((tags) => [...tags, tag]);
    return tag;
  }

  updateTag(id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>): void {
    this.tagsSignal.update((tags) => tags.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  deleteTag(id: string): void {
    this.tagsSignal.update((tags) => tags.filter((t) => t.id !== id));
  }

  /** @deprecated use deleteTag */
  deleteCustomTag(id: string): void {
    this.deleteTag(id);
  }

  private loadTags(): Tag[] {
    // Try the new unified format first
    const stored = this.storage.get<Tag[]>('all_tags');
    if (stored !== null) return stored;
    // Migration: old format only stored custom tags under 'tags' key
    const oldCustom = this.storage.get<Tag[]>('tags') ?? [];
    return [...DEFAULT_TAGS, ...oldCustom];
  }
}
