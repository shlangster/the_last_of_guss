import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from './db/schema.js';


export type Role = 'admin' | 'survivor' | 'nikita'
export type RoundStatus = 'cooldown' | 'active' | 'finished'
export type Database = NodePgDatabase<typeof schema> & { $client: Client }