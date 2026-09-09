// Adapted from dhileepkumargm's E-commerce Product Detail on 21st.dev.
// Source and adaptation notes: docs/storefront/ui-sources-fa.md.
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '~types/product';

interface ProductGalleryProps { product: Product; accent?: string; }

const views = ['نمای اصلی', 'نمای نزدیک', 'جزئیات تصویر'] as const;

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const nextImage = (): void => setCurrentImageIndex((index) => (index + 1) % views.length);
    const previousImage = (): void => setCurrentImageIndex((index) => (index + views.length - 1) % views.length);

    return (
        <section className="detail-gallery" aria-label="تصاویر محصول">
            <div className={`detail-gallery__main detail-gallery__view--${currentImageIndex}`}>
                <span className="detail-gallery__eyebrow">{product.brand} / مجموعه روزمره</span>
                <img className="detail-gallery__image" src={product.image.src} alt={`${product.image.alt}، ${views[currentImageIndex]}`} style={{ objectPosition: product.image.position }} />
                <div className="detail-gallery__controls">
                    <button type="button" onClick={previousImage} aria-label="تصویر قبلی"><ChevronRight size={20} /></button>
                    <span aria-live="polite">{(currentImageIndex + 1).toLocaleString('fa-IR')} / ۳</span>
                    <button type="button" onClick={nextImage} aria-label="تصویر بعدی"><ChevronLeft size={20} /></button>
                </div>
            </div>
            <div className="detail-gallery__thumbnails" aria-label="انتخاب نمای تصویر">
                {views.map((view, index) => (
                    <button
                        type="button"
                        key={view}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={view}
                        aria-pressed={currentImageIndex === index}
                        className={`detail-gallery__thumbnail detail-gallery__view--${index}`}
                    >
                        <img src={product.image.src} alt="" style={{ objectPosition: product.image.position }} />
                    </button>
                ))}
                <p>عکس واقعی محصول<br /><a href={product.image.sourceUrl} target="_blank" rel="noreferrer">{product.image.credit}</a></p>
            </div>
        </section>
    );
};

export default ProductGallery;
