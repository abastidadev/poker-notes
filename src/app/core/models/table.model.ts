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

export const ACTIVE_SEATS_FOR_COUNT: Record<number, number[]> = {
  6:  [2, 4, 6, 8, 10, 12],
  8:  [1, 3, 4, 6, 7, 9, 11, 12],
  9:  [1, 2, 3, 5, 7, 8, 9, 11, 12],
  10: [1, 2, 3, 4, 6, 7, 8, 9, 10, 12],
  12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

export function createDefaultTableState(): TableState {
  const seats: Record<number, string | null> = {};
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    seats[i] = null;
  }
  return { seats: seats as SeatAssignment, dealerSeat: 1, sbSeat: 2, bbSeat: 3 };
}
