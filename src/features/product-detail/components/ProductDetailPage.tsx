import { ArrowRight, Check, ChevronLeft, Info, Loader2, PackageCheck, PackageSearch, RotateCcw, ShieldCheck, ShoppingBag, Star, Store, Truck } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import ProductCard from '~components/product/ProductCard';
import QuantitySelector from '~components/product/QuantitySelector';
import type { Product } from '~types/product';
import { mapApiProduct } from '@/lib/productMapper';
import { useProducts } from '../../product-list/hooks/useProducts';

import ProductGallery from './ProductGallery';
import ProductInformation from './ProductInformation';
import { getProductDetails } from '../data';
import { validateSelection } from '../helpers/selection';
import { useProduct } from '../hooks/useProduct';
import '../product-detail.css';

interface ProductDetailPageProps {
    productId: string;
    returnHref: string;
    onAddToCart: (productName: string, quantity?: number) => void;
}

const formatPrice = (value: number): string => value.toLocaleString('fa-IR');

interface ProductDetailContentProps extends Omit<ProductDetailPageProps, 'productId'> {
    product: Product;
    relatedProducts?: Product[];
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product, returnHref, onAddToCart, relatedProducts = [] }) => {
    const details = getProductDetails(product);
    const [colorId, setColorId] = useState(details.colors[0]?.id ?? '');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectionError, setSelectionError] = useState('');
    const optionsRef = useRef<HTMLDivElement>(null);
    const selectedColor = details.colors.find((color) => color.id === colorId);

    const handleAdd = useCallback((): void => {
        const error = validateSelection(product, details, { colorId, size, quantity });
        setSelectionError(error ?? '');
        if (error) {
            optionsRef.current?.focus();
            return;
        }
        const variant = [selectedColor?.label, size ? `سایز ${Number(size).toLocaleString('fa-IR')}` : ''].filter(Boolean).join('، ');
        onAddToCart(`${product.title}${variant ? ` (${variant})` : ''}`, quantity);
    }, [colorId, details, onAddToCart, product, quantity, selectedColor, size]);

    return (
        <div className="product-detail-page content-container">
            <nav className="detail-breadcrumb" aria-label="مسیر صفحه">
                <a href="#home">خانه</a><ChevronLeft size={13} aria-hidden="true" />
                <a href={`#products?category=${product.categoryId}`}>{product.categoryLabel}</a><ChevronLeft size={13} aria-hidden="true" />
                <span aria-current="page">{product.title}</span>
                <a className="detail-back" href={returnHref}><ArrowRight size={15} aria-hidden="true" />بازگشت به فهرست</a>
            </nav>

            <div className="detail-overview">
                <ProductGallery product={product} accent={selectedColor?.hex} />
                <div className="detail-summary">
                    <div className="detail-brand"><span>{product.brand}</span><span>{product.categoryLabel}</span></div>
                    <h1>{product.title}</h1>
                    <div className="detail-rating"><Star size={16} fill="currentColor" aria-hidden="true" /><strong>{product.rating.toLocaleString('fa-IR')}</strong><span>از ۵ · امتیاز نمونه</span></div>
                    <p className="detail-intro">{details.description}</p>
                    <div className="detail-options" ref={optionsRef} tabIndex={-1} aria-describedby={selectionError ? 'selection-error' : undefined}>
                        {details.colors.length > 0 && (
                            <fieldset className="detail-option-group" disabled={!product.available}>
                                <legend>رنگ: <strong>{selectedColor?.label}</strong></legend>
                                <div className="detail-colors">
                                    {details.colors.map((color) => (
                                        <label key={color.id} className="detail-color" style={{ '--swatch': color.hex } as CSSProperties}>
                                            <input type="radio" name="product-color" value={color.id} checked={colorId === color.id} onChange={() => { setColorId(color.id); setSelectionError(''); }} />
                                            <span className="detail-color__swatch" aria-hidden="true">{colorId === color.id && <Check size={14} />}</span>
                                            <span>{color.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        )}
                        {details.sizes.length > 0 && (
                            <fieldset className="detail-option-group" disabled={!product.available}>
                                <legend>اندازه <span>انتخاب الزامی</span></legend>
                                <div className="detail-sizes">
                                    {details.sizes.map((option) => (
                                        <label key={option.value} className="detail-size">
                                            <input type="radio" name="product-size" value={option.value} checked={size === option.value} disabled={!option.available} aria-label={`سایز ${Number(option.value).toLocaleString('fa-IR')}${option.available ? '' : '، ناموجود'}`} onChange={() => { setSize(option.value); setSelectionError(''); }} />
                                            <span>{Number(option.value).toLocaleString('fa-IR')}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        )}
                        {selectionError && <p className="detail-error" role="alert" id="selection-error">{selectionError}</p>}
                    </div>
                    <h2 className="detail-highlights-title">ویژگی‌های اصلی</h2>
                    <dl className="detail-highlights">{details.highlights.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
                    <p className="detail-demo-note"><Info size={15} aria-hidden="true" />مشخصات، موجودی و قیمت‌ها برای این فروشگاه آزمایشی هستند.</p>
                </div>

                <aside className="detail-purchase" aria-label="خرید محصول">
                    <div className="detail-seller"><Store size={22} aria-hidden="true" /><div><span>فروشنده</span><strong>فروشگاه ویترینو</strong></div><ShieldCheck size={20} aria-hidden="true" /></div>
                    <div className="detail-availability" data-available={product.available}><PackageCheck size={18} aria-hidden="true" /><span>{product.available ? 'موجود در انبار نمونه' : 'فعلاً ناموجود'}</span></div>
                    <div className="detail-shipping"><Truck size={18} aria-hidden="true" /><div><strong>{product.fastDelivery ? 'آماده ارسال سریع' : 'ارسال عادی'}</strong><span>هزینه ارسال در مرحله بعد مشخص می‌شود</span></div></div>
                    <div className="detail-price">
                        <span>{quantity === 1 ? 'قیمت محصول' : `قیمت ${quantity.toLocaleString('fa-IR')} عدد`}</span>
                        {product.discount > 0 && <div className="detail-price__old"><span>{product.discount.toLocaleString('fa-IR')}٪</span><del>{formatPrice(product.originalPrice * quantity)}</del></div>}
                        <strong>{formatPrice(product.price * quantity)} <small>تومان</small></strong>
                        {product.discount > 0 && <p>{formatPrice((product.originalPrice - product.price) * quantity)} تومان تخفیف</p>}
                    </div>
                    <div className="detail-quantity"><span>تعداد</span><QuantitySelector value={quantity} maximum={details.maxQuantity} disabled={!product.available} onChange={setQuantity} /></div>
                    <button className="detail-add" type="button" onClick={handleAdd} disabled={!product.available}><ShoppingBag size={19} aria-hidden="true" />{product.available ? 'افزودن به سبد خرید' : 'فعلاً موجود نیست'}</button>
                    <p className="detail-purchase__note">{product.available ? `حداکثر ${details.maxQuantity.toLocaleString('fa-IR')} عدد در هر بار افزودن` : 'محصول‌های مشابه را پایین صفحه ببینید.'}</p>
                </aside>
            </div>

            <div className="detail-services" aria-label="خدمات فروشگاه نمونه">
                <div><ShieldCheck size={25} aria-hidden="true" /><span>اطلاعات شفاف محصول<small>مشخصات و قیمت کنار هم</small></span></div>
                <div><Truck size={25} aria-hidden="true" /><span>انتخاب روش ارسال<small>در مرحله ثبت سفارش</small></span></div>
                <div><RotateCcw size={25} aria-hidden="true" /><span>خرید آزمایشی<small>بدون پرداخت واقعی</small></span></div>
            </div>
            <ProductInformation product={product} details={details} />
            {relatedProducts.length > 0 && (
                <section className="detail-related" aria-labelledby="related-products-title">
                    <div className="detail-section-heading"><h2 id="related-products-title">در همین دسته ببینید</h2><a href={`#products?category=${product.categoryId}`}>همه محصولات<ChevronLeft size={16} aria-hidden="true" /></a></div>
                    <div className="detail-related__grid">{relatedProducts.map((item) => <ProductCard product={item} onAddToCart={onAddToCart} key={item.id} />)}</div>
                </section>
            )}
            <div className="detail-mobile-purchase" aria-label="خرید سریع محصول">
                <div><small>{quantity === 1 ? 'قیمت محصول' : `${quantity.toLocaleString('fa-IR')} عدد`}</small><strong>{formatPrice(product.price * quantity)} <small>تومان</small></strong></div>
                <button className="detail-add" type="button" onClick={handleAdd} disabled={!product.available}>{product.available ? 'افزودن به سبد' : 'ناموجود'}</button>
            </div>
        </div>
    );
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, returnHref, onAddToCart }) => {
    const { product: apiProduct, isLoading, error } = useProduct(productId);

    // Map API product to local format
    const product = useMemo(() => apiProduct ? mapApiProduct(apiProduct) : null, [apiProduct]);

    // Fetch related products from same category
    const { products: relatedApiProducts } = useProducts({
        category: product?.categoryId || undefined,
        limit: 5,
    });

    const relatedProducts = useMemo(
        () => relatedApiProducts
            .filter((p) => p.id !== productId)
            .slice(0, 4)
            .map(mapApiProduct),
        [relatedApiProducts, productId],
    );

    if (isLoading) {
        return (
            <section className="detail-not-found content-container">
                <Loader2 size={52} className="animate-spin" aria-hidden="true" />
                <h1>در حال بارگذاری...</h1>
            </section>
        );
    }

    if (error || !product) {
        return (
            <section className="detail-not-found content-container">
                <PackageSearch size={52} aria-hidden="true" />
                <h1>این محصول پیدا نشد</h1>
                <p>{error || 'ممکن است نشانی محصول درست نباشد.'}</p>
                <a href={returnHref}>بازگشت به فهرست محصولات</a>
            </section>
        );
    }

    return <ProductDetailContent key={product.id} product={product} returnHref={returnHref} onAddToCart={onAddToCart} relatedProducts={relatedProducts} />;
};

export default ProductDetailPage;
