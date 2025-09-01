import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { IAuthService } from '../interfaces/authService.js';


const bodySchema = z.object({
    username: z.string().min(1), 
    password: z.string().min(1)
});

export const authRoutes: FastifyPluginAsync<{ authService: IAuthService }> = async (app, opts) => {
    const { authService } = opts;

    app.post('/auth/login', async (req, rep) => {
        const body = bodySchema.parse(req.body);
        const uname = body.username.trim().toLowerCase();
        const existing = await authService.getUser(uname);
        if (!existing) {
            const created = await authService.createUser(uname, body.password);
            
            const token = await rep.jwtSign({
                id: created.id, 
                username: created.username, 
                role: created.role
            });
            rep.setCookie(
                process.env.JWT_COOKIE_NAME!, 
                token, 
                {
                    httpOnly: true,
                    path: '/', 
                    sameSite: 'lax'
                });
            return {
                id: created.id, 
                username: created.username, 
                role: created.role
            };
        } else {
            
            const ok = await authService.checkPasswordHash(body.password, existing.passwordHash);
            if (!ok) return rep.code(400).send({ error: 'Неверный пароль' });
            const token = await rep.jwtSign({
                id: existing.id, 
                username: existing.username,
                role: existing.role
            });
            rep.setCookie(process.env.JWT_COOKIE_NAME!, 
                token, 
                {
                    httpOnly: true,
                    path: '/', 
                    sameSite: 'lax'
                });
            return { id: existing.id, username: existing.username, role: existing.role };
        }
    });

    app.post('/auth/logout', async (_req, rep) => {
        rep.clearCookie(process.env.JWT_COOKIE_NAME!);
        return { ok: true };
    });
    
    app.get('/auth/me', { preValidation: [app.auth] }, async (req, _rep) => {
        return req.user;
    });
};