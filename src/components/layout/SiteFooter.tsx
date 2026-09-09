import React from 'react';

/**
 * Vitreeno multi-column footer
 */
export const SiteFooter: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="site-footer__inner layout-container">
                {/* Top section: Logo + description */}
                <div className="site-footer__brand">
                    <div className="site-footer__logo">
                        <span className="site-footer__logo-mark">V</span>
                        <span className="site-footer__logo-text">ویترینو</span>
                    </div>
                    <p className="site-footer__desc">
                        فروشگاه اینترنتی ویترینو، بررسی، انتخاب و خرید آنلاین
                    </p>
                </div>

                {/* Links columns */}
                <nav className="site-footer__links" aria-label="لینک‌های فوتر">
                    <div className="site-footer__col">
                        <h4>خرید</h4>
                        <ul>
                            <li><a href="#">جدیدترین محصولات</a></li>
                            <li><a href="#">پرفروش‌ترین‌ها</a></li>
                            <li><a href="#">تخفیف‌ها و پیشنهادها</a></li>
                        </ul>
                    </div>
                    <div className="site-footer__col">
                        <h4>خدمات مشتریان</h4>
                        <ul>
                            <li><a href="#">پیگیری سفارش</a></li>
                            <li><a href="#">شرایط بازگشت کالا</a></li>
                            <li><a href="#">سوالات متداول</a></li>
                        </ul>
                    </div>
                    <div className="site-footer__col">
                        <h4>درباره ما</h4>
                        <ul>
                            <li><a href="#">تماس با ما</a></li>
                            <li><a href="#">فرصت‌های شغلی</a></li>
                            <li><a href="#">قوانین و مقررات</a></li>
                        </ul>
                    </div>
                </nav>

                {/* Bottom bar */}
                <div className="site-footer__bottom">
                    <p>© ۱۴۰۵ تمامی حقوق محفوظ است.</p>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;