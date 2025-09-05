// Checkbox Component - Component checkbox với accessibility đầy đủ
'use client';

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { CheckboxProps, Size } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { createFocusStyles, transitions } from '../../utils/theme';
import { cn, generateId } from '../../utils';

// Container cho checkbox và label
const CheckboxContainer = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  position: relative;
`;

// Wrapper cho checkbox input và custom checkbox
const CheckboxWrapper = styled.div<{
  $size: Size;
  $isChecked: boolean;
  $isIndeterminate: boolean;
  $isInvalid: boolean;
  $isDisabled: boolean;
  $colorScheme: 'primary' | 'secondary';
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${({ $size, theme }) => {
    const sizeMap = {
      xs: '1rem',
      sm: '1.125rem',
      md: '1.25rem',
      lg: '1.375rem',
      xl: '1.5rem',
    };
    
    const size = sizeMap[$size] || sizeMap.md;
    
    return css`
      width: ${size};
      height: ${size};
    `;
  }}
  
  border: 2px solid ${({ theme, $isInvalid, $isChecked, $isIndeterminate, $colorScheme, $isDisabled }) => {
    if ($isDisabled) return theme.colors.gray[300];
    if ($isInvalid) return theme.colors.error;
    if ($isChecked || $isIndeterminate) {
      return $colorScheme === 'primary' ? theme.colors.primary[500] : theme.colors.secondary[500];
    }
    return theme.colors.border;
  }};
  
  background-color: ${({ theme, $isChecked, $isIndeterminate, $colorScheme, $isDisabled }) => {
    if ($isDisabled) return theme.colors.gray[100];
    if ($isChecked || $isIndeterminate) {
      return $colorScheme === 'primary' ? theme.colors.primary[500] : theme.colors.secondary[500];
    }
    return theme.colors.background;
  }};
  
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: ${transitions.default};
  
  &:hover:not(:disabled) {
    border-color: ${({ theme, $isInvalid, $colorScheme }) => {
      if ($isInvalid) return theme.colors.error;
      return $colorScheme === 'primary' ? theme.colors.primary[400] : theme.colors.secondary[400];
    }};
  }
`;

// Hidden input element
const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: inherit;
  
  &:focus-visible + ${CheckboxWrapper} {
    ${({ theme }) => createFocusStyles(theme)}
  }
`;

// Check icon
const CheckIcon = styled.div<{
  $isVisible: boolean;
  $isIndeterminate: boolean;
  $size: Size;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: ${({ $isVisible }) => $isVisible ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.15s ease-in-out;
  
  ${({ $size }) => {
    const sizeMap = {
      xs: '0.5rem',
      sm: '0.625rem',
      md: '0.75rem',
      lg: '0.875rem',
      xl: '1rem',
    };
    
    const fontSize = sizeMap[$size] || sizeMap.md;
    
    return css`
      font-size: ${fontSize};
    `;
  }}
  
  &::before {
    content: '${({ $isIndeterminate }) => $isIndeterminate ? '−' : '✓'}';
  }
`;

// Label text
const LabelText = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $disabled }) => 
    $disabled ? theme.colors.text.disabled : theme.colors.text.primary
  };
  line-height: 1.4;
`;

// Checkbox component
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      isIndeterminate = false,
      isInvalid = false,
      isDisabled = false,
      children,
      colorScheme = 'primary',
      className,
      id,
      checked,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    
    // Tạo ID duy nhất nếu không được cung cấp
    const checkboxId = id || generateId('checkbox');
    
    // Xử lý trạng thái checked
    const isChecked = checked !== undefined ? checked : defaultChecked || false;
    
    return (
      <CheckboxContainer 
        htmlFor={checkboxId}
        $disabled={isDisabled}
        className={cn('ui-checkbox-container', className)}
      >
        <div style={{ position: 'relative' }}>
          <HiddenInput
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={isChecked}
            disabled={isDisabled}
            onChange={onChange}
            aria-invalid={isInvalid}
            aria-describedby={children ? `${checkboxId}-label` : undefined}
            theme={theme}
            {...props}
          />
          
          <CheckboxWrapper
            $size={size}
            $isChecked={isChecked}
            $isIndeterminate={isIndeterminate}
            $isInvalid={isInvalid}
            $isDisabled={isDisabled}
            $colorScheme={colorScheme}
            theme={theme}
          >
            <CheckIcon
              $isVisible={isChecked || isIndeterminate}
              $isIndeterminate={isIndeterminate}
              $size={size}
            />
          </CheckboxWrapper>
        </div>
        
        {/* Label text */}
        {children && (
          <LabelText 
            id={`${checkboxId}-label`}
            $disabled={isDisabled}
            theme={theme}
          >
            {children}
          </LabelText>
        )}
      </CheckboxContainer>
    );
  }
);

Checkbox.displayName = 'Checkbox';
