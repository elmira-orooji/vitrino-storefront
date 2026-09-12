import { useEffect, useState } from 'react';

import { productsApi, type Product as ApiProduct } from '@/lib/api';

interface UseProductResult {
    product: ApiProduct | null;
    isLoading: boolean;
    error: string | null;
}

export function useProduct(idOrSlug: string): UseProductResult {
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!idOrSlug) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        // Try by ID first, then by slug
        productsApi.getById(idOrSlug)
            .then((response) => {
                if (isMounted) {
                    setProduct(response.item);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    // If getById fails, try getBySlug
                    productsApi.getBySlug(idOrSlug)
                        .then((response) => {
                            if (isMounted) {
                                setProduct(response.item);
                            }
                        })
                        .catch(() => {
                            if (isMounted) {
                                setError(err instanceof Error ? err.message : 'محصول یافت نشد');
                            }
                        });
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [idOrSlug]);

    return { product, isLoading, error };
}
