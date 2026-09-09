import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Visible label above the input. */
    label?: string;
    /** Helper text below the input. */
    helperText?: string;
    /** Error message; when set the input enters error state. */
    error?: string;
    /** Icon or element rendered at the start of the input. */
    startAdornment?: ReactNode;
    /** Icon or element rendered at the end of the input. */
    endAdornment?: ReactNode;
    /** Hide the visible label but keep it accessible. */
    hideLabel?: boolean;
}

/**
 * Cross UI–inspired text input with label, helper text, error state, and adornment slots.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        label,
        helperText,
        error,
        startAdornment,
        endAdornment,
        hideLabel = false,
        className,
        id: externalId,
        ...rest
    },
    ref,
) {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const wrapperClasses = [
        'cui-input',
        error ? 'cui-input--error' : '',
        rest.disabled ? 'cui-input--disabled' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className={wrapperClasses}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`cui-input__label${hideLabel ? ' sr-only' : ''}`}
                >
                    {label}
                </label>
            )}
            <div className="cui-input__field-wrap">
                {startAdornment && (
                    <span className="cui-input__adornment cui-input__adornment--start" aria-hidden="true">
                        {startAdornment}
                    </span>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className="cui-input__field"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    {...rest}
                />
                {endAdornment && (
                    <span className="cui-input__adornment cui-input__adornment--end" aria-hidden="true">
                        {endAdornment}
                    </span>
                )}
            </div>
            {error && <p className="cui-input__message cui-input__message--error" id={errorId}>{error}</p>}
            {!error && helperText && (
                <p className="cui-input__message cui-input__message--helper" id={helperId}>{helperText}</p>
            )}
        </div>
    );
});

export default Input;
