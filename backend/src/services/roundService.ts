import { rounds, participants, users } from '../db/schema.js';
import { and, desc, eq, asc } from 'drizzle-orm';
import type { Database, Role } from '../types.js';
import { ROUND_STATUS } from '../constants.js';
import type { IRoundService } from '../interfaces/roundService.js';
import { env } from '../env.js';
import { IScoringStrategy } from '../interfaces/scoringStrategy.js';

export class RoundServiceImpl implements IRoundService {
    constructor(private db: Database) {}

    async getRounds() {
        const data = await this.db.select().from(rounds).orderBy(desc(rounds.startsAt));
        const now = new Date();
        return data.map((r: any) => ({
            id: r.id,
            startsAt: r.startsAt,
            endsAt: r.endsAt,
            status: this.computeStatus(now, r.startsAt, r.endsAt)
        }));
    }

    async createRound() {
        const now = new Date();
        const startsAt = new Date(now.getTime() + env.COOLDOWN_DURATION * 1000);
        const endsAt = new Date(startsAt.getTime() + env.ROUND_DURATION * 1000);
        const [r] = await this.db.insert(rounds).values({
            startsAt,
            endsAt
        }).returning();
        return r;
    }

    async getRoundWithStatus(roundId: string) {
        const [r] = await this.db.select().from(rounds).where(eq(rounds.id, roundId)).limit(1);
        if (!r) throw new Error('Round not found');
        
        const now = new Date();
        const status = this.computeStatus(now, r.startsAt, r.endsAt);
        
        return { round: r, status };
    }

    async getParticipantData(roundId: string, userId: string) {
        const me = await this.db.select().from(participants)
            .where(and(eq(participants.roundId, roundId), eq(participants.userId, userId)))
            .limit(1);
        
        return {
            myPoints: me[0]?.points ?? 0,
            myTaps: me[0]?.taps ?? 0
        };
    }

    async getRoundWinner(roundId: string) {
        const winnerRows = await this.db
            .select({
                userId: participants.userId,
                username: users.username,
                points: participants.points
            })
            .from(participants)
            .innerJoin(users, eq(participants.userId, users.id))
            .where(eq(participants.roundId, roundId))
            .orderBy(desc(participants.points), asc(participants.createdAt))
            .limit(1);
        
        if (winnerRows.length === 1) {
            const w = winnerRows[0];
            return {
                userId: w.userId, 
                username: w.username, 
                points: Number(w.points)
            };
        }
        
        return null;
    }

    async tapTransactional(roundId: string, userId: string, userRole: Role, scoringStrategy: IScoringStrategy) {
        await this.db.execute('BEGIN');
        try {
            const [r] = await this.db.select().from(rounds).where(eq(rounds.id, roundId)).limit(1).for('update');
            if (!r) throw new Error('Round not found');
            
            const now = new Date();
            if (!(now >= r.startsAt && now < r.endsAt)) {
                throw new Error('Round is not active');
            }
            
            const [p] = await this.db.select().from(participants)
                .where(and(eq(participants.userId, userId), eq(participants.roundId, roundId)))
                .limit(1)
                .for('update');
                
            let participant = p;
            if (!participant) {
                const [newParticipant] = await this.db.insert(participants).values({
                    userId,
                    roundId,
                    taps: 0,
                    points: 0
                }).returning();
                participant = newParticipant;
            }
            
            const {newTaps, newPoints, award} = scoringStrategy.calculatePoints(participant.taps, participant.points, userRole);

            await this.db.update(participants)
                .set({ taps: newTaps, points: newPoints })
                .where(eq(participants.id, participant.id));
                
            if (award > 0) {
                await this.db.update(rounds)
                    .set({ totalPoints: r.totalPoints + award })
                    .where(eq(rounds.id, roundId));
            }
            
            await this.db.execute('COMMIT');
            return { taps: newTaps, awarded: award, points: newPoints};
        } catch (e) {
            await this.db.execute('ROLLBACK');
            throw e;
        }
    }

    computeStatus(now: Date, start: Date, end: Date) {
        if (now < start) return ROUND_STATUS.COOLDOWN;
        if (now >= start && now < end) return ROUND_STATUS.ACTIVE;
        return ROUND_STATUS.FINISHED;
    }
}
