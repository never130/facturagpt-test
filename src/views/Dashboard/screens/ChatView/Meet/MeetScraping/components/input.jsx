import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './input.module.css';

const DynamicInput = forwardRef(({
  icon,
  title,
  subtitle,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  errorMessage = '',
  helperText = '',
  size = 'medium',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const containerClasses = [
    styles.inputContainer,
    styles[size],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    styles.inputWrapper,
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
    variant === 'filled' && styles.filled,
    variant === 'outlined' && styles.outlined
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    disabled && styles.disabled,
    readOnly && styles.readOnly
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Title */}
      {title && (
        <label className={styles.label}>
          {title}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div className={styles.helperText} style={{ marginBottom: '8px' }}>
          {subtitle}
        </div>
      )}

      {/* Input Wrapper */}
      <div className={wrapperClasses}>
        {/* Left Icon */}
        {icon && (
          <div className={styles.leftIcon}>
            {typeof icon === 'string' ? (
              <span className={styles.icon}>{icon}</span>
            ) : (
              <div className={styles.icon}>{icon}</div>
            )}
          </div>
        )}

        {/* Input Content */}
        <div className={styles.inputContent}>
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={inputClasses}
            {...props}
          />
        </div>
      </div>

      {/* Messages */}
      {(errorMessage || helperText) && (
        <div className={styles.messageContainer}>
          {error && errorMessage ? (
            <div className={styles.errorMessage}>{errorMessage}</div>
          ) : helperText ? (
            <div className={styles.helperText}>{helperText}</div>
          ) : null}
        </div>
      )}
    </div>
  );
});


export default DynamicInput;
