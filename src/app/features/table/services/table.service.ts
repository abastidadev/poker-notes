import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
  TableState,
  createDefaultTableState,
  ACTIVE_SEATS_FOR_COUNT,
} from '../../../core/models/table.model';
import { StorageService } from '../../../core/services/storage.service';
import { SettingsService } from '../../settings/services/settings.service';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly storage = inject(StorageService);
  private readonly settingsService = inject(SettingsService);

  readonly tableState = signal<TableState>(this.loadTable());

  readonly seats = computed(() => this.tableState().seats);
  readonly dealerSeat = computed(() => this.tableState().dealerSeat);
  readonly sbSeat = computed(() => this.tableState().sbSeat);
  readonly bbSeat = computed(() => this.tableState().bbSeat);

  readonly occupiedSeats = computed(() => {
    const s = this.seats();
    return Object.keys(s)
      .map(Number)
      .filter((n) => s[n] !== null)
      .sort((a, b) => a - b);
  });

  constructor() {
    effect(() => this.storage.set('table', this.tableState()));
  }

  assignPlayer(seatNumber: number, playerId: string): void {
    this.tableState.update((state) => ({
      ...state,
      seats: { ...state.seats, [seatNumber]: playerId },
    }));
  }

  removeSeatPlayer(seatNumber: number): void {
    this.tableState.update((state) => ({
      ...state,
      seats: { ...state.seats, [seatNumber]: null },
    }));
  }

  removePlayerFromAllSeats(playerId: string): void {
    this.tableState.update((state) => {
      const newSeats = { ...state.seats };
      for (const key of Object.keys(newSeats)) {
        if (newSeats[Number(key)] === playerId) {
          newSeats[Number(key)] = null;
        }
      }
      return { ...state, seats: newSeats };
    });
  }

  getPlayerSeat(playerId: string): number | null {
    const s = this.seats();
    for (const key of Object.keys(s)) {
      if (s[Number(key)] === playerId) return Number(key);
    }
    return null;
  }

  rotateDealer(): void {
    this.tableState.update((state) => ({
      ...state,
      dealerSeat: this.nextSeat(state.dealerSeat),
    }));
  }

  rotateSB(): void {
    this.tableState.update((state) => ({
      ...state,
      sbSeat: this.nextSeat(state.sbSeat),
    }));
  }

  rotateBB(): void {
    this.tableState.update((state) => ({
      ...state,
      bbSeat: this.nextSeat(state.bbSeat),
    }));
  }

  private nextSeat(current: number): number {
    const count = this.settingsService.settings().seatCount;
    const activeSeats = ACTIVE_SEATS_FOR_COUNT[count] ?? ACTIVE_SEATS_FOR_COUNT[12];
    const idx = activeSeats.indexOf(current);
    if (idx === -1) return activeSeats[0];
    return activeSeats[(idx + 1) % activeSeats.length];
  }

  private loadTable(): TableState {
    return this.storage.get<TableState>('table') ?? createDefaultTableState();
  }
}
