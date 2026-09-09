import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getCatalogHref, getRouteFromHash } from '../src/app/navigation.ts';
import { products } from '../src/data/products.ts';
import { getProductDetails } from '../src/features/product-detail/data.ts';
import { validateSelection } from '../src/features/product-detail/helpers/selection.ts';

test('product links resolve to the detail route and preserve the complete product id', () => {
    const route = getRouteFromHash('#product-nova-air-2');
    assert.equal(route.page, 'product');
    assert.equal(route.productId, 'nova-air-2');
    assert.equal(getRouteFromHash('#products').page, 'products');
});

test('return links preserve Persian queries and category identifiers', () => {
    const route = getRouteFromHash('#products?q=%D9%84%D9%88%D9%86%D8%A7&category=beauty');
    assert.deepEqual(getRouteFromHash(getCatalogHref(route)), route);
    assert.equal(getCatalogHref(null), '#products');
});

test('every sample product has specifications and a valid bounded selection', () => {
    for (const product of products) {
        const details = getProductDetails(product);
        assert.equal(details.highlights.length, 4);
        assert.ok(details.description.length > 0);
        const selection = {
            colorId: details.colors[0]?.id ?? '',
            size: details.sizes.find((size) => size.available)?.value ?? '',
            quantity: 1,
        };
        assert.equal(validateSelection(product, details, selection), product.available ? null : 'این محصول فعلاً موجود نیست.');
    }
});

test('shoes reject a missing or unavailable size before adding to the cart', () => {
    const product = products.find((item) => item.id === 'rio-everyday-shoe');
    const details = getProductDetails(product);
    for (const size of ['', '40', '99']) {
        assert.equal(validateSelection(product, details, { colorId: 'coral', size, quantity: 1 }), 'یک اندازه موجود را انتخاب کنید.');
    }
    assert.equal(validateSelection(product, details, { colorId: 'coral', size: '38', quantity: 1 }), null);
});

test('unknown colors and invalid quantities cannot be added', () => {
    const product = products.find((item) => item.id === 'nova-air-2');
    const details = getProductDetails(product);
    assert.equal(validateSelection(product, details, { colorId: 'unknown', size: '', quantity: 1 }), 'رنگ محصول را انتخاب کنید.');
    for (const quantity of [0, -1, 1.5, NaN, Infinity, details.maxQuantity + 1]) {
        assert.notEqual(validateSelection(product, details, { colorId: 'coral', size: '', quantity }), null);
    }
    assert.equal(validateSelection(product, details, { colorId: 'coral', size: '', quantity: details.maxQuantity }), null);
});

test('ceramic mugs do not inherit the steel body of travel mugs', () => {
    const product = products.find((item) => item.id === 'homia-ceramic-mug');
    assert.equal(getProductDetails(product).highlights.find((item) => item.label === 'جنس بدنه').value, 'سرامیک');
});
