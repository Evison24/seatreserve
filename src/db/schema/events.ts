import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const events = pgTable(
  'events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description'),
    venue: varchar('venue', { length: 160 }).notNull(),
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
