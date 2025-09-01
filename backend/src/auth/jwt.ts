import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';
import cookie from 'fastify-cookie';
import { env } from '../env.js';
import { Role } from '../types.js';


export interface JwtPayload {
    id: string; 
    username: string; 
    role: Role;
}

export default fp(async (app) => {
    await app.register(cookie);
    await app.register(fastifyJwt, {
        secret: env.JWT_SECRET,
        cookie: { cookieName: env.JWT_COOKIE_NAME, signed: false },
    });
    app.decorate('auth', async (req: any, _rep: any) => {
        try { 
            await req.jwtVerify(); 
        } catch {
            throw new Error('Unauthorized');
        }
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        auth: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    }
}

declare module 'fastify-jwt' {
    interface FastifyJWT {
        payload: JwtPayload;
        user: JwtPayload;
    }
}