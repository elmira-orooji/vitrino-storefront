// Quantity-control pattern adapted from the 21st.dev product-detail component.
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
    value: number;
    maximum: number;
    disabled?: boolean;
    onChange: (value: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ value, maximum, disabled = false, onChange }) => (
    <div className="quantity-selector" role="group" aria-label="تعداد محصول">
        <button type="button" aria-label="افزایش تعداد" disabled={disabled || value >= maximum} onClick={() => onChange(value + 1)}>
            <Plus size={16} aria-hidden="true" />
        </button>
        <output aria-label="تعداد انتخاب‌شده" aria-live="polite">{value.toLocaleString('fa-IR')}</output>
        <button type="button" aria-label="کاهش تعداد" disabled={disabled || value <= 1} onClick={() => onChange(value - 1)}>
            <Minus size={16} aria-hidden="true" />
        </button>
    </div>
);

export default QuantitySelector;
