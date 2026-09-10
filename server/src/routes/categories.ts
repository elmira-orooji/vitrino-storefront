import { Hono } from 'hono';
import { prisma } from '../db/client.js';
import { authMiddleware, getAuthUser } from '../middleware/auth.js';
import { z } from 'zod';

const categories = new Hono();

const createCategorySchema = z.object({
    title: z.string().min(2, 'عنوان دسته‌بندی الزامی است'),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'اسلاگ نامعتبر است'),
    parentId: z.string().uuid().optional().nullable(),
    sortOrder: z.number().int().optional().default(0),
});

const updateCategorySchema = createCategorySchema.partial();

// GET /api/categories - Tree structure
categories.get('/', async (c) => {
    const allCategories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
            _count: { select: { products: true } },
        },
    });

    // Build tree
    const map = new Map<string, any>();
    const roots: any[] = [];

    for (const cat of allCategories) {
        map.set(cat.id, { ...cat, children: [] });
    }

    for (const cat of allCategories) {
        const node = map.get(cat.id);
        if (cat.parentId && map.has(cat.parentId)) {
            map.get(cat.parentId).children.push(node);
        } else {
            roots.push(node);
        }
    }

    return c.json({ items: roots });
});

// GET /api/categories/:slug - Single category with products count
categories.get('/:slug', async (c) => {
    const slug = c.req.param('slug');

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            parent: { select: { id: true, slug: true, title: true } },
            children: { orderBy: { sortOrder: 'asc' } },
            _count: { select: { products: true } },
        },
    });

    if (!category) {
        return c.json({ error: 'دسته‌بندی یافت نشد' }, 404);
    }

    return c.json(category);
});

// POST /api/categories - Create (admin only)
categories.post('/', authMiddleware, async (c) => {
    const user = getAuthUser(c)!;
    if (user.role !== 'ADMIN') {
        return c.json({ error: 'دسترسی محدود به ادمین' }, 403);
    }

    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'درخواست نامعتبر' }, 400);

    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;

    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
        return c.json({ error: 'اسلاگ تکراری است' }, 409);
    }

    if (data.parentId) {
        const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
        if (!parent) {
            return c.json({ error: 'دسته والد یافت نشد' }, 404);
        }
    }

    const category = await prisma.category.create({
        data: {
            title: data.title,
            slug: data.slug,
            parentId: data.parentId ?? null,
            sortOrder: data.sortOrder ?? 0,
        },
    });

    return c.json({ message: 'دسته‌بندی ایجاد شد', category }, 201);
});

// PUT /api/categories/:id - Update (admin only)
categories.put('/:id', authMiddleware, async (c) => {
    const user = getAuthUser(c)!;
    if (user.role !== 'ADMIN') {
        return c.json({ error: 'دسترسی محدود به ادمین' }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'درخواست نامعتبر' }, 400);

    const parsed = updateCategorySchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.errors[0].message }, 400);
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
        return c.json({ error: 'دسته‌بندی یافت نشد' }, 404);
    }

    const category = await prisma.category.update({
        where: { id },
        data: parsed.data,
    });

    return c.json({ message: 'دسته‌بندی بروزرسانی شد', category });
});

// DELETE /api/categories/:id - Delete (admin only)
categories.delete('/:id', authMiddleware, async (c) => {
    const user = getAuthUser(c)!;
    if (user.role !== 'ADMIN') {
        return c.json({ error: 'دسترسی محدود به ادمین' }, 403);
    }

    const id = c.req.param('id');

    // Check if has children
    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
        return c.json({ error: 'ابتدا زیردسته‌ها را حذف کنید' }, 400);
    }

    // Check if has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
        return c.json({ error: 'این دسته‌بندی دارای محصول است' }, 400);
    }

    try {
        await prisma.category.delete({ where: { id } });
        return c.json({ message: 'دسته‌بندی حذف شد' });
    } catch {
        return c.json({ error: 'دسته‌بندی یافت نشد' }, 404);
    }
});

export default categories;
