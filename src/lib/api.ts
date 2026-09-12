const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
    return localStorage.getItem('vitrino_token');
}

export function setToken(token: string): void {
    localStorage.setItem('vitrino_token', token);
}

export function clearToken(): void {
    localStorage.removeItem('vitrino_token');
}

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const url = `${API_BASE}${path}`;
    const token = getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'خطای ناشناخته' }));
        throw new ApiError(response.status, body.error || 'خطای سرور');
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// ─── Auth API ───────────────────────────────────────────────
export interface LoginResponse {
    token: string;
    user: { id: string; name: string; email: string; role: string };
}

export interface RegisterResponse {
    message: string;
    user: { id: string; name: string; email: string; role: string };
}

export const authApi = {
    login: (email: string, password: string) =>
        request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (name: string, email: string, password: string) =>
        request<RegisterResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    me: () => request<{ id: string; name: string; email: string; role: string }>('/auth/me'),
};

// ─── Products API ───────────────────────────────────────────
export interface Product {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    description?: string | null;
    specs?: Record<string, string> | null;
    categoryId?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductListResponse {
    items: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'title';
}

export const productsApi = {
    list: (params: ProductQueryParams = {}) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.set(key, String(value));
            }
        });
        const qs = query.toString();
        return request<ProductListResponse>(`/products${qs ? `?${qs}` : ''}`);
    },

    getBySlug: (slug: string) =>
        request<Product>(`/products/${slug}`),

    create: (data: { title: string; slug: string; price: number; originalPrice?: number; description?: string; specs?: Record<string, string>; categoryId?: string }) =>
        request<{ message: string; product: Product }>('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<{ title: string; slug: string; price: number; originalPrice?: number; description?: string; specs?: Record<string, string>; categoryId?: string; isActive: boolean }>) =>
        request<{ message: string; product: Product }>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),
};

// ─── Categories API ─────────────────────────────────────────
export interface Category {
    id: string;
    title: string;
    slug: string;
    parentId: string | null;
    sortOrder: number;
    children?: Category[];
    _count?: { products: number };
}

export const categoriesApi = {
    tree: () => request<{ items: Category[] }>('/categories'),

    getBySlug: (slug: string) => request<Category>(`/categories/${slug}`),

    create: (data: { title: string; slug: string; parentId?: string | null; sortOrder?: number }) =>
        request<{ message: string; category: Category }>('/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<{ title: string; slug: string; parentId?: string | null; sortOrder?: number }>) =>
        request<{ message: string; category: Category }>(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        request<{ message: string }>(`/categories/${id}`, { method: 'DELETE' }),
};
