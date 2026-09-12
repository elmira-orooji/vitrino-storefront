import { ChevronLeft, Loader2, PackageSearch, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ProductCard from '~components/product/ProductCard';
import { mapApiProducts } from '@/lib/productMapper';
import type { ProductQueryParams } from '@/lib/api';

import FilterPanel from './FilterPanel';
import SortBar from './SortBar';
import { useProducts } from '../hooks/useProducts';
import { defaultFilters, sortOptions } from '../data';
import type { ProductFilters, SortOption } from '../types';
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

// Map local sort options to API sort params
function mapSortToApi(sort: SortOption): ProductQueryParams['sort'] {
    switch (sort) {
        case 'price-asc': return 'price_asc';
        case 'price-desc': return 'price_desc';
        case 'newest': return 'newest';
        default: return undefined; // 'popular' and 'discount' not yet supported by API
    }
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ query, initialCategoryId, isActive, onAddToCart }) => {
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const filterDialogRef = useRef<HTMLDialogElement>(null);

    // Local filter state (client-side filters that API doesn't support yet)
    const [filters, setFilters] = useState<ProductFilters>(() => ({
        ...defaultFilters,
        categoryIds: initialCategoryId ? [initialCategoryId] : [],
    }));
    const [sort, setSort] = useState<SortOption>('popular');

    // Build API query params
    const apiParams = useMemo<ProductQueryParams>(() => ({
        search: query || undefined,
        category: filters.categoryIds.length > 0 ? filters.categoryIds[0] : undefined,
        minPrice: undefined, // Not yet implemented in filters
        maxPrice: filters.maxPrice ?? undefined,
        sort: mapSortToApi(sort),
        limit: 20,
    }), [query, filters.categoryIds, filters.maxPrice, sort]);

    const {
        products: apiProducts,
        isLoading,
        error,
        total,
        currentPage,
        totalPages,
        setPage,
    } = useProducts(apiParams);

    // Map API products to local format
    const displayProducts = useMemo(() => mapApiProducts(apiProducts), [apiProducts]);

    // Apply client-side filters (for features not yet in API)
    const filteredProducts = useMemo(() => {
        let result = displayProducts;

        if (filters.onlyAvailable) {
            result = result.filter((p) => p.available);
        }
        if (filters.onlyDiscounted) {
            result = result.filter((p) => p.discount > 0);
        }
        if (filters.brands.length > 0) {
            result = result.filter((p) => filters.brands.includes(p.brand));
        }

        return result;
    }, [displayProducts, filters.onlyAvailable, filters.onlyDiscounted, filters.brands]);

    const activeFilterCount = useMemo(
        () =>
            filters.categoryIds.length +
            filters.brands.length +
            Number(filters.onlyAvailable) +
            Number(filters.onlyDiscounted) +
            Number(filters.maxPrice !== null),
        [filters],
    );

    // Filter handlers
    const toggleCategory = useCallback((value: string): void => {
        setFilters((current) => ({
            ...current,
            categoryIds: current.categoryIds.includes(value)
                ? current.categoryIds.filter((id) => id !== value)
                : [...current.categoryIds, value],
        }));
    }, []);

    const toggleBrand = useCallback((value: string): void => {
        setFilters((current) => ({
            ...current,
            brands: current.brands.includes(value)
                ? current.brands.filter((b) => b !== value)
                : [...current.brands, value],
        }));
    }, []);

    const setOnlyAvailable = useCallback((value: boolean): void => {
        setFilters((current) => ({ ...current, onlyAvailable: value }));
    }, []);

    const setOnlyDiscounted = useCallback((value: boolean): void => {
        setFilters((current) => ({ ...current, onlyDiscounted: value }));
    }, []);

    const setMaxPrice = useCallback((value: number | null): void => {
        setFilters((current) => ({ ...current, maxPrice: value }));
    }, []);

    const resetFilters = useCallback((): void => {
        setFilters(defaultFilters);
    }, []);

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
                    <SortBar resultCount={isLoading ? 0 : filteredProducts.length} sort={sort} onSortChange={setSort} />

                    {isLoading && (
                        <div className="product-empty">
                            <Loader2 aria-hidden="true" size={42} className="animate-spin" />
                            <h3>در حال بارگذاری محصولات...</h3>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="product-empty">
                            <PackageSearch aria-hidden="true" size={42} strokeWidth={1.4} />
                            <h3>خطا در دریافت محصولات</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard product={product} onAddToCart={onAddToCart} key={product.id} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && filteredProducts.length === 0 && (
                        <div className="product-empty">
                            <PackageSearch aria-hidden="true" size={42} strokeWidth={1.4} />
                            <h3>محصولی با این فیلترها پیدا نشد</h3>
                            <p>فیلترها را کمی بازتر کنید یا دوباره جست‌وجو کنید.</p>
                            <button type="button" onClick={resetFilters}>پاک‌کردن فیلترها</button>
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && !error && totalPages > 1 && (
                        <div className="product-pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() => setPage(currentPage - 1)}
                                style={{ padding: '0.5rem 1rem', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                                قبلی
                            </button>
                            <span style={{ padding: '0.5rem 1rem' }}>
                                صفحه {currentPage.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
                            </span>
                            <button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() => setPage(currentPage + 1)}
                                style={{ padding: '0.5rem 1rem', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                بعدی
                            </button>
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
