// Button Component - Component nút bấm với đầy đủ tính năng
'use client';

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { ButtonProps, Size, Variant } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { getSizeStyles, createFocusStyles, createDisabledStyles, transitions } from '../../utils/theme';
import { cn } from '../../utils';

// Styled Button component với các variant và size
const StyledButton = styled.button<{
  $variant: Variant;
  $size: Size;
  $fullWidth: boolean;
  $loading: boolean;
}>`
  /* Base styles - Styles cơ bản */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: none;
  cursor: pointer;
  transition: ${transitions.default};
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  
  /* Size styles - Styles theo kích thước */
  ${({ $size, theme }) => {
    const sizeStyles = getSizeStyles($size, theme);
    return css`
      padding: ${sizeStyles.padding};
      font-size: ${sizeStyles.fontSize};
      min-height: ${sizeStyles.height};
    `;
  }}
  
  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  /* Variant styles - Styles theo biến thể */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
            transform: translateY(0);
          }
        `;
      
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary[200]};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.sm};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.secondary[300]};
            transform: translateY(0);
          }
        `;
      
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary[600]};
          border: 1px solid ${theme.colors.primary[300]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[50]};
            border-color: ${theme.colors.primary[400]};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary[100]};
            transform: translateY(0);
          }
        `;
      
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.text.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.gray[200]};
            transform: translateY(0);
          }
        `;
      
      case 'link':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary[600]};
          padding: 0;
          min-height: auto;
          
          &:hover:not(:disabled) {
            color: ${theme.colors.primary[700]};
            text-decoration: underline;
          }
          
          &:active:not(:disabled) {
            color: ${theme.colors.primary[800]};
          }
        `;
      
      default:
        return css``;
    }
  }}
  
  /* Focus styles - Styles khi focus */
  &:focus-visible {
    outline: none;
    ${({ theme }) => createFocusStyles(theme)}
  }
  
  /* Disabled styles - Styles khi disabled */
  &:disabled {
    ${({ theme }) => createDisabledStyles(theme)}
  }
  
  /* Loading styles - Styles khi loading */
  ${({ $loading }) => $loading && css`
    pointer-events: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1em;
      height: 1em;
      margin: -0.5em 0 0 -0.5em;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
  
  /* Responsive styles - Styles responsive */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    ${({ $size }) => $size === 'xs' && css`
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    `}
  }
`;

// Loading spinner component
const LoadingSpinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Icon wrapper
const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  display: inline-flex;
  align-items: center;
  ${({ $position }) => $position === 'left' ? 'margin-right: 0.25rem;' : 'margin-left: 0.25rem;'}
`;

// Button component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    
    // Xử lý trạng thái disabled
    const isDisabled = disabled || loading;
    
    return (
      <StyledButton
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn('ui-button', className)}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $loading={loading}
        theme={theme}
        {...props}
      >
        {/* Left icon */}
        {leftIcon && !loading && (
          <IconWrapper $position="left">
            {leftIcon}
          </IconWrapper>
        )}
        
        {/* Loading spinner */}
        {loading && (
          <LoadingSpinner />
        )}
        
        {/* Button content */}
        {!loading && children}
        
        {/* Right icon */}
        {rightIcon && !loading && (
          <IconWrapper $position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
