import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../player-profile/services/player.service';
import { TagService } from '../tags/services/tag.service';
import { TagBadgeComponent } from '../../shared/components/tag-badge/tag-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Player } from '../../core/models/player.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { SettingsService } from '../settings/services/settings.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [FormsModule, TagBadgeComponent, ConfirmDialogComponent, TranslatePipe],
  templateUrl: './player-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerListComponent {
  private readonly playerService = inject(PlayerService);
  private readonly tagService = inject(TagService);
  private readonly settingsService = inject(SettingsService);

  readonly playerSelected = output<string>();
  readonly goBack = output<void>();

  protected readonly lang = computed(() => this.settingsService.settings().language);

  protected readonly search = signal('');
  protected readonly filterTagId = signal<string | null>(null);
  protected readonly deleteTarget = signal<Player | null>(null);

  readonly allTags = this.tagService.allTags;

  readonly filteredPlayers = computed(() => {
    let players = this.playerService.players();
    const query = this.search().toLowerCase();
    const tagFilter = this.filterTagId();

    if (query) {
      players = players.filter((p) => p.alias.toLowerCase().includes(query));
    }
    if (tagFilter) {
      players = players.filter((p) => p.tagIds.includes(tagFilter));
    }
    return players;
  });

  getPlayerTags(player: Player) {
    return this.tagService.getTagsByIds(player.tagIds);
  }

  onDeleteConfirmed(): void {
    const target = this.deleteTarget();
    if (target) {
      this.playerService.delete(target.id);
      this.deleteTarget.set(null);
    }
  }
}
