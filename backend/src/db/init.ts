import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import { env } from '../env.js';


export async function makeDb() {
    const client = new Client({ connectionString: env.DATABASE_URL });
    await client.connect();
    const db = drizzle(client, { schema });

    await client.query(`
        create table if not exists users (
            id uuid primary key default gen_random_uuid(),
            username varchar(64) not null unique,
            password_hash text not null,
            role varchar(16) not null,
            created_at timestamptz not null default now()
        );
        create table if not exists rounds (
            id uuid primary key default gen_random_uuid(),
            created_at timestamptz not null default now(),
            starts_at timestamptz not null,
            ends_at timestamptz not null,
            total_points integer not null default 0
        );
        create table if not exists participants (
            id uuid primary key default gen_random_uuid(),
            user_id uuid not null references users(id) on delete cascade,
            round_id uuid not null references rounds(id) on delete cascade,
            taps integer not null default 0,
            points integer not null default 0,
            created_at timestamptz not null default now(),
            constraint participants_user_round unique (user_id, round_id)
        );
        create index if not exists idx_rounds_starts_ends on rounds(starts_at, ends_at);
        create index if not exists idx_participants_round on participants(round_id);
    `);
    
    return { db } as const;
}