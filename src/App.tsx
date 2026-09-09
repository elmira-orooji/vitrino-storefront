import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import AppShell from '@/app/AppShell';
import { getCatalogHref, getRouteFromHash, homeRoute } from '@/app/navigation';
import type { StorefrontRoute } from '@/app/navigation';
import HomePage from '~features/home';

const ProductListPage = lazy(() => import('~features/product-list'));
const ProductDetailPage = lazy(() => import('~features/product-detail'));
const AccountPage = lazy(() => import('~features/account'));

const App: React.FC = () => {
    const [cartCount, setCartCount] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [route, setRoute] = useState(() => getRouteFromHash(window.location.hash) ?? homeRoute);
    const [catalogRoute, setCatalogRoute] = useState<StorefrontRoute | null>(() => route.page === 'products' ? route : null);
    const catalogScroll = useRef(0);
    const restoreCatalogScroll = useRef(false);

    useEffect(() => {
        const handleHashChange = (): void => {
            const nextRoute = getRouteFromHash(window.location.hash);
            if (nextRoute !== null) {
                if (route.page === 'products' && nextRoute.page === 'product') {
                    catalogScroll.current = window.scrollY;
                }
                restoreCatalogScroll.current = route.page === 'product' && nextRoute.page === 'products'
                    && catalogRoute?.query === nextRoute.query && catalogRoute?.categoryId === nextRoute.categoryId;
                if (nextRoute.page === 'products') setCatalogRoute(nextRoute);
                setRoute(nextRoute);
                setFeedbackMessage('');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [catalogRoute, route]);

    useEffect(() => {
        if (route.anchor) {
            document.getElementById(route.anchor)?.scrollIntoView({ behavior: 'instant' });
        } else {
            window.scrollTo({ top: restoreCatalogScroll.current ? catalogScroll.current : 0, behavior: 'instant' });
        }
    }, [route]);

    const handleSearch = useCallback((query: string): void => {
        if (query.length > 0) {
            window.location.hash = `products?${new URLSearchParams({ q: query })}`;
        } else {
            setFeedbackMessage('برای جست‌وجو، نام محصول یا برند را وارد کنید.');
        }
    }, []);

    const handleAddToCart = useCallback((productName: string, quantity = 1): void => {
        setCartCount((currentCount) => currentCount + quantity);
        setFeedbackMessage(`${quantity.toLocaleString('fa-IR')} عدد «${productName}» به سبد خرید اضافه شد.`);
    }, []);

    return (
        <AppShell cartCount={cartCount} currentPage={route.page === 'account' ? 'account' : route.page === 'home' ? 'home' : 'products'} onSearch={handleSearch}>
            {route.page === 'home' && <HomePage onAddToCart={handleAddToCart} />}
            {catalogRoute !== null && (
                <div hidden={route.page !== 'products'}>
                    <Suspense fallback={<div className="page-loading" aria-label="در حال بارگذاری محصولات" />}>
                        <ProductListPage
                            key={JSON.stringify([catalogRoute.query, catalogRoute.categoryId])}
                            query={catalogRoute.query}
                            initialCategoryId={catalogRoute.categoryId}
                            isActive={route.page === 'products'}
                            onAddToCart={handleAddToCart}
                        />
                    </Suspense>
                </div>
            )}
            {route.page === 'product' && (
                <Suspense fallback={<div className="page-loading" aria-label="در حال بارگذاری جزئیات محصول" />}>
                    <ProductDetailPage
                        key={route.productId}
                        productId={route.productId}
                        returnHref={getCatalogHref(catalogRoute)}
                        onAddToCart={handleAddToCart}
                    />
                </Suspense>
            )}
            {route.page === 'account' && (
                <Suspense fallback={<div className="page-loading" aria-label="در حال بارگذاری صفحه ورود" />}>
                    <AccountPage />
                </Suspense>
            )}
            <div
                className={`shop-feedback${feedbackMessage.length > 0 ? ' shop-feedback--visible' : ''}`}
                role="status"
                aria-live="polite"
            >
                {feedbackMessage}
            </div>
        </AppShell>
    );
};

export default App;
