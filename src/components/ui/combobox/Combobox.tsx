// Combobox Component - Component select với search và keyboard navigation
'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { SelectProps, Option, Size } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { getSizeStyles, createFocusStyles, transitions } from '../../utils/theme';
import { cn, generateId } from '../../utils';

// Container cho toàn bộ combobox
const ComboboxContainer = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
`;

// Label cho combobox
const ComboboxLabel = styled.label<{ $required?: boolean; $disabled?: boolean }>`
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

// Trigger button cho combobox
const ComboboxTrigger = styled.button<{
  $size: Size;
  $isOpen: boolean;
  $isInvalid: boolean;
  $isDisabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  border: 1px solid ${({ theme, $isInvalid, $isOpen }) => 
    $isInvalid ? theme.colors.error : 
    $isOpen ? theme.colors.primary[500] : theme.colors.border
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $isDisabled }) => 
    $isDisabled ? theme.colors.gray[50] : theme.colors.background
  };
  color: ${({ theme, $isDisabled }) => 
    $isDisabled ? theme.colors.text.disabled : theme.colors.text.primary
  };
  cursor: ${({ $isDisabled }) => $isDisabled ? 'not-allowed' : 'pointer'};
  transition: ${transitions.default};
  
  ${({ $size, theme }) => {
    const sizeStyles = getSizeStyles($size, theme);
    return css`
      padding: ${sizeStyles.padding};
      font-size: ${sizeStyles.fontSize};
      min-height: ${sizeStyles.height};
    `;
  }}
  
  &:hover:not(:disabled) {
    border-color: ${({ theme, $isInvalid }) => 
      $isInvalid ? theme.colors.error : theme.colors.primary[300]
    };
  }
  
  &:focus-visible {
    outline: none;
    ${({ theme }) => createFocusStyles(theme)}
  }
`;

// Dropdown container
const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  
  ${({ $isOpen }) => css`
    display: ${$isOpen ? 'block' : 'none'};
    animation: ${$isOpen ? 'slideDown' : 'slideUp'} 0.2s ease-out;
  `}
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

// Search input trong dropdown
const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  outline: none;
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

// Option item
const OptionItem = styled.div<{ 
  $isSelected: boolean; 
  $isHighlighted: boolean;
  $isDisabled: boolean;
}>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: ${({ $isDisabled }) => $isDisabled ? 'not-allowed' : 'pointer'};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $isDisabled }) => 
    $isDisabled ? theme.colors.text.disabled : theme.colors.text.primary
  };
  
  ${({ $isSelected, theme }) => $isSelected && css`
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
    font-weight: ${theme.fontWeight.medium};
  `}
  
  ${({ $isHighlighted, theme }) => $isHighlighted && css`
    background-color: ${theme.colors.gray[100]};
  `}
  
  &:hover:not([disabled]) {
    background-color: ${({ theme, $isSelected }) => 
      $isSelected ? theme.colors.primary[200] : theme.colors.gray[100]
    };
  }
`;

// Chevron icon
const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  &::before {
    content: '▼';
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

// Helper text
const HelperText = styled.div<{ $isError?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme, $isError }) => 
    $isError ? theme.colors.error : theme.colors.text.secondary
  };
`;

// Combobox component
export const Combobox = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      placeholder = 'Chọn một tùy chọn...',
      isMulti = false,
      isSearchable = true,
      isDisabled = false,
      isLoading = false,
      isClearable = false,
      size = 'md',
      onChange,
      onInputChange,
      label,
      helperText,
      errorText,
      isInvalid = false,
      isRequired = false,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // Tạo ID duy nhất
    const comboboxId = generateId('combobox');
    
    // Filter options dựa trên search value
    const filteredOptions = isSearchable 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;
    
    // Tìm option được chọn
    const selectedOption = options.find(option => option.value === selectedValue);
    
    // Xử lý click outside để đóng dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchValue('');
          setHighlightedIndex(-1);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Xử lý keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        
        case 'ArrowUp':
          event.preventDefault();
          if (isOpen) {
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
        
        case 'Enter':
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          } else {
            setIsOpen(!isOpen);
          }
          break;
        
        case 'Escape':
          setIsOpen(false);
          setSearchValue('');
          setHighlightedIndex(-1);
          break;
      }
    };
    
    // Xử lý chọn option
    const handleSelectOption = (option: Option) => {
      setSelectedValue(option.value);
      setIsOpen(false);
      setSearchValue('');
      setHighlightedIndex(-1);
      onChange?.(option.value);
    };
    
    // Xử lý search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSearchValue(newValue);
      setHighlightedIndex(-1);
      onInputChange?.(newValue);
    };
    
    return (
      <ComboboxContainer ref={containerRef} $fullWidth>
        {/* Label */}
        {label && (
          <ComboboxLabel 
            htmlFor={comboboxId}
            $required={isRequired}
            $disabled={isDisabled}
          >
            {label}
          </ComboboxLabel>
        )}
        
        {/* Trigger button */}
        <ComboboxTrigger
          ref={ref}
          id={comboboxId}
          type="button"
          disabled={isDisabled}
          $size={size}
          $isOpen={isOpen}
          $isInvalid={isInvalid || !!errorText}
          $isDisabled={isDisabled}
          theme={theme}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={isInvalid || !!errorText}
          aria-required={isRequired}
          {...props}
        >
          <span>
            {isLoading ? 'Đang tải...' : selectedOption?.label || placeholder}
          </span>
          <ChevronIcon $isOpen={isOpen} theme={theme} />
        </ComboboxTrigger>
        
        {/* Dropdown */}
        <DropdownContainer $isOpen={isOpen} theme={theme}>
          {/* Search input */}
          {isSearchable && (
            <SearchInput
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm..."
              value={searchValue}
              onChange={handleSearchChange}
              theme={theme}
            />
          )}
          
          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <OptionItem
                key={option.value}
                $isSelected={option.value === selectedValue}
                $isHighlighted={index === highlightedIndex}
                $isDisabled={option.disabled || false}
                theme={theme}
                onClick={() => !option.disabled && handleSelectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </OptionItem>
            ))
          ) : (
            <OptionItem
              $isSelected={false}
              $isHighlighted={false}
              $isDisabled={true}
              theme={theme}
            >
              Không tìm thấy kết quả
            </OptionItem>
          )}
        </DropdownContainer>
        
        {/* Helper text hoặc error text */}
        {(helperText || errorText) && (
          <HelperText $isError={!!errorText} theme={theme}>
            {errorText || helperText}
          </HelperText>
        )}
      </ComboboxContainer>
    );
  }
);

Combobox.displayName = 'Combobox';
