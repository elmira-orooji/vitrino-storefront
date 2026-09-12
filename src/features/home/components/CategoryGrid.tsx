import {
    Baby,
    BookOpen,
    Dumbbell,
    Folder,
    HeartPulse,
    House,
    Laptop,
    Loader2,
    Shirt,
    ShoppingBasket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

import { useCategories } from '../hooks/useCategories';
import { homeCategories as fallbackCategories } from '../data';
import type { CategoryIconName, HomeCategory } from '../types';

const categoryIcons: Record<CategoryIconName, LucideIcon> = {
    baby: Baby,
    beauty: HeartPulse,
    book: BookOpen,
    digital: Laptop,
    fashion: Shirt,
    home: House,
    sport: Dumbbell,
    supermarket: ShoppingBasket,
};

// Map API category slug to icon name
function slugToIcon(slug: string): CategoryIconName {
    const mapping: Record<string, CategoryIconName> = {
        'digital': 'digital',
        'kala-ye-digital': 'digital',
        'home-kitchen': 'home',
        'khane-o-ashpazkhane': 'home',
        'fashion': 'fashion',
        'mod-o-pushak': 'fashion',
        'beauty': 'beauty',
        'zibayi-o-salamat': 'beauty',
        'sport': 'sport',
        'varzesh-o-safar': 'sport',
        'kids': 'baby',
        'koodak-o-sargarmi': 'baby',
        'books': 'book',
        'ketab-o-honar': 'book',
        'supermarket': 'supermarket',
    };
    return mapping[slug] || 'digital'; // Default fallback
}

const tones = ['sky', 'mint', 'coral', 'sand'] as const;

export const CategoryGrid: React.FC = () => {
    const { categories: apiCategories, isLoading, error } = useCategories();

    // Merge API categories with fallback icons/tones
    const displayCategories = useMemo<HomeCategory[]>(() => {
        if (error || apiCategories.length === 0) {
            return fallbackCategories;
        }

        return apiCategories.slice(0, 8).map((cat, index) => ({
            id: cat.slug,
            title: cat.title,
            icon: slugToIcon(cat.slug),
            tone: tones[index % tones.length],
        }));
    }, [apiCategories, error]);

    return (
        <section className="home-categories content-container" id="categories" aria-labelledby="categories-title">
            <div className="home-section-heading">
                <div>
                    <span>مسیر کوتاه‌تر برای انتخاب</span>
                    <h2 id="categories-title">دسته‌بندی‌های پرکاربرد</h2>
                </div>
                <a href="#categories">مشاهده همه دسته‌ها</a>
            </div>

            <div className="home-categories__grid">
                {isLoading && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                        <Loader2 aria-hidden="true" size={32} className="animate-spin" />
                    </div>
                )}

                {!isLoading && displayCategories.map((category) => {
                    const Icon = categoryIcons[category.icon] || Folder;

                    return (
                        <a className="category-tile" href={`#products?category=${category.id}`} key={category.id}>
                            <span className={`category-tile__art category-tile__art--${category.tone}`}>
                                <Icon aria-hidden="true" size={31} strokeWidth={1.6} />
                            </span>
                            <strong>{category.title}</strong>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryGrid;
