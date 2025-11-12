import { Event, Seat } from './types';

export async function getEvents(): Promise<Event[]> {
  return [
    { id: '1', title: 'The Matrix', date: '2025-10-21', location: 'Hall 1' },
    { id: '2', title: 'Inception', date: '2025-10-22', location: 'Hall 2' },
  ];
}

export async function getSeats(eventId: string): Promise<Seat[]> {
  await new Promise((r) => setTimeout(r, 3000));
  const ROWS = ['A', 'B', 'C', 'D']; // 4 rows × 10 seats = 40
  return Array.from({ length: 40 }, (_, i) => {
    const rowIndex = Math.floor(i / 10);
    const seatNumber = (i % 10) + 1;
    return {
      id: `${eventId}-seat-${i + 1}`,
      row: ROWS[rowIndex],
      number: seatNumber,
      isAvailable: Math.random() > 0.25,
    } satisfies Seat;
  });
}
