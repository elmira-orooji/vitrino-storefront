import { useEffect, useState } from 'react';

import { categoriesApi, type Category } from '@/lib/api';

interface UseCategoriesResult {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

export function useCategories(): UseCategoriesResult {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchCategories() {
            try {
                const response = await categoriesApi.tree();
                if (!cancelled) {
                    setCategories(response.items);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'خطا در دریافت دسته‌بندی‌ها');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    return { categories, isLoading, error };
}
