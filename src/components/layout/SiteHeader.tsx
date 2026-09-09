import {
    ChevronDown,
    CircleUserRound,
    MapPin,
    Menu,
    ShoppingCart,
    Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import BrandLogo from '~components/brand/BrandLogo';
import { Badge, Button } from '~components/ui';

import SearchForm from './SearchForm';

interface SiteHeaderProps {
    /** Current number of products in the cart. */
    cartCount: number;
    /** Called after a search form is submitted. */
    onSearch: (query: string) => void;
}

const categories = [
    { id: 'digital', title: 'کالای دیجیتال' },
    { id: 'home-kitchen', title: 'خانه و آشپزخانه' },
    { id: 'fashion', title: 'مد و پوشاک' },
    { id: 'beauty', title: 'زیبایی و سلامت' },
    { id: 'sport', title: 'ورزش و سفر' },
    { id: 'books', title: 'کتاب و هنر' },
] as const;

export const SiteHeader: React.FC<SiteHeaderProps> = ({ cartCount, onSearch }) => {
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const categoryMenuRef = useRef<HTMLDivElement>(null);

    const closeCategoryMenu = useCallback((): void => {
        setIsCategoryMenuOpen(false);
    }, []);

    const toggleCategoryMenu = useCallback((): void => {
        setIsCategoryMenuOpen((isOpen) => !isOpen);
    }, []);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent): void => {
            if (
                categoryMenuRef.current !== null &&
                event.target instanceof Node &&
                !categoryMenuRef.current.contains(event.target)
            ) {
                closeCategoryMenu();
            }
        };

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                closeCategoryMenu();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeCategoryMenu]);

    return (
        <header className="site-header">
            <div className="site-header__campaign">
                <Sparkles aria-hidden="true" size={15} />
                <span>ارسال رایگان برای خریدهای بیشتر از دو میلیون تومان</span>
            </div>

            <div className="site-header__desktop">
                <div className="site-header__main content-container">
                    <a className="site-header__logo-link" href="#home">
                        <BrandLogo />
                    </a>
                    <SearchForm inputId="desktop-search" onSearch={onSearch} />
                    <div className="site-header__actions">
                        <Button
                            variant="outline"
                            size="md"
                            startIcon={<CircleUserRound size={20} strokeWidth={1.8} />}
                            className="account-action"
                            onClick={() => { window.location.hash = 'account'; }}
                        >
                            ورود | ثبت‌نام
                        </Button>
                        <span className="site-header__separator" aria-hidden="true" />
                        <a className="icon-action cart-action" href="#cart" aria-label="سبد خرید">
                            <ShoppingCart aria-hidden="true" size={23} strokeWidth={1.8} />
                            {cartCount > 0 && (
                                <Badge variant="primary" size="sm" className="cart-action__count">
                                    {cartCount.toLocaleString('fa-IR')}
                                </Badge>
                            )}
                        </a>
                    </div>
                </div>

                <div className="site-header__nav-wrap">
                    <div className="site-header__nav content-container">
                        <nav className="primary-navigation" aria-label="ناوبری اصلی">
                            <div className="category-menu" ref={categoryMenuRef}>
                                <Button
                                    variant="ghost"
                                    size="md"
                                    className="category-menu__trigger"
                                    aria-expanded={isCategoryMenuOpen}
                                    aria-controls="category-menu-panel"
                                    onClick={toggleCategoryMenu}
                                    startIcon={<Menu size={19} />}
                                    endIcon={<ChevronDown size={16} />}
                                >
                                    دسته‌بندی کالاها
                                </Button>
                                {isCategoryMenuOpen && (
                                    <div className="category-menu__panel" id="category-menu-panel">
                                        <p>دسته‌های پرطرفدار</p>
                                        <ul>
                                            {categories.map((category) => (
                                                <li key={category.id}>
                                                    <a href={`#products?category=${category.id}`} onClick={closeCategoryMenu}>
                                                        {category.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <a href="#special-offers">پیشنهادهای امروز</a>
                            <a href="#products">پرفروش‌ترین‌ها</a>
                            <a href="#products">تازه‌ها</a>
                        </nav>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="location-action"
                            startIcon={<MapPin size={17} strokeWidth={1.8} />}
                        >
                            انتخاب شهر
                        </Button>
                    </div>
                </div>
            </div>

            <div className="site-header__mobile content-container">
                <SearchForm
                    inputId="mobile-search"
                    className="site-search--mobile"
                    onSearch={onSearch}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className="mobile-location"
                    startIcon={<MapPin size={17} strokeWidth={1.8} />}
                    endIcon={<ChevronDown size={15} />}
                >
                    انتخاب نشانی ارسال
                </Button>
            </div>
        </header>
    );
};

export default SiteHeader;
