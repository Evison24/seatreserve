import { relations } from 'drizzle-orm';
import { events } from './events';
import { seats } from './seats';
import { users } from './users';
import { bookings } from './bookings';

export const eventsRelations = relations(events, ({ many }) => ({
  seats: many(seats),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
  event: one(events, {
    fields: [seats.eventId],
    references: [events.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
  seat: one(seats, {
    fields: [bookings.seatId],
    references: [seats.id],
  }),
}));
