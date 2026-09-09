import type { Product, ProductArtworkKind } from '~types/product';

import type { ProductDetails } from './types';

const coral = { id: 'coral', label: 'مرجانی', hex: '#e86a80' };
const charcoal = { id: 'charcoal', label: 'ذغالی', hex: '#41454f' };
const mint = { id: 'mint', label: 'سبز نعنایی', hex: '#89c9c3' };
const sand = { id: 'sand', label: 'کرم', hex: '#d7b28a' };

// These specifications belong to the demo catalog, not to real brands or inventory.
const detailsByKind: Record<ProductArtworkKind, ProductDetails> = {
    headphones: {
        description: 'یک هدفون روگوشی برای موسیقی، تماس و کارهای روزمره. بالشتک‌های نرم و هدبند قابل تنظیم، استفاده طولانی‌تر را راحت می‌کنند. کنترل صدا و پاسخ به تماس روی بدنه قرار دارد.',
        highlights: [
            { label: 'نوع اتصال', value: 'بلوتوث و کابل AUX' },
            { label: 'شارژدهی', value: 'تا ۳۰ ساعت' },
            { label: 'درگاه شارژ', value: 'USB-C' },
            { label: 'وزن', value: '۲۴۰ گرم' },
        ],
        colors: [coral, charcoal, mint], sizes: [], maxQuantity: 5,
        care: 'بالشتک‌ها را با دستمال نرم و کمی مرطوب تمیز کنید. هدفون و درگاه شارژ نباید در تماس مستقیم با آب باشند.',
    },
    watch: {
        description: 'ساعتی سبک برای دیدن اعلان‌ها و ثبت فعالیت‌های روزانه. بند سیلیکونی قابل تنظیم است و از روی نمایشگر می‌توان زمان، تعداد قدم‌ها و وضعیت تمرین را بررسی کرد.',
        highlights: [
            { label: 'نمایشگر', value: 'لمسی ۱٫۶۹ اینچ' },
            { label: 'جنس بند', value: 'سیلیکون' },
            { label: 'سازگاری', value: 'Android و iOS' },
            { label: 'شارژدهی', value: 'تا ۷ روز' },
        ],
        colors: [mint, charcoal, coral], sizes: [], maxQuantity: 3,
        care: 'پس از ورزش، بند را با دستمال نرم تمیز و خشک کنید. برای شارژ از کابل سازگار استفاده کنید.',
    },
    mug: {
        description: 'یک ماگ برای میز کار، خانه و نوشیدنی‌های روزمره. پیش از انتخاب، جنس بدنه و گنجایش را در مشخصات بررسی کنید؛ مدل‌های این مجموعه کاربرد یکسانی ندارند.',
        highlights: [
            { label: 'گنجایش', value: '۴۵۰ میلی‌لیتر' },
            { label: 'جنس بدنه', value: 'استیل دوجداره' },
            { label: 'درپوش', value: 'دارد' },
            { label: 'روش شست‌وشو', value: 'دستی' },
        ],
        colors: [sand, mint, charcoal], sizes: [], maxQuantity: 6,
        care: 'شست‌وشوی دستی با اسفنج نرم پیشنهاد می‌شود. این مدل برای مایکروویو مناسب نیست.',
    },
    shoe: {
        description: 'کفشی بندی با رویه سبک برای استفاده روزمره و پیاده‌روی کوتاه. اندازه مناسب را بر اساس سایز معمول کفش انتخاب کنید. موجودی هر اندازه در همین بخش مشخص است.',
        highlights: [
            { label: 'جنس رویه', value: 'پارچه تنفس‌پذیر' },
            { label: 'زیره', value: 'EVA سبک' },
            { label: 'نوع بسته‌شدن', value: 'بندی' },
            { label: 'کاربرد', value: 'روزمره و پیاده‌روی' },
        ],
        colors: [coral, charcoal, sand],
        sizes: [
            { value: '38', available: true }, { value: '39', available: true },
            { value: '40', available: false }, { value: '41', available: true },
            { value: '42', available: true },
        ],
        maxQuantity: 3,
        care: 'با برس نرم و شوینده ملایم تمیز شود. برای خشک‌شدن، کفش را دور از حرارت مستقیم قرار دهید.',
    },
    serum: {
        description: 'سرم صورت با بسته‌بندی قطره‌چکانی. اطلاعات این محصول صرفاً برای نمایش تجربه خرید است؛ برای مصرف یک محصول واقعی، ترکیبات و دستور روی بسته‌بندی آن باید بررسی شوند.',
        highlights: [
            { label: 'حجم', value: '۳۰ میلی‌لیتر' },
            { label: 'بسته‌بندی', value: 'شیشه قطره‌چکانی' },
            { label: 'محل استفاده', value: 'صورت' },
            { label: 'نوع محصول', value: 'سرم' },
        ],
        colors: [], sizes: [], maxQuantity: 4,
        care: 'شرایط نگهداری و دستور مصرف محصول واقعی باید از روی برچسب همان محصول خوانده شود.',
    },
};

export function getProductDetails(product: Product): ProductDetails {
    const details = detailsByKind[product.artwork];
    if (product.id === 'homia-ceramic-mug') {
        return {
            ...details,
            highlights: [
                { label: 'گنجایش', value: '۳۵۰ میلی‌لیتر' },
                { label: 'جنس بدنه', value: 'سرامیک' },
                { label: 'درپوش', value: 'ندارد' },
                { label: 'روش شست‌وشو', value: 'دستی' },
            ],
        };
    }
    return details;
}
