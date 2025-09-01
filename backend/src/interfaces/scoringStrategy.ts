import { Role } from "../types";

export interface IScoringStrategy {

  calculatePoints(taps: number, points: number, role: Role): { newTaps: number, newPoints: number, award: number };

}
