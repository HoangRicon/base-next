// Radio Component - Component radio button với accessibility đầy đủ
'use client';

import React, { forwardRef, createContext, useContext } from 'react';
import styled, { css } from 'styled-components';
import { RadioProps, RadioGroupProps, Size } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { createFocusStyles, transitions } from '../../utils/theme';
import { cn, generateId } from '../../utils';

// Context cho RadioGroup
interface RadioGroupContextType {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  size?: Size;
  colorScheme?: 'primary' | 'secondary';
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

// Hook để sử dụng RadioGroup context
const useRadioGroup = () => {
  return useContext(RadioGroupContext);
};

// Container cho radio và label
const RadioContainer = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  user-select: none;
  position: relative;
`;

// Wrapper cho radio input và custom radio
const RadioWrapper = styled.div<{
  $size: Size;
  $isChecked: boolean;
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
  
  border: 2px solid ${({ theme, $isInvalid, $isChecked, $colorScheme, $isDisabled }) => {
    if ($isDisabled) return theme.colors.gray[300];
    if ($isInvalid) return theme.colors.error;
    if ($isChecked) {
      return $colorScheme === 'primary' ? theme.colors.primary[500] : theme.colors.secondary[500];
    }
    return theme.colors.border;
  }};
  
  background-color: ${({ theme, $isDisabled }) => 
    $isDisabled ? theme.colors.gray[100] : theme.colors.background
  };
  
  border-radius: 50%;
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
  
  &:focus-visible + ${RadioWrapper} {
    ${({ theme }) => createFocusStyles(theme)}
  }
`;

// Radio dot (inner circle)
const RadioDot = styled.div<{
  $isVisible: boolean;
  $size: Size;
  $colorScheme: 'primary' | 'secondary';
}>`
  border-radius: 50%;
  background-color: ${({ theme, $colorScheme }) => 
    $colorScheme === 'primary' ? theme.colors.primary[500] : theme.colors.secondary[500]
  };
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: ${({ $isVisible }) => $isVisible ? 'scale(1)' : 'scale(0)'};
  transition: all 0.15s ease-in-out;
  
  ${({ $size }) => {
    const sizeMap = {
      xs: '0.375rem',
      sm: '0.4375rem',
      md: '0.5rem',
      lg: '0.5625rem',
      xl: '0.625rem',
    };
    
    const dotSize = sizeMap[$size] || sizeMap.md;
    
    return css`
      width: ${dotSize};
      height: ${dotSize};
    `;
  }}
`;

// Label text
const LabelText = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $disabled }) => 
    $disabled ? theme.colors.text.disabled : theme.colors.text.primary
  };
  line-height: 1.4;
`;

// RadioGroup container
const RadioGroupContainer = styled.div<{ $direction?: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'column'};
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Radio component
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size: propSize = 'md',
      isInvalid = false,
      isDisabled: propIsDisabled = false,
      children,
      colorScheme: propColorScheme = 'primary',
      className,
      id,
      value,
      checked,
      onChange,
      name: propName,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const radioGroup = useRadioGroup();
    
    // Sử dụng giá trị từ RadioGroup nếu có, nếu không thì dùng props
    const size = radioGroup?.size || propSize;
    const isDisabled = radioGroup?.isDisabled || propIsDisabled;
    const colorScheme = radioGroup?.colorScheme || propColorScheme;
    const name = radioGroup?.name || propName;
    
    // Tạo ID duy nhất nếu không được cung cấp
    const radioId = id || generateId('radio');
    
    // Xử lý trạng thái checked
    const isChecked = radioGroup 
      ? radioGroup.value === value 
      : checked || false;
    
    // Xử lý onChange
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (radioGroup && value !== undefined) {
        radioGroup.onChange?.(value.toString());
      }
      onChange?.(event);
    };
    
    return (
      <RadioContainer 
        htmlFor={radioId}
        $disabled={isDisabled}
        className={cn('ui-radio-container', className)}
      >
        <div style={{ position: 'relative' }}>
          <HiddenInput
            ref={ref}
            id={radioId}
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            onChange={handleChange}
            aria-invalid={isInvalid}
            aria-describedby={children ? `${radioId}-label` : undefined}
            theme={theme}
            {...props}
          />
          
          <RadioWrapper
            $size={size}
            $isChecked={isChecked}
            $isInvalid={isInvalid}
            $isDisabled={isDisabled}
            $colorScheme={colorScheme}
            theme={theme}
          >
            <RadioDot
              $isVisible={isChecked}
              $size={size}
              $colorScheme={colorScheme}
              theme={theme}
            />
          </RadioWrapper>
        </div>
        
        {/* Label text */}
        {children && (
          <LabelText 
            id={`${radioId}-label`}
            $disabled={isDisabled}
            theme={theme}
          >
            {children}
          </LabelText>
        )}
      </RadioContainer>
    );
  }
);

Radio.displayName = 'Radio';

// RadioGroup component
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  defaultValue,
  onChange,
  children,
  isDisabled = false,
  size = 'md',
  colorScheme = 'primary',
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || '');
  
  // Sử dụng controlled hoặc uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const contextValue: RadioGroupContextType = {
    name,
    value: currentValue,
    onChange: handleChange,
    isDisabled,
    size,
    colorScheme,
  };
  
  return (
    <RadioGroupContext.Provider value={contextValue}>
      <RadioGroupContainer role="radiogroup" {...props}>
        {children}
      </RadioGroupContainer>
    </RadioGroupContext.Provider>
  );
};
