export type ProductArtworkKind = 'headphones' | 'mug' | 'serum' | 'shoe' | 'watch';
export type ProductTone = 'coral' | 'mint' | 'sand' | 'sky';

export interface ProductImage {
    src: string;
    alt: string;
    sourceUrl: string;
    credit: string;
    position?: string;
}

export interface Product {
    /** Stable product identifier. */
    id: string;
    /** Product title shown to the customer. */
    title: string;
    /** Current selling price in toman. */
    price: number;
    /** Previous price in toman. */
    originalPrice: number;
    /** Discount percentage, or zero for regular-price products. */
    discount: number;
    /** Rating displayed as sample catalog data. */
    rating: number;
    /** Number used for the popularity sort option. */
    popularity: number;
    /** Number used for newest-first sorting. */
    addedOrder: number;
    /** Independent vector artwork variant. */
    artwork: ProductArtworkKind;
    /** Color treatment for the artwork surface. */
    tone: ProductTone;
    /** Real product photograph and its public source. */
    image: ProductImage;
    /** Category identifier used by filters. */
    categoryId: string;
    /** User-facing category label. */
    categoryLabel: string;
    /** Sample brand label. */
    brand: string;
    /** Whether the sample product is currently available. */
    available: boolean;
    /** Whether fast delivery is available in the sample catalog. */
    fastDelivery: boolean;
    /** Whether the product appears in home-page offers. */
    featured: boolean;
}
