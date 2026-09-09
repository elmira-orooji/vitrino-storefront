import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style variant. */
    variant?: ButtonVariant;
    /** Size preset. */
    size?: ButtonSize;
    /** Show loading spinner and disable interaction. */
    loading?: boolean;
    /** Render as full-width block. */
    fullWidth?: boolean;
    /** Optional leading icon or element. */
    startIcon?: ReactNode;
    /** Optional trailing icon or element. */
    endIcon?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'cui-btn--sm',
    md: 'cui-btn--md',
    lg: 'cui-btn--lg',
};

/**
 * Cross UI–inspired base button component.
 *
 * Provides consistent styling, loading state, and icon slots across the storefront.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        variant = 'primary',
        size = 'md',
        loading = false,
        fullWidth = false,
        startIcon,
        endIcon,
        className,
        children,
        disabled,
        ...rest
    },
    ref,
) {
    const classes = [
        'cui-btn',
        `cui-btn--${variant}`,
        sizeClasses[size],
        fullWidth ? 'cui-btn--full' : '',
        loading ? 'cui-btn--loading' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}
        >
            {loading && <span className="cui-btn__spinner" aria-hidden="true" />}
            {!loading && startIcon && <span className="cui-btn__icon cui-btn__icon--start">{startIcon}</span>}
            {!loading && <span className="cui-btn__label">{children}</span>}
            {!loading && endIcon && <span className="cui-btn__icon cui-btn__icon--end">{endIcon}</span>}
        </button>
    );
});

export default Button;
