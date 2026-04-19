import { Component, ChangeDetectionStrategy, input, output, computed, inject } from '@angular/core';
import { TagBadgeComponent } from '../../../../shared/components/tag-badge/tag-badge.component';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { PlayerService } from '../../../player-profile/services/player.service';
import { TagService } from '../../../tags/services/tag.service';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [TagBadgeComponent, TruncatePipe],
  templateUrl: './seat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatComponent {
  private readonly playerService = inject(PlayerService);
  private readonly tagService = inject(TagService);

  readonly seatNumber = input.required<number>();
  readonly playerId = input<string | null>(null);
  readonly isDealer = input(false);
  readonly isSB = input(false);
  readonly isBB = input(false);

  readonly seatClicked = output<number>();

  readonly player = computed(() => {
    const id = this.playerId();
    return id ? (this.playerService.getById(id) ?? null) : null;
  });

  readonly playerTags = computed(() => {
    const p = this.player();
    if (!p) return [];
    return this.tagService.getTagsByIds(p.tagIds);
  });

  readonly visibleTags = computed(() => this.playerTags().slice(0, 3));
  readonly extraTagCount = computed(() => Math.max(0, this.playerTags().length - 3));

  readonly isOccupied = computed(() => !!this.player());
}
