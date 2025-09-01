import { IScoringStrategy } from "./scoringStrategy";

export interface IRoundService {
  getRounds():Promise<{ id: string; startsAt: Date; endsAt: Date; status: string }[]>;
  createRound():Promise<{ id: string; createdAt: Date; startsAt: Date; endsAt: Date; totalPoints: number }>;
  computeStatus(now: Date, start: Date, end: Date): string;
  getRoundWithStatus(roundId: string): Promise<{ round: any; status: string }>;
  getParticipantData(roundId: string, userId: string): Promise<{ myPoints: number; myTaps: number }>;
  getRoundWinner(roundId: string): Promise<{userId: string, username: string, points: number} | null>;
  tapTransactional(roundId: string, userId: string, userRole: string, scoringStrategy: IScoringStrategy): Promise<{ taps: number; awarded: number; points: number}>;
}

