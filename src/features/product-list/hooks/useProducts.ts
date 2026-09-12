import { useCallback, useEffect, useState } from 'react';

import { productsApi, type Product, type ProductQueryParams } from '@/lib/api';

interface UseProductsResult {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    setPage: (page: number) => void;
    refetch: () => void;
}

export function useProducts(params: ProductQueryParams = {}): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(params.page ?? 1);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await productsApi.list({
                ...params,
                page: currentPage,
            });
            setProducts(response.items);
            setTotal(response.pagination.total);
            setTotalPages(response.pagination.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'خطا در دریافت محصولات');
        } finally {
            setIsLoading(false);
        }
    }, [params.search, params.category, params.minPrice, params.maxPrice, params.sort, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [params.search, params.category, params.minPrice, params.maxPrice, params.sort]);

    return {
        products,
        isLoading,
        error,
        total,
        totalPages,
        currentPage,
        setPage: setCurrentPage,
        refetch: fetchProducts,
    };
}
