import { users } from '../db/schema.js';
import { eq} from 'drizzle-orm';
import type { Database, Role } from '../types.js';
import { ROLES } from '../constants.js';
import { IAuthService } from '../interfaces/authService.js';
import * as bcrypt from 'bcryptjs';

export class AuthServiceImpl implements IAuthService {
    constructor(private db: Database) {}

    async createUser(username: string, password: string): Promise<{id: string, username: string, role: Role}> {
        const role: Role = username === 'admin' ? ROLES.ADMIN : (username === 'никита' ? ROLES.NIKITA : ROLES.SURVIVOR);
        const hash = await bcrypt.hash(password, 10);
        const [created] = await this.db.insert(users).values({
            username,
            passwordHash: hash, 
            role
        }).returning();
        return {id: created.id, username:created.username, role: role};
    }

    async getUser(username: string): Promise<{id: string, username: string, passwordHash:string, role: Role}> {
        const [user] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
        return user;
    }

    async checkPasswordHash(password: string, hash: string): Promise<boolean> {
        const res = await bcrypt.compare(password, hash);
        return res;
    }
}
