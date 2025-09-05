// Input Component - Component input với đầy đủ tính năng
'use client';

import React, { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { InputProps, Size } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { getSizeStyles, createFocusStyles, createDisabledStyles, transitions } from '../../utils/theme';
import { cn, generateId } from '../../utils';

// Container cho toàn bộ input group
const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
`;

// Label cho input
const InputLabel = styled.label<{ $required?: boolean; $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme, $disabled }) => 
    $disabled ? theme.colors.text.disabled : theme.colors.text.primary
  };
  
  ${({ $required, theme }) => $required && css`
    &::after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

// Wrapper cho input và icons
const InputWrapper = styled.div<{
  $variant: 'outline' | 'filled' | 'flushed';
  $size: Size;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
  $isInvalid: boolean;
  $isFocused: boolean;
  $isDisabled: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  
  ${({ $variant, theme, $isInvalid, $isFocused, $isDisabled }) => {
    const borderColor = $isInvalid 
      ? theme.colors.error 
      : $isFocused 
        ? theme.colors.primary[500]
        : theme.colors.border;
    
    switch ($variant) {
      case 'outline':
        return css`
          border: 1px solid ${borderColor};
          border-radius: ${theme.borderRadius.md};
          background-color: ${$isDisabled ? theme.colors.gray[50] : theme.colors.background};
          transition: ${transitions.default};
          
          &:hover:not(:disabled) {
            border-color: ${$isInvalid ? theme.colors.error : theme.colors.primary[300]};
          }
        `;
      
      case 'filled':
        return css`
          border: 1px solid transparent;
          border-radius: ${theme.borderRadius.md};
          background-color: ${$isDisabled ? theme.colors.gray[100] : theme.colors.gray[50]};
          transition: ${transitions.default};
          
          ${$isFocused && css`
            background-color: ${theme.colors.background};
            border-color: ${borderColor};
            box-shadow: ${theme.shadows.sm};
          `}
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
          }
        `;
      
      case 'flushed':
        return css`
          border: none;
          border-bottom: 1px solid ${borderColor};
          border-radius: 0;
          background-color: transparent;
          transition: ${transitions.default};
          
          &:hover:not(:disabled) {
            border-bottom-color: ${$isInvalid ? theme.colors.error : theme.colors.primary[300]};
          }
        `;
      
      default:
        return css``;
    }
  }}
  
  ${({ $size, theme }) => {
    const sizeStyles = getSizeStyles($size, theme);
    return css`
      min-height: ${sizeStyles.height};
      padding: 0 ${sizeStyles.padding.split(' ')[1]};
    `;
  }}
  
  ${({ $hasLeftIcon, theme }) => $hasLeftIcon && css`
    padding-left: calc(${theme.spacing.lg} + 1.5rem);
  `}
  
  ${({ $hasRightIcon, theme }) => $hasRightIcon && css`
    padding-right: calc(${theme.spacing.lg} + 1.5rem);
  `}
`;

// Styled input element
const StyledInput = styled.input<{
  $size: Size;
}>`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  
  ${({ $size, theme }) => {
    const sizeStyles = getSizeStyles($size, theme);
    return css`
      font-size: ${sizeStyles.fontSize};
      padding: ${theme.spacing.xs} 0;
    `;
  }}
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
  
  /* Loại bỏ spinner cho number input */
  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  
  /* Styles cho password input */
  &[type="password"] {
    font-family: text-security-disc;
  }
`;

// Icon wrapper
const IconWrapper = styled.div<{ $position: 'left' | 'right'; $clickable?: boolean }>`
  position: absolute;
  ${({ $position }) => $position}: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: ${({ $clickable }) => $clickable ? 'auto' : 'none'};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  
  ${({ $clickable, theme }) => $clickable && css`
    &:hover {
      color: ${theme.colors.text.primary};
    }
  `}
`;

// Helper text
const HelperText = styled.div<{ $isError?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme, $isError }) => 
    $isError ? theme.colors.error : theme.colors.text.secondary
  };
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

// Input component
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'outline',
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      isInvalid = false,
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      className,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Tạo ID duy nhất nếu không được cung cấp
    const inputId = id || generateId('input');
    
    // Xử lý type cho password input
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    // Xử lý icon cho password input
    const finalRightIcon = type === 'password' ? (
      <IconWrapper 
        $position="right" 
        $clickable
        onClick={() => setShowPassword(!showPassword)}
        role="button"
        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      >
        {showPassword ? '🙈' : '👁️'}
      </IconWrapper>
    ) : rightIcon ? (
      <IconWrapper $position="right">
        {rightIcon}
      </IconWrapper>
    ) : null;
    
    return (
      <InputContainer $fullWidth={props.style?.width === '100%'}>
        {/* Label */}
        {label && (
          <InputLabel 
            htmlFor={inputId}
            $required={isRequired}
            $disabled={isDisabled}
          >
            {label}
          </InputLabel>
        )}
        
        {/* Input wrapper */}
        <InputWrapper
          $variant={variant}
          $size={size}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon || type === 'password'}
          $isInvalid={isInvalid || !!errorText}
          $isFocused={isFocused}
          $isDisabled={isDisabled}
          theme={theme}
        >
          {/* Left icon */}
          {leftIcon && (
            <IconWrapper $position="left">
              {leftIcon}
            </IconWrapper>
          )}
          
          {/* Input element */}
          <StyledInput
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={isDisabled}
            readOnly={isReadOnly}
            className={cn('ui-input', className)}
            $size={size}
            theme={theme}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={isInvalid || !!errorText}
            aria-required={isRequired}
            aria-describedby={
              helperText || errorText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {/* Right icon */}
          {finalRightIcon}
        </InputWrapper>
        
        {/* Helper text hoặc error text */}
        {(helperText || errorText) && (
          <HelperText 
            id={`${inputId}-helper`}
            $isError={!!errorText}
            theme={theme}
          >
            {errorText || helperText}
          </HelperText>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';
