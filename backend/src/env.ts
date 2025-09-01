import 'dotenv/config';
import { z } from 'zod';
const EnvSchema = z.object({
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string().min(16),
    JWT_COOKIE_NAME: z.string().default('auth'),
    JWT_EXPIRES: z.string().default('30d'),
    ROUND_DURATION: z.coerce.number().int().positive().default(60),
    COOLDOWN_DURATION: z.coerce.number().int().nonnegative().default(30),
    PORT: z.coerce.number().int().positive().default(3000)
});
export const env = EnvSchema.parse(process.env);