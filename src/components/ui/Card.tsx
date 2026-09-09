import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Optional header content rendered above the body. */
    header?: ReactNode;
    /** Optional footer content rendered below the body. */
    footer?: ReactNode;
    /** Remove default padding for custom layouts. */
    noPadding?: boolean;
    /** Visual elevation level. */
    elevation?: 'flat' | 'raised' | 'hover';
}

/**
 * Cross UI–inspired card container.
 *
 * Wraps arbitrary content in a consistent surface with optional header/footer slots.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
    { header, footer, noPadding = false, elevation = 'raised', className, children, ...rest },
    ref,
) {
    const classes = [
        'cui-card',
        `cui-card--${elevation}`,
        noPadding ? 'cui-card--no-padding' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={ref} className={classes} {...rest}>
            {header && <div className="cui-card__header">{header}</div>}
            <div className="cui-card__body">{children}</div>
            {footer && <div className="cui-card__footer">{footer}</div>}
        </div>
    );
});

export default Card;
