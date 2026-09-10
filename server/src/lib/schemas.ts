import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('ایمیل نامعتبر است'),
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').optional(),
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل نامعتبر است').optional(),
});

export const loginSchema = z.object({
    email: z.string().email('ایمیل نامعتبر است'),
    password: z.string().min(1, 'رمز عبور الزامی است'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Product schemas
export const createProductSchema = z.object({
    title: z.string().min(2, 'عنوان محصول الزامی است'),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'اسلاگ باید فقط شامل حروف کوچک، اعداد و خط تیره باشد'),
    description: z.string().optional(),
    price: z.number().int().positive('قیمت باید عدد مثبت باشد'),
    originalPrice: z.number().int().positive().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    specs: z.record(z.any()).optional().default({}),
    inStock: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.coerce.number().int().optional(),
    maxPrice: z.coerce.number().int().optional(),
    inStock: z.coerce.boolean().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'oldest']).optional().default('newest'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
