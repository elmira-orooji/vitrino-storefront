import { Hono } from 'hono';
import { prisma } from '../db/client.js';
import { hashPassword, comparePassword, createToken } from '../lib/auth.js';
import { registerSchema, loginSchema } from '../lib/schemas.js';
import { authMiddleware, getAuthUser } from '../middleware/auth.js';

const auth = new Hono();

// POST /api/auth/register
auth.post('/register', async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'درخواست نامعتبر' }, 400);

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.errors[0].message }, 400);
    }

    const { email, password, name, phone } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, ...(phone ? [{ phone }] : [])] },
    });

    if (existing) {
        return c.json({ error: 'ایمیل یا شماره موبایل قبلاً ثبت شده است' }, 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, phone },
    });

    const token = await createToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return c.json({
        message: 'ثبت‌نام موفق',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }, 201);
});

// POST /api/auth/login
auth.post('/login', async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'درخواست نامعتبر' }, 400);

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.errors[0].message }, 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return c.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, 401);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
        return c.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, 401);
    }

    const token = await createToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return c.json({
        message: 'ورود موفق',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
});

// GET /api/auth/me
auth.get('/me', authMiddleware, async (c) => {
    const payload = getAuthUser(c)!;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
        return c.json({ error: 'کاربر یافت نشد' }, 404);
    }

    return c.json({ user });
});

export default auth;
