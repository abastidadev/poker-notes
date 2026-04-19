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
  2:  [2, 8],
  3:  [2, 6, 10],
  4:  [2, 5, 8, 11],
  5:  [1, 3, 6, 9, 11],
  6:  [2, 4, 6, 8, 10, 12],
  7:  [1, 2, 4, 7, 8, 10, 12],
  8:  [1, 3, 4, 6, 7, 9, 11, 12],
  9:  [1, 2, 3, 5, 7, 8, 9, 11, 12],
  10: [1, 2, 3, 4, 6, 7, 8, 9, 10, 12],
  11: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
  12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};

export function createDefaultTableState(): TableState {
  const seats: Record<number, string | null> = {};
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    seats[i] = null;
  }
  return { seats: seats as SeatAssignment, dealerSeat: 1, sbSeat: 2, bbSeat: 3 };
}
