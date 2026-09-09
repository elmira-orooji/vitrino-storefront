export interface ProductColor {
    id: string;
    label: string;
    hex: string;
}

export interface ProductDetails {
    description: string;
    highlights: readonly { label: string; value: string }[];
    colors: readonly ProductColor[];
    sizes: readonly { value: string; available: boolean }[];
    maxQuantity: number;
    care: string;
}

export interface ProductSelection {
    colorId: string;
    size: string;
    quantity: number;
}
