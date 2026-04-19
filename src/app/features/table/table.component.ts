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
import { TOTAL_SEATS, ACTIVE_SEATS_FOR_COUNT } from '../../core/models/table.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { SettingsService } from '../../features/settings/services/settings.service';

interface SeatPosition {
  number: number;
  top: string;
  left: string;
}

// Positions within the relative container. overflow-visible + outer padding
// ensure seats never clip even after -translate-x/y-1/2 centering.
const SEAT_POSITIONS: SeatPosition[] = [
  // Top row (1-3)
  { number: 1, top: '6%', left: '25%' },
  { number: 2, top: '3%', left: '50%' },
  { number: 3, top: '6%', left: '75%' },
  // Right side (4-6)
  { number: 4, top: '27%', left: '93%' },
  { number: 5, top: '50%', left: '97%' },
  { number: 6, top: '73%', left: '93%' },
  // Bottom row (7-9)
  { number: 7, top: '94%', left: '75%' },
  { number: 8, top: '97%', left: '50%' },
  { number: 9, top: '94%', left: '25%' },
  // Left side (10-12)
  { number: 10, top: '73%', left: '7%' },
  { number: 11, top: '50%', left: '3%' },
  { number: 12, top: '27%', left: '7%' },
];

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

  protected readonly seatPositions = SEAT_POSITIONS;
  protected readonly activePositions = computed(() => {
    const count = this.settingsService.settings().seatCount;
    const activeNums = new Set(ACTIVE_SEATS_FOR_COUNT[count] ?? ACTIVE_SEATS_FOR_COUNT[12]);
    return SEAT_POSITIONS.filter((p) => activeNums.has(p.number));
  });
  protected readonly showAssignDialog = signal(false);
  protected readonly selectedEmptySeat = signal(0);

  protected readonly seats = this.tableService.seats;
  protected readonly dealerSeat = this.tableService.dealerSeat;
  protected readonly sbSeat = this.tableService.sbSeat;
  protected readonly bbSeat = this.tableService.bbSeat;

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
    const playerId = this.seats()[seatNumber] ?? null;
    if (playerId) {
      this.seatClicked.emit({ seatNumber, playerId });
    } else {
      this.selectedEmptySeat.set(seatNumber);
      this.showAssignDialog.set(true);
    }
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
