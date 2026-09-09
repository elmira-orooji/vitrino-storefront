import type { Product } from '~types/product';

import type { ProductDetails, ProductSelection } from '../types';

export function validateSelection(product: Product, details: ProductDetails, selection: ProductSelection): string | null {
    if (!product.available) return 'این محصول فعلاً موجود نیست.';
    if (details.colors.length > 0 && !details.colors.some((color) => color.id === selection.colorId)) {
        return 'رنگ محصول را انتخاب کنید.';
    }
    if (details.sizes.length > 0 && !details.sizes.some((size) => size.value === selection.size && size.available)) {
        return 'یک اندازه موجود را انتخاب کنید.';
    }
    if (!Number.isInteger(selection.quantity) || selection.quantity < 1 || selection.quantity > details.maxQuantity) {
        return `تعداد باید بین ۱ و ${details.maxQuantity.toLocaleString('fa-IR')} باشد.`;
    }
    return null;
}
