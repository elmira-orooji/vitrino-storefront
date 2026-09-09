import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import type { Product } from '~types/product';

import type { ProductDetails } from '../types';

interface ProductInformationProps {
    product: Product;
    details: ProductDetails;
}

const tabs = ['معرفی محصول', 'مشخصات', 'ارسال و بازگشت'] as const;

export const ProductInformation: React.FC<ProductInformationProps> = ({ product, details }) => {
    const [activeTab, setActiveTab] = useState(0);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const id = useId();

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
        let nextIndex: number;
        if (event.key === 'ArrowLeft') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowRight') nextIndex = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        setActiveTab(nextIndex);
        tabRefs.current[nextIndex]?.focus();
    };

    return (
        <section className="detail-information" aria-label="اطلاعات تکمیلی محصول">
            <div className="detail-tabs" role="tablist" aria-label="اطلاعات محصول">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        id={`${id}-tab-${index}`}
                        aria-controls={`${id}-panel-${index}`}
                        aria-selected={activeTab === index}
                        tabIndex={activeTab === index ? 0 : -1}
                        ref={(element) => { tabRefs.current[index] = element; }}
                        onClick={() => setActiveTab(index)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >{tab}</button>
                ))}
            </div>
            {tabs.map((tab, index) => (
                <div
                    className="detail-tab-panel"
                    role="tabpanel"
                    id={`${id}-panel-${index}`}
                    aria-labelledby={`${id}-tab-${index}`}
                    tabIndex={0}
                    hidden={activeTab !== index}
                    key={tab}
                >
                    {index === 0 && <><h2>{product.title}</h2><p>{details.description}</p><h3>نگهداری و استفاده</h3><p>{details.care}</p></>}
                    {index === 1 && <><h2>مشخصات محصول</h2><dl className="detail-specifications">{[{ label: 'برند', value: product.brand }, ...details.highlights].map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></>}
                    {index === 2 && <><h2>پیش از خرید</h2><p>روش ارسال و هزینه آن در مرحله ثبت سفارش مشخص می‌شود. برچسب ارسال سریع در این نسخه، داده آزمایشی است و زمان تحویل واقعی را نشان نمی‌دهد.</p><p>شرایط بازگشت این فروشگاه نمونه است؛ در این مرحله سفارش و پرداخت واقعی انجام نمی‌شود.</p></>}
                </div>
            ))}
        </section>
    );
};

export default ProductInformation;
