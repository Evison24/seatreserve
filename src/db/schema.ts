import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const venues = pgTable(
  'venues',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    postalCode: text('postal_code'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    nameKey: uniqueIndex('venues_name_key').on(table.name),
  }),
);

export const events = pgTable(
  'events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    defaultVenueId: uuid('default_venue_id').references(() => venues.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    titleVenueKey: uniqueIndex('events_title_venue_key').on(
      table.defaultVenueId,
      table.title,
    ),
  }),
);

export const eventShowings = pgTable(
  'event_showings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    venueId: uuid('venue_id')
      .notNull()
      .references(() => venues.id, { onDelete: 'cascade' }),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    showingKey: uniqueIndex('event_showings_event_start_key').on(
      table.eventId,
      table.startsAt,
    ),
  }),
);

export const seats = pgTable(
  'seats',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    venueId: uuid('venue_id').references(() => venues.id, {
      onDelete: 'cascade',
    }),
    eventShowingId: uuid('event_showing_id').references(
      () => eventShowings.id,
      {
        onDelete: 'cascade',
      },
    ),
    section: text('section'),
    row: text('row'),
    seatNumber: text('seat_number').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    venueSeatKey: uniqueIndex('seats_venue_section_row_number_key').on(
      table.venueId,
      table.section,
      table.row,
      table.seatNumber,
    ),
    showingSeatKey: uniqueIndex('seats_showing_section_row_number_key').on(
      table.eventShowingId,
      table.section,
      table.row,
      table.seatNumber,
    ),
  }),
);

export const venuesRelations = relations(venues, ({ many }) => ({
  events: many(events),
  showings: many(eventShowings),
  seats: many(seats),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  defaultVenue: one(venues, {
    fields: [events.defaultVenueId],
    references: [venues.id],
  }),
  showings: many(eventShowings),
}));

export const eventShowingsRelations = relations(
  eventShowings,
  ({ one, many }) => ({
    event: one(events, {
      fields: [eventShowings.eventId],
      references: [events.id],
    }),
    venue: one(venues, {
      fields: [eventShowings.venueId],
      references: [venues.id],
    }),
    seats: many(seats),
  }),
);

export const seatsRelations = relations(seats, ({ one }) => ({
  venue: one(venues, {
    fields: [seats.venueId],
    references: [venues.id],
  }),
  eventShowing: one(eventShowings, {
    fields: [seats.eventShowingId],
    references: [eventShowings.id],
  }),
}));
