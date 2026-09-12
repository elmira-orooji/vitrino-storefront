import type { Product as ApiProduct } from './api';
import type { Product, ProductArtworkKind, ProductTone } from '~types/product';

// Placeholder images for products without real images yet
const PLACEHOLDER_IMAGES: Record<string, string> = {
    headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    mug: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80',
    serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
};

const ARTWORK_KINDS: ProductArtworkKind[] = ['headphones', 'mug', 'serum', 'shoe', 'watch'];
const TONES: ProductTone[] = ['coral', 'mint', 'sand', 'sky'];

function getArtworkKind(id: string): ProductArtworkKind {
    const index = id.charCodeAt(0) % ARTWORK_KINDS.length;
    return ARTWORK_KINDS[index];
}

function getTone(id: string): ProductTone {
    const index = id.charCodeAt(1) % TONES.length;
    return TONES[index];
}

/**
 * Maps an API product to the local Product type used by UI components.
 * This is a temporary adapter until the backend provides all required fields.
 */
export function mapApiProduct(apiProduct: ApiProduct): Product {
    const artwork = getArtworkKind(apiProduct.id);
    const tone = getTone(apiProduct.id);
    const originalPrice = apiProduct.originalPrice ?? apiProduct.price;
    const discount = originalPrice > apiProduct.price
        ? Math.round(((originalPrice - apiProduct.price) / originalPrice) * 100)
        : 0;

    return {
        id: apiProduct.id,
        title: apiProduct.title,
        price: apiProduct.price,
        originalPrice,
        discount,
        rating: 4.5, // Default until backend provides ratings
        popularity: 0,
        addedOrder: new Date(apiProduct.createdAt).getTime(),
        artwork,
        tone,
        image: {
            src: PLACEHOLDER_IMAGES[artwork],
            alt: apiProduct.title,
            sourceUrl: PLACEHOLDER_IMAGES[artwork],
            credit: 'Unsplash',
            position: 'center center',
        },
        categoryId: apiProduct.categoryId ?? '',
        categoryLabel: '', // Will be populated when categories are loaded
        brand: 'ویترینو', // Default until backend provides brands
        available: apiProduct.isActive,
        fastDelivery: true,
        featured: false,
    };
}

export function mapApiProducts(products: ApiProduct[]): Product[] {
    return products.map(mapApiProduct);
}
