import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { events } from './events';
import { seats } from './seats';
import { users } from './users';

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    seatId: uuid('seat_id')
      .notNull()
      .references(() => seats.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 16 })
      .$type<'active' | 'cancelled'>()
      .notNull()
      .default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byUser: index('idx_bookings_user').on(t.userId),
    byEvent: index('idx_bookings_event').on(t.eventId),
    uniqueActivePerSeat: uniqueIndex('uq_bookings_seat_active').on(t.seatId, t.status),
  })
);
