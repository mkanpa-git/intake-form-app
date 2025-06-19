import React from 'react';
// Global CSS files (jules_button.css, jules_misc.css for spinner) are imported in App.js

const Button = ({
    children,
    variant = 'primary', // 'primary', 'secondary', 'tertiary', 'destructive', 'danger' (alias for destructive)
    size = 'medium',     // 'small', 'medium', 'large'
    isLoading = false,
    iconLeft,
    iconRight,
    disabled,
    onClick,
    type = 'button',
    className = '', // Allow additional custom classes for the button itself
    fullWidth = false,
    ...props
}) => {
    const baseClass = 'jules-button';

    // Map variant 'danger' to 'destructive' if used
    const effectiveVariant = variant === 'danger' ? 'destructive' : variant;
    const variantClass = `jules-button-${effectiveVariant}`;

    const sizeClassMap = {
        small: 'jules-button-sm',
        medium: '', // No specific class for medium, it's the default
        large: 'jules-button-lg',
    };
    const sizeClass = sizeClassMap[size] || '';

    const fullWidthClass = fullWidth ? 'jules-button-full-width' : '';

    const combinedClasses = [
        baseClass,
        variantClass,
        sizeClass,
        isLoading ? 'is-loading' : '', // For potential specific loading styles on button itself
        fullWidthClass,
        className
    ].filter(Boolean).join(' ');

    const spinnerSizeClassMap = {
        small: 'jules-spinner-small',
        medium: '', // Default spinner size
        large: 'jules-spinner-large',
    };
    const spinnerSizeClass = spinnerSizeClassMap[size] || '';

    // Determine if there is any visible content other than the spinner
    const hasOtherContent = Boolean(children || iconLeft || iconRight);

    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-live={isLoading ? "polite" : undefined} // Announce loading state changes
            {...props}
        >
            {isLoading && (
                <span
                    className={`jules-spinner ${spinnerSizeClass}`}
                    aria-label="Loading"
                    role="status"
                    // Add margin-right only if there's other content that will become visible
                    // or if text is not hidden but shown alongside spinner.
                    // The current logic hides text if only text was present.
                    style={ (children && !iconLeft && !iconRight) ? {} : { marginRight: 'var(--jules-space-xs)' } }
                ></span>
            )}
            {iconLeft && !isLoading && (
                <span className="jules-button-icon jules-button-icon-leading">{iconLeft}</span>
            )}
            {/*
              If loading and there are no icons, the text (children) will be hidden by jules-button-text-hidden.
              If loading AND there ARE icons, the text is shown by default (not hidden by CSS).
              If not loading, text is shown.
            */}
            <span className={isLoading && !iconLeft && !iconRight ? 'jules-button-text-hidden' : ''}>
                {children}
            </span>
            {iconRight && !isLoading && (
                <span className="jules-button-icon jules-button-icon-trailing">{iconRight}</span>
            )}
        </button>
    );
};

export default Button;
