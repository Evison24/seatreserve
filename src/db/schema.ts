import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable(
  'events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description'),
    venue: varchar('venue', { length: 160 }).notNull(),
    // ISO date-times
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    createdByUserId: uuid('created_by_user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byStart: index('events_starts_at_idx').on(t.startsAt),
    byCreator: index('events_created_by_idx').on(t.createdByUserId),
    uniqueTitlePerStart: uniqueIndex('events_title_starts_unique').on(
      t.title,
      t.startsAt
    ),
  })
);

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

export const eventsRelations = relations(events, ({ many }) => ({
  seats: many(seats),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
  event: one(events, {
    fields: [seats.eventId],
    references: [events.id],
  }),
}));
