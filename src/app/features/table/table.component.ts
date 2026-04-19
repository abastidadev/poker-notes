import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  output,
  OnInit,
  OnDestroy,
  DOCUMENT,
} from '@angular/core';
import { SeatComponent } from './components/seat/seat.component';
import { AssignPlayerDialogComponent } from './components/assign-player-dialog/assign-player-dialog.component';
import { TableService } from './services/table.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { SettingsService } from '../../features/settings/services/settings.service';

interface SeatPosition {
  number: number;
  top: string;
  left: string;
}

/**
 * Compute n evenly-spaced seat positions along the seating ellipse.
 * Container aspectRatio = 2/1.2 → H = 0.6 * W
 * Seating ellipse (CSS %): left = 50 + 47*cos(t), top = 50 + 46.67*sin(t)
 * This matches the visual ellipse of the felt table (inset [14%]) with outer padding.
 */
function computeSeatPositions(n: number): SeatPosition[] {
  const positions: SeatPosition[] = [];
  for (let i = 0; i < n; i++) {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const left = 50 + 47 * Math.cos(t);
    const top = 50 + 46.67 * Math.sin(t);
    positions.push({ number: i + 1, top: `${top.toFixed(2)}%`, left: `${left.toFixed(2)}%` });
  }
  return positions;
}

interface ContextMenu {
  x: number;
  y: number;
  type: 'seat-occupied' | 'seat-empty' | 'add-seat';
  seatNumber?: number;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [SeatComponent, AssignPlayerDialogComponent, TranslatePipe],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy {
  private readonly tableService = inject(TableService);
  private readonly document = inject(DOCUMENT);
  private readonly settingsService = inject(SettingsService);

  protected readonly lang = computed(() => this.settingsService.settings().language);

  readonly seatClicked = output<{ seatNumber: number; playerId: string | null }>();

  protected readonly activePositions = computed(() =>
    computeSeatPositions(this.settingsService.settings().seatCount),
  );

  protected readonly showAssignDialog = signal(false);
  protected readonly selectedEmptySeat = signal(0);
  protected readonly contextMenu = signal<ContextMenu | null>(null);

  protected readonly seats = this.tableService.seats;

  protected readonly dealerSeat = computed(() =>
    Math.min(this.tableService.dealerSeat(), this.settingsService.settings().seatCount),
  );
  protected readonly sbSeat = computed(() =>
    Math.min(this.tableService.sbSeat(), this.settingsService.settings().seatCount),
  );
  protected readonly bbSeat = computed(() =>
    Math.min(this.tableService.bbSeat(), this.settingsService.settings().seatCount),
  );

  ngOnInit(): void {
    this.document.documentElement.style.overflow = 'hidden';
    this.document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    this.document.documentElement.style.overflow = '';
    this.document.body.style.overflow = '';
  }

  protected readonly occupiedPlayerIds = computed(() => {
    const s = this.seats();
    return Object.values(s).filter((id): id is string => id !== null);
  });

  onSeatClicked(seatNumber: number): void {
    this.contextMenu.set(null);
    const playerId = this.seats()[seatNumber] ?? null;
    if (playerId) {
      this.seatClicked.emit({ seatNumber, playerId });
    } else {
      this.selectedEmptySeat.set(seatNumber);
      this.showAssignDialog.set(true);
    }
  }

  onSeatContextMenu(event: MouseEvent, seatNumber: number): void {
    event.preventDefault();
    event.stopPropagation();
    const isOccupied = !!this.seats()[seatNumber];
    this.contextMenu.set({
      x: event.clientX,
      y: event.clientY,
      type: isOccupied ? 'seat-occupied' : 'seat-empty',
      seatNumber,
    });
  }

  onTableContextMenu(event: MouseEvent): void {
    event.preventDefault();
    const count = this.settingsService.settings().seatCount;
    if (count >= 12) return;
    this.contextMenu.set({ x: event.clientX, y: event.clientY, type: 'add-seat' });
  }

  onContextMenuRemove(): void {
    const m = this.contextMenu();
    if (m?.seatNumber !== undefined) {
      this.tableService.removeSeatPlayer(m.seatNumber);
      const count = this.settingsService.settings().seatCount;
      if (count > 2) this.settingsService.setSeatCount(count - 1);
    }
    this.contextMenu.set(null);
  }

  onContextMenuRemoveEmpty(): void {
    const count = this.settingsService.settings().seatCount;
    if (count > 2) this.settingsService.setSeatCount(count - 1);
    this.contextMenu.set(null);
  }

  onContextMenuAdd(): void {
    const m = this.contextMenu();
    if (m?.seatNumber !== undefined) {
      this.selectedEmptySeat.set(m.seatNumber);
      this.showAssignDialog.set(true);
    }
    this.contextMenu.set(null);
  }

  onContextMenuAddSeat(): void {
    const count = this.settingsService.settings().seatCount;
    if (count < 12) this.settingsService.setSeatCount(count + 1);
    this.contextMenu.set(null);
  }

  closeContextMenu(): void {
    this.contextMenu.set(null);
  }

  onPlayerAssigned(playerId: string): void {
    this.tableService.assignPlayer(this.selectedEmptySeat(), playerId);
    this.showAssignDialog.set(false);
  }

  onRotateDealer(): void {
    this.tableService.rotateDealer();
  }

  onRotateSB(): void {
    this.tableService.rotateSB();
  }

  onRotateBB(): void {
    this.tableService.rotateBB();
  }
}
