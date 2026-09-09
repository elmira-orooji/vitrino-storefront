export interface StorefrontRoute {
    page: 'home' | 'products' | 'product' | 'account';
    productId: string;
    query: string;
    categoryId: string;
    anchor: string;
}

export const homeRoute: StorefrontRoute = {
    page: 'home',
    productId: '',
    query: '',
    categoryId: '',
    anchor: '',
};

export function getRouteFromHash(hash: string): StorefrontRoute | null {
    const [path, search = ''] = hash.slice(1).split('?');

    if (path.startsWith('product-')) {
        return { ...homeRoute, page: 'product', productId: path.slice('product-'.length) };
    }

    if (path === 'products') {
        const params = new URLSearchParams(search);
        return {
            page: 'products',
            productId: '',
            query: params.get('q')?.trim() ?? '',
            categoryId: params.get('category') ?? '',
            anchor: '',
        };
    }

    if (path === 'account') return { ...homeRoute, page: 'account' };

    if (path === '' || path === 'home' || path === 'categories' || path === 'special-offers') {
        return { ...homeRoute, anchor: path === 'categories' || path === 'special-offers' ? path : '' };
    }

    // In-page anchors and unfinished destinations must not replace the current page.
    return null;
}

export function getCatalogHref(route: StorefrontRoute | null): string {
    const params = new URLSearchParams();
    if (route?.query) params.set('q', route.query);
    if (route?.categoryId) params.set('category', route.categoryId);
    return `#products${params.size > 0 ? `?${params}` : ''}`;
}
