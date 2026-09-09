import type { ReactNode } from 'react';

import MobileNavigation from '~components/layout/MobileNavigation';
import SiteFooter from '~components/layout/SiteFooter';
import SiteHeader from '~components/layout/SiteHeader';

interface AppShellProps {
    /** Content rendered between the shared header and mobile navigation. */
    children: ReactNode;
    /** Current number of products in the cart. */
    cartCount: number;
    /** Current top-level page used by mobile navigation. */
    currentPage: 'home' | 'products' | 'account';
    /** Called after either search form is submitted. */
    onSearch: (query: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, cartCount, currentPage, onSearch }) => {
    return (
        <div className="app-shell">
            <a
                className="skip-link"
                href="#main-content"
                onClick={(event) => {
                    event.preventDefault();
                    document.getElementById('main-content')?.focus();
                }}
            >
                رفتن به محتوای اصلی
            </a>
            <SiteHeader cartCount={cartCount} onSearch={onSearch} />
            <main className="app-shell__main" id="main-content" tabIndex={-1}>
                {children}
            </main>
            <SiteFooter />
            <MobileNavigation cartCount={cartCount} currentPage={currentPage} />
        </div>
    );
};

export default AppShell;
