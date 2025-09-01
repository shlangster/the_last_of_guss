// Game mechanics constants
export const GAME_CONSTANTS = {
  BONUS_TAP_INTERVAL: 11, 
  BONUS_POINTS: 10,   
  REGULAR_POINTS: 1,
} as const;

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  SURVIVOR: 'survivor', 
  NIKITA: 'nikita',
} as const;

// Status constants
export const ROUND_STATUS = {
  COOLDOWN: 'cooldown',
  ACTIVE: 'active',
  FINISHED: 'finished',
} as const;
