import { Hono } from 'hono';
import { prisma } from '../db/client.js';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../lib/schemas.js';
import { authMiddleware, getAuthUser } from '../middleware/auth.js';

const products = new Hono();

// GET /api/products - List with filters & pagination
products.get('/', async (c) => {
    const params = productQuerySchema.safeParse(c.req.query());
    if (!params.success) {
        return c.json({ error: params.error.errors[0].message }, 400);
    }

    const { page, limit, category, search, minPrice, maxPrice, inStock, sort } = params.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (category) {
        where.category = { slug: category };
    }
    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } },
        ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (inStock !== undefined) {
        where.inStock = inStock;
    }

    // Sort order
    const orderBy: any = {};
    switch (sort) {
        case 'price_asc': orderBy.price = 'asc'; break;
        case 'price_desc': orderBy.price = 'desc'; break;
        case 'oldest': orderBy.createdAt = 'asc'; break;
        case 'newest': default: orderBy.createdAt = 'desc'; break;
    }

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                category: { select: { id: true, slug: true, title: true } },
            },
        }),
        prisma.product.count({ where }),
    ]);

    // Parse specs JSON string back to object
    const parsedItems = items.map((item) => ({
        ...item,
        specs: safeJsonParse(item.specs),
    }));

    return c.json({
        items: parsedItems,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});

// GET /api/products/:slug - Single product by slug
products.get('/:slug', async (c) => {
    const slug = c.req.param('slug');

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: { select: { id: true, slug: true, title: true } },
        },
    });

    if (!product) {
        return c.json({ error: 'محصول یافت نشد' }, 404);
    }

    return c.json({
        ...product,
        specs: safeJsonParse(product.specs),
    });
});

// POST /api/products - Create (admin only)
products.post('/', authMiddleware, async (c) => {
    const user = getAuthUser(c)!;
    if (user.role !== 'ADMIN') {
        return c.json({ error: 'دسترسی محدود به ادمین' }, 403);
    }

    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'درخواست نامعتبر' }, 400);

    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.errors[0].message }, 400);
    }

    const data = parsed.data;

    // Check duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
        return c.json({ error: 'اسلاگ تکراری است' }, 409);
    }

    const product = await prisma.product.create({
        data: {
            ...data,
            specs: JSON.stringify(data.specs || {}),
            originalPrice: data.originalPrice ?? null,
            imageUrl: data.imageUrl ?? null,
            categoryId: data.categoryId ?? null,
        },
        include: {
            category: { select: { id: true, slug: true, title: true } },
        },
    });

    return c.json({
        message: 'محصول ایجاد شد',
        product: { ...product, specs: safeJsonParse(product.specs) },
    }, 201);
});

// PUT /api/products/:id - Update (admin only)
products.put('/:id', authMiddleware, async (c) => {
    const user = getAuthUser(c)!;
    if (user.role !== 'ADMIN') {
        return c.json({ error: 'دسترسی محدود به ادمین' }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json().catch(() => null);
    if (!body) return c.json({ error: 'درخواست نامعتبر' }, 400);

    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.errors[0].message }, 400);
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
        return c.json({ error: 'محصول یافت نشد' }, 404);
    }

    const data = parsed.data;
    const updateData: any = { ...data };
    if (data.specs !== undefined) updateData.specs = JSON.stringify(data.specs);

    const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
            category: { select: { id: true, slug: true, title: true } },
        },
    });

    return c.json({
        message: 'محصول بروزرسانی شد',
        product: { ...product, specs: safeJsonParse(product.specs) },
    });
});

// DELETE /api/products/:id - Delete (admin only)
products.delete('/:id', authMiddleware, async (c) => {
    const user = getAuthUser(c)!;
    if (user.role !== 'ADMIN') {
        return c.json({ error: 'دسترسی محدود به ادمین' }, 403);
    }

    const id = c.req.param('id');

    try {
        await prisma.product.delete({ where: { id } });
        return c.json({ message: 'محصول حذف شد' });
    } catch {
        return c.json({ error: 'محصول یافت نشد' }, 404);
    }
});

// Helper: safely parse JSON string
function safeJsonParse(str: string): Record<string, any> {
    try {
        return JSON.parse(str);
    } catch {
        return {};
    }
}

export default products;
