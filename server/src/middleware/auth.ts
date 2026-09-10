import { Context, Next } from 'hono';
import { verifyToken, JwtPayload } from '../lib/auth.js';

// Extend Hono's context type
declare module 'hono' {
    interface ContextVariableMap {
        user: JwtPayload;
    }
}

export async function authMiddleware(c: Context, next: Next) {
    const header = c.req.header('Authorization');

    if (!header || !header.startsWith('Bearer ')) {
        return c.json({ error: 'توکن احراز هویت الزامی است' }, 401);
    }

    const token = header.substring(7);
    const payload = await verifyToken(token);

    if (!payload) {
        return c.json({ error: 'توکن نامعتبر یا منقضی شده است' }, 401);
    }

    c.set('user', payload);
    await next();
}

export function getAuthUser(c: Context): JwtPayload | undefined {
    return c.get('user');
}
