/**
 * HOTMESS LONDON — INPUT COMPONENT
 * 
 * Figma: HM/Input
 * Variants: Type, State
 */

import { InputHTMLAttributes, forwardRef, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { colors, radius, animation } from './tokens';
import { AlertCircle, Eye, EyeOff, Search } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input type */
  inputType?: 'text' | 'email' | 'password' | 'number' | 'search';
  
  /** Label text */
  label?: string;
  
  /** Helper text below input */
  helperText?: string;
  
  /** Error message (shows error state) */
  error?: string;
  
  /** Left icon */
  iconLeft?: ReactNode;
  
  /** Right icon */
  iconRight?: ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputType = 'text',
      label,
      helperText,
      error,
      iconLeft,
      iconRight,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasError = Boolean(error);
    const isPassword = inputType === 'password';
    const isSearch = inputType === 'search';

    // Determine actual input type
    const actualType = isPassword 
      ? (showPassword ? 'text' : 'password')
      : inputType === 'search' 
      ? 'text' 
      : inputType;

    return (
      <div className={className} style={{ width: '100%' }}>
        {/* Label */}
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: colors.white,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div style={{ position: 'relative' }}>
          {/* Left Icon */}
          {(iconLeft || isSearch) && (
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                color: hasError ? colors.orange : isFocused ? colors.red : colors.grey[500],
                transition: `color ${animation.base}`,
                pointerEvents: 'none',
              }}
            >
              {isSearch ? <Search size={20} /> : iconLeft}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={actualType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              height: '56px',
              padding: `0 ${isPassword || iconRight ? '48px' : '16px'} 0 ${iconLeft || isSearch ? '48px' : '16px'}`,
              fontSize: '16px',
              fontFamily: 'inherit',
              color: colors.white,
              backgroundColor: colors.grey[200],
              border: `2px solid ${hasError ? colors.orange : isFocused ? colors.red : colors.grey[400]}`,
              borderRadius: radius.button,
              outline: 'none',
              transition: `all ${animation.base} ${animation.ease}`,
              cursor: disabled ? 'not-allowed' : 'text',
              opacity: disabled ? 0.5 : 1,
              boxShadow: isFocused && !hasError ? `0 0 0 4px ${colors.red}20` : 'none',
            }}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                border: 'none',
                background: 'none',
                color: isFocused ? colors.red : colors.grey[500],
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: `color ${animation.base}`,
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {/* Right Icon */}
          {iconRight && !isPassword && (
            <div
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                color: hasError ? colors.orange : isFocused ? colors.red : colors.grey[500],
                transition: `color ${animation.base}`,
                pointerEvents: 'none',
              }}
            >
              {iconRight}
            </div>
          )}
        </div>

        {/* Helper Text / Error */}
        <AnimatePresence mode="wait">
          {(helperText || error) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '14px',
                color: hasError ? colors.orange : colors.grey[500],
              }}
            >
              {hasError && <AlertCircle size={16} />}
              <span>{error || helperText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// TEXTAREA VARIANT
// ============================================================================

export interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string;
  
  /** Helper text below input */
  helperText?: string;
  
  /** Error message (shows error state) */
  error?: string;
  
  /** Number of rows */
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      rows = 4,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = Boolean(error);

    return (
      <div className={className} style={{ width: '100%' }}>
        {/* Label */}
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: colors.white,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            minHeight: `${rows * 24 + 32}px`,
            padding: '16px',
            fontSize: '16px',
            fontFamily: 'inherit',
            color: colors.white,
            backgroundColor: colors.grey[200],
            border: `2px solid ${hasError ? colors.orange : isFocused ? colors.red : colors.grey[400]}`,
            borderRadius: radius.button,
            outline: 'none',
            resize: 'vertical',
            transition: `all ${animation.base} ${animation.ease}`,
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.5 : 1,
            boxShadow: isFocused && !hasError ? `0 0 0 4px ${colors.red}20` : 'none',
          }}
          {...props}
        />

        {/* Helper Text / Error */}
        <AnimatePresence mode="wait">
          {(helperText || error) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '14px',
                color: hasError ? colors.orange : colors.grey[500],
              }}
            >
              {hasError && <AlertCircle size={16} />}
              <span>{error || helperText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================================================
// EXPORT
// ============================================================================

export default Input;
