import {
  pgTable,
  varchar,
  integer,
  timestamp,
  boolean,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { events } from './events';

export const seats = pgTable(
  'seats',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    row: varchar('row', { length: 10 }).notNull(),
    number: integer('number').notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
    priceCents: integer('price_cents').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byEvent: index('seats_event_idx').on(t.eventId),
    uniqueSeatPerEvent: uniqueIndex('seats_unique_per_event').on(
      t.eventId,
      t.row,
      t.number
    ),
  })
);
