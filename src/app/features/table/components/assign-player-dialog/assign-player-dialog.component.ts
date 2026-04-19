import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../../player-profile/services/player.service';
import { Player } from '../../../../core/models/player.model';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { SettingsService } from '../../../settings/services/settings.service';

@Component({
  selector: 'app-assign-player-dialog',
  standalone: true,
  imports: [FormsModule, EmojiPickerComponent, TranslatePipe],
  templateUrl: './assign-player-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignPlayerDialogComponent {
  private readonly playerService = inject(PlayerService);
  private readonly settingsService = inject(SettingsService);

  protected readonly lang = computed(() => this.settingsService.settings().language);

  readonly open = input.required<boolean>();
  readonly seatNumber = input.required<number>();
  readonly occupiedPlayerIds = input<string[]>([]);

  readonly playerAssigned = output<string>();
  readonly close = output<void>();

  protected readonly search = signal('');
  protected readonly showCreateForm = signal(false);
  protected readonly newAlias = signal('');
  protected readonly newColor = signal('#FFFFFF');
  protected readonly newAvatar = signal('🎭');
  protected readonly showEmojiPicker = signal(false);

  protected readonly availablePlayers = computed(() => {
    const occupied = new Set(this.occupiedPlayerIds());
    const query = this.search().toLowerCase();
    return this.playerService
      .players()
      .filter((p) => !occupied.has(p.id))
      .filter((p) => !query || p.alias.toLowerCase().includes(query));
  });

  onSelectPlayer(player: Player): void {
    this.playerAssigned.emit(player.id);
    this.resetAndClose();
  }

  onCreateAndAssign(): void {
    const alias = this.newAlias().trim();
    if (!alias) return;
    const player = this.playerService.create({
      alias,
      color: this.newColor(),
      avatar: this.newAvatar(),
    });
    this.playerAssigned.emit(player.id);
    this.resetAndClose();
  }

  onClose(): void {
    this.resetAndClose();
  }

  private resetAndClose(): void {
    this.search.set('');
    this.showCreateForm.set(false);
    this.newAlias.set('');
    this.newColor.set('#3B82F6');
    this.newAvatar.set('🎭');
    this.close.emit();
  }
}
