import { pgTable, text, timestamp, integer, uuid, varchar } from 'drizzle-orm/pg-core';
import type { Role } from '../types';


export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 64 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: varchar('role', { length: 16 }).$type<Role>().notNull(),
    createdAt: timestamp('created_at', {
        withTimezone:
            true
    }).defaultNow().notNull()
});

export const rounds = pgTable('rounds', {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', {
        withTimezone:
            true
    }).defaultNow().notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    totalPoints: integer('total_points').notNull().default(0)
});

export const participants = pgTable('participants', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, {
        onDelete:
            'cascade'
    }),
    roundId: uuid('round_id').notNull().references(() => rounds.id, {
        onDelete: 'cascade'
    }),
    taps: integer('taps').notNull().default(0),
    points: integer('points').notNull().default(0),
    createdAt: timestamp('created_at', {
        withTimezone:
            true
    }).defaultNow().notNull()
});
