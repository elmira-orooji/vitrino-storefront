import { ChevronLeft, PackageSearch, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ProductCard from '~components/product/ProductCard';

import FilterPanel from './FilterPanel';
import SortBar from './SortBar';
import { useProductFilters } from '../hooks/useProductFilters';
import '../product-list.css';

interface ProductListPageProps {
    /** Search query submitted from the shared header. */
    query: string;
    /** Category selected through a home or header link. */
    initialCategoryId: string;
    /** The catalog stays mounted while product details are open. */
    isActive: boolean;
    /** Adds one unit of a selected product to the cart. */
    onAddToCart: (productName: string) => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ query, initialCategoryId, isActive, onAddToCart }) => {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const filterDialogRef = useRef<HTMLDialogElement>(null);
    const {
        activeFilterCount,
        filters,
        filteredProducts,
        resetFilters,
        setMaxPrice,
        setOnlyAvailable,
        setOnlyDiscounted,
        setSort,
        sort,
        toggleBrand,
        toggleCategory,
    } = useProductFilters(query, initialCategoryId);

    const openMobileFilter = useCallback((): void => {
        filterDialogRef.current?.showModal();
        setIsMobileFilterOpen(true);
    }, []);

    const closeMobileFilter = useCallback((): void => {
        filterDialogRef.current?.close();
        setIsMobileFilterOpen(false);
    }, []);

    useEffect(() => {
        if (!isActive) closeMobileFilter();
    }, [closeMobileFilter, isActive]);

    useEffect(() => {
        if (!isMobileFilterOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const desktopViewport = window.matchMedia('(min-width: 960px)');
        const handleViewportChange = (): void => {
            if (desktopViewport.matches) {
                closeMobileFilter();
            }
        };

        desktopViewport.addEventListener('change', handleViewportChange);
        return () => {
            document.body.style.overflow = previousOverflow;
            desktopViewport.removeEventListener('change', handleViewportChange);
        };
    }, [closeMobileFilter, isMobileFilterOpen]);

    return (
        <div className="product-list-page content-container">
            <nav className="product-breadcrumb" aria-label="مسیر صفحه">
                <a href="#home">خانه</a>
                <ChevronLeft aria-hidden="true" size={14} />
                <span aria-current="page">همه محصولات</span>
            </nav>

            <header className="product-list-hero">
                <div>
                    <span>{query.length > 0 ? 'نتیجه جست‌وجوی شما' : 'انتخاب‌های تازه ویترینو'}</span>
                    <h1>{query.length > 0 ? `جست‌وجو برای «${query}»` : 'همه محصولات'}</h1>
                    <p>محصول‌ها را بر اساس قیمت، برند و موجودی محدود کنید و راحت‌تر مقایسه کنید.</p>
                </div>
                <div className="product-list-hero__mark" aria-hidden="true">
                    <PackageSearch size={38} strokeWidth={1.5} />
                </div>
            </header>

            <div className="product-list-mobile-tools">
                <button
                    type="button"
                    onClick={openMobileFilter}
                    aria-expanded={isMobileFilterOpen}
                    aria-haspopup="dialog"
                    aria-controls="mobile-product-filters"
                >
                    <SlidersHorizontal aria-hidden="true" size={18} />
                    فیلترها
                    {activeFilterCount > 0 && <span>{activeFilterCount.toLocaleString('fa-IR')}</span>}
                </button>
            </div>

            <div className="product-list-layout">
                <aside className="product-list-sidebar" aria-label="فیلتر محصولات">
                    <FilterPanel
                        activeFilterCount={activeFilterCount}
                        filters={filters}
                        idPrefix="desktop"
                        resultCount={filteredProducts.length}
                        onReset={resetFilters}
                        onMaxPriceChange={setMaxPrice}
                        onOnlyAvailableChange={setOnlyAvailable}
                        onOnlyDiscountedChange={setOnlyDiscounted}
                        onBrandToggle={toggleBrand}
                        onCategoryToggle={toggleCategory}
                    />
                </aside>

                <section className="product-results" aria-labelledby="product-results-title">
                    <h2 className="sr-only" id="product-results-title">فهرست محصولات</h2>
                    <SortBar resultCount={filteredProducts.length} sort={sort} onSortChange={setSort} />

                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard product={product} onAddToCart={onAddToCart} key={product.id} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="product-empty">
                            <PackageSearch aria-hidden="true" size={42} strokeWidth={1.4} />
                            <h3>محصولی با این فیلترها پیدا نشد</h3>
                            <p>فیلترها را کمی بازتر کنید یا دوباره جست‌وجو کنید.</p>
                            <button type="button" onClick={resetFilters}>پاک‌کردن فیلترها</button>
                        </div>
                    )}
                </section>
            </div>

            <dialog
                className="filter-drawer"
                id="mobile-product-filters"
                ref={filterDialogRef}
                aria-label="فیلتر محصولات"
                onClose={closeMobileFilter}
                onClick={(event) => {
                    if (event.target === event.currentTarget) closeMobileFilter();
                }}
            >
                <div className="filter-drawer__panel">
                    <FilterPanel
                        activeFilterCount={activeFilterCount}
                        filters={filters}
                        idPrefix="mobile"
                        resultCount={filteredProducts.length}
                        showClose
                        onClose={closeMobileFilter}
                        onReset={resetFilters}
                        onMaxPriceChange={setMaxPrice}
                        onOnlyAvailableChange={setOnlyAvailable}
                        onOnlyDiscountedChange={setOnlyDiscounted}
                        onBrandToggle={toggleBrand}
                        onCategoryToggle={toggleCategory}
                    />
                </div>
            </dialog>
        </div>
    );
};

export default ProductListPage;
