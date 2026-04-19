import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from './services/player.service';
import { TagService } from '../tags/services/tag.service';
import { TableService } from '../table/services/table.service';
import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker.component';
import { EmojiPickerComponent } from '../../shared/components/emoji-picker/emoji-picker.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Player } from '../../core/models/player.model';
import { Tag } from '../../core/models/tag.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { SettingsService } from '../settings/services/settings.service';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [
    FormsModule,
    ColorPickerComponent,
    EmojiPickerComponent,
    ConfirmDialogComponent,
    TranslatePipe,
  ],
  templateUrl: './player-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerProfileComponent {
  private readonly playerService = inject(PlayerService);
  private readonly tagService = inject(TagService);
  private readonly tableService = inject(TableService);
  private readonly settingsService = inject(SettingsService);

  protected readonly lang = computed(() => this.settingsService.settings().language);

  readonly playerId = input.required<string>();
  readonly open = input.required<boolean>();
  readonly close = output<void>();
  readonly playerDeleted = output<string>();

  protected readonly showEmojiPicker = signal(false);
  protected readonly showTagSelector = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly showAddSession = signal(false);
  protected readonly showCreateTag = signal(false);
  protected readonly newTagName = signal('');
  protected readonly newTagColor = signal('#6B7280');
  protected readonly sessionDate = signal('');
  protected readonly sessionLocation = signal('');
  protected readonly sessionNotes = signal('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly player = computed(() => {
    const id = this.playerId();
    return id ? (this.playerService.getById(id) ?? null) : null;
  });

  readonly playerTags = computed(() => {
    const p = this.player();
    return p ? this.tagService.getTagsByIds(p.tagIds) : [];
  });

  readonly availableTags = computed(() => {
    const currentIds = new Set(this.player()?.tagIds ?? []);
    return this.tagService.allTags().filter((t) => !currentIds.has(t.id));
  });

  readonly predefinedAvailable = computed(() => this.availableTags().filter((t) => !t.isCustom));

  readonly customAvailable = computed(() => this.availableTags().filter((t) => t.isCustom));

  onAliasChange(alias: string): void {
    this.playerService.update(this.playerId(), { alias });
  }

  onColorChange(color: string): void {
    this.playerService.update(this.playerId(), { color });
  }

  onAvatarSelected(avatar: string): void {
    this.playerService.update(this.playerId(), { avatar });
    this.showEmojiPicker.set(false);
  }

  onNotesChange(notes: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.playerService.update(this.playerId(), { notes });
    }, 500);
  }

  onAddTag(tagId: string): void {
    this.playerService.addTag(this.playerId(), tagId);
  }

  onRemoveTag(tagId: string): void {
    this.playerService.removeTag(this.playerId(), tagId);
  }

  onCreateTag(): void {
    const name = this.newTagName().trim();
    if (!name) return;
    const tag = this.tagService.addCustomTag(name, this.newTagColor());
    this.playerService.addTag(this.playerId(), tag.id);
    this.newTagName.set('');
    this.newTagColor.set('#6B7280');
    this.showCreateTag.set(false);
  }

  onAddSession(): void {
    const date = this.sessionDate();
    const location = this.sessionLocation().trim();
    if (!date || !location) return;
    this.playerService.addSession(this.playerId(), {
      date,
      location,
      notes: this.sessionNotes(),
    });
    this.sessionDate.set('');
    this.sessionLocation.set('');
    this.sessionNotes.set('');
    this.showAddSession.set(false);
  }

  onRemoveSession(sessionId: string): void {
    this.playerService.removeSession(this.playerId(), sessionId);
  }

  onRemoveFromTable(): void {
    this.tableService.removePlayerFromAllSeats(this.playerId());
    this.close.emit();
  }

  onDeletePlayer(): void {
    this.tableService.removePlayerFromAllSeats(this.playerId());
    this.playerService.delete(this.playerId());
    this.showDeleteConfirm.set(false);
    this.playerDeleted.emit(this.playerId());
    this.close.emit();
  }

  onClose(): void {
    this.showTagSelector.set(false);
    this.showEmojiPicker.set(false);
    this.showAddSession.set(false);
    this.close.emit();
  }
}
