export interface SeatAssignment {
  readonly [seatNumber: number]: string | null;
}

export interface TableState {
  readonly seats: SeatAssignment;
  readonly dealerSeat: number;
  readonly sbSeat: number;
  readonly bbSeat: number;
}

export const TOTAL_SEATS = 12;

export function createDefaultTableState(): TableState {
  const seats: Record<number, string | null> = {};
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    seats[i] = null;
  }
  return { seats: seats as SeatAssignment, dealerSeat: 1, sbSeat: 2, bbSeat: 3 };
}
