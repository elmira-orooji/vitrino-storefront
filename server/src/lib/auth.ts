import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'vitrino-dev-secret-change-in-production';
const TOKEN_EXPIRY = '7d'; // 7 days

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export async function createToken(payload: JwtPayload): Promise<string> {
    return await sign(
        { ...payload, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
        JWT_SECRET
    );
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const decoded = await verify(token, JWT_SECRET, 'HS256');
        return decoded as unknown as JwtPayload;
    } catch {
        return null;
    }
}

// Password hashing using Web Crypto API (no external deps)
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_vitrino_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    const computed = await hashPassword(password);
    return computed === hash;
}
