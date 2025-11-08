import { Event, Seat } from './types';

export async function getEvents(): Promise<Event[]> {
  return [
    { id: '1', title: 'The Matrix', date: '2025-10-21', location: 'Hall 1' },
    { id: '2', title: 'Inception', date: '2025-10-22', location: 'Hall 2' },
  ];
}

export async function getSeats(eventId: string): Promise<Seat[]> {
  // simulate delay
  await new Promise((r) => setTimeout(r, 300));
  return Array.from({ length: 40 }, (_, i) => ({
    id: `${eventId}-seat-${i + 1}`,
    row: Math.floor(i / 10) + 1,
    number: (i % 10) + 1,
    isAvailable: Math.random() > 0.25, // 75% available
  }));
}
