import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env.js';
import jwtPlugin from './auth/jwt.js';
import { makeDb } from './db/init.js';
import { authRoutes } from './routes/auth.js';
import { roundRoutes } from './routes/rounds.js';
import { IRoundService } from './interfaces/roundService.js';
import { RoundServiceImpl } from './services/roundService.js';
import { AuthServiceImpl } from './services/authService.js';
import { NikitaNerfingStrategy } from './services/nikitaNerfingStrategy.js';

async function main() {
    const app = Fastify({ logger: true });
    
    const { db } = await makeDb();

    const roundService = new RoundServiceImpl(db);
    const authService = new AuthServiceImpl(db);
    const scoringStrategy = new NikitaNerfingStrategy();
    
    await app.register(cors, { origin: true, credentials: true });
    await app.register(jwtPlugin);
    
    await app.register(authRoutes, { authService });
    await app.register(roundRoutes, { roundService, scoringStrategy });
    await app.listen({port:env.PORT});
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});