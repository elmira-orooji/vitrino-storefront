import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Color variant. */
    variant?: BadgeVariant;
    /** Size preset. */
    size?: BadgeSize;
    /** Optional leading dot indicator. */
    dot?: boolean;
    /** Optional leading icon or element. */
    startIcon?: ReactNode;
    /** Content rendered inside the badge. */
    children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
    primary: 'cui-badge--primary',
    secondary: 'cui-badge--secondary',
    success: 'cui-badge--success',
    warning: 'cui-badge--warning',
    danger: 'cui-badge--danger',
    neutral: 'cui-badge--neutral',
};

/**
 * Cross UI–inspired badge / tag component.
 *
 * Used for discount labels, delivery tags, status indicators, etc.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    { variant = 'neutral', size = 'sm', dot = false, startIcon, className, children, ...rest },
    ref,
) {
    const classes = [
        'cui-badge',
        variantClasses[variant],
        `cui-badge--${size}`,
        dot ? 'cui-badge--dot' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span ref={ref} className={classes} {...rest}>
            {dot && <span className="cui-badge__dot" aria-hidden="true" />}
            {startIcon && <span className="cui-badge__icon" aria-hidden="true">{startIcon}</span>}
            <span className="cui-badge__label">{children}</span>
        </span>
    );
});

export default Badge;
