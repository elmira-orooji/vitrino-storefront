import { Grid2X2, House, ShoppingCart, UserRound } from 'lucide-react';

interface MobileNavigationProps {
    /** Current number of products in the cart. */
    cartCount: number;
    /** Current top-level page. */
    currentPage: 'home' | 'products' | 'account';
}

const navigationItems = [
    { label: 'خانه', href: '#home', icon: House, page: 'home' },
    { label: 'دسته‌بندی', href: '#products', icon: Grid2X2, page: 'products' },
    { label: 'سبد خرید', href: '#cart', icon: ShoppingCart, page: null },
    { label: 'حساب من', href: '#account', icon: UserRound, page: 'account' },
] as const;

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ cartCount, currentPage }) => {
    return (
        <nav className="mobile-navigation" aria-label="ناوبری موبایل">
            {navigationItems.map(({ label, href, icon: Icon, page }) => {
                const isCurrent = page === currentPage;

                return (
                    <a
                        className="mobile-navigation__item"
                        href={href}
                        aria-current={isCurrent ? 'page' : undefined}
                        key={label}
                    >
                        <span className="mobile-navigation__icon">
                            <Icon aria-hidden="true" size={22} strokeWidth={isCurrent ? 2.2 : 1.7} />
                            {label === 'سبد خرید' && cartCount > 0 && (
                                <span className="mobile-navigation__count">
                                    {cartCount.toLocaleString('fa-IR')}
                                </span>
                            )}
                        </span>
                        <span>{label}</span>
                    </a>
                );
            })}
        </nav>
    );
};

export default MobileNavigation;
