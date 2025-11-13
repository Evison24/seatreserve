export type BookingStatus = 'active' | 'cancelled';

export interface BookingRow {
  id: string;
  status: BookingStatus;
  createdAt: Date;
  eventTitle: string;
  seatRow: string;
  seatNumber: number;
}
