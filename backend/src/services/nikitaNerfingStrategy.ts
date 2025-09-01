import type { Role } from '../types.js';
import { GAME_CONSTANTS, ROLES } from '../constants.js';
import { IScoringStrategy } from '../interfaces/scoringStrategy.js';

export class NikitaNerfingStrategy implements IScoringStrategy {

    calculatePoints(taps: number, points: number, role:Role): {newTaps: number, newPoints: number, award: number} {
        const newTaps = taps + 1;
        const award = (newTaps % GAME_CONSTANTS.BONUS_TAP_INTERVAL === 0) ? GAME_CONSTANTS.BONUS_POINTS : GAME_CONSTANTS.REGULAR_POINTS; 
        const effectiveAward = role === ROLES.NIKITA ? 0 : award;
        return {newTaps, newPoints: points + effectiveAward, award: effectiveAward};
    }

}
