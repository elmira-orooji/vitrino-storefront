import { Plus, Star, Truck } from 'lucide-react';
import { memo, useCallback } from 'react';

import { Badge, Button } from '~components/ui';
import type { Product } from '~types/product';

import './product-card.css';

interface ProductCardProps {
    /** Product data rendered by the card. */
    product: Product;
    /** Visual treatment based on the card context. */
    variant?: 'catalog' | 'offer';
    /** Adds one unit of the product to the cart. */
    onAddToCart: (productName: string) => void;
}

const priceFormatter = new Intl.NumberFormat('fa-IR');

export const ProductCard = memo<ProductCardProps>(function ProductCard({
    product,
    variant = 'catalog',
    onAddToCart,
}) {
    const handleAdd = useCallback((): void => {
        if (product.artwork === 'shoe') {
            window.location.hash = `product-${product.id}`;
            return;
        }
        onAddToCart(product.title);
    }, [onAddToCart, product]);

    const addLabel = product.available
        ? product.artwork === 'shoe'
            ? `انتخاب اندازه ${product.title}`
            : `افزودن ${product.title} به سبد خرید`
        : `${product.title} ناموجود است`;

    return (
        <article className={`product-card product-card--${variant}${product.available ? '' : ' product-card--unavailable'}`}>
            <a
                className="product-card__link"
                href={`#product-${product.id}`}
                aria-label={product.title}
            >
                <div className="product-card__media">
                    <img
                        src={product.image.src}
                        alt={product.image.alt}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: product.image.position }}
                    />
                </div>
                {product.discount > 0 && (
                    <Badge variant="primary" className="product-card__discount-badge">
                        {product.discount.toLocaleString('fa-IR')}٪
                    </Badge>
                )}
                {variant === 'catalog' && <span className="product-card__brand">{product.brand}</span>}
                <h3>{product.title}</h3>
            </a>
            <div className="product-card__meta">
                {product.fastDelivery && (
                    <Badge variant="secondary" size="sm" startIcon={<Truck size={12} />}>
                        ارسال سریع
                    </Badge>
                )}
                <span className="product-card__rating" aria-label={`امتیاز ${product.rating.toLocaleString('fa-IR')} از ۵`}>
                    <Star aria-hidden="true" size={14} fill="currentColor" />
                    {product.rating.toLocaleString('fa-IR')}
                </span>
            </div>
            <div className="product-card__pricing">
                <strong aria-label={`${priceFormatter.format(product.price)} تومان`}>
                    {priceFormatter.format(product.price)}
                    <small>تومان</small>
                </strong>
                {product.discount > 0 && (
                    <del aria-label={`قیمت قبلی ${priceFormatter.format(product.originalPrice)} تومان`}>
                        {priceFormatter.format(product.originalPrice)}
                    </del>
                )}
            </div>
            <Button
                className="product-card__add"
                variant={product.available ? 'outline' : 'ghost'}
                size="sm"
                onClick={handleAdd}
                disabled={!product.available}
                aria-label={addLabel}
            >
                {product.available ? <Plus aria-hidden="true" size={18} /> : <span>ناموجود</span>}
            </Button>
        </article>
    );
});

export default ProductCard;
