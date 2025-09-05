// Loading Component - Component loading spinner với các size và style khác nhau
'use client';

import React, { forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { LoadingProps, Size } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { cn } from '../../utils';

// Keyframes cho animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

// Container cho loading spinner
const LoadingContainer = styled.div<{ $hasLabel: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme, $hasLabel }) => $hasLabel ? theme.spacing.sm : '0'};
`;

// Spinner circle
const SpinnerCircle = styled.div<{
  $size: Size;
  $color?: string;
  $thickness?: string;
  $speed?: string;
  $emptyColor?: string;
}>`
  border-radius: 50%;
  border-style: solid;
  animation: ${spin} ${({ $speed }) => $speed || '1s'} linear infinite;
  
  ${({ $size, theme }) => {
    const sizeMap = {
      xs: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    };
    
    const size = sizeMap[$size] || sizeMap.md;
    
    return css`
      width: ${size};
      height: ${size};
    `;
  }}
  
  border-width: ${({ $thickness }) => $thickness || '2px'};
  border-color: ${({ theme, $emptyColor }) => $emptyColor || theme.colors.gray[200]};
  border-top-color: ${({ theme, $color }) => $color || theme.colors.primary[500]};
`;

// Dots spinner
const DotsContainer = styled.div<{ $size: Size }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ $size }) => {
    const sizeMap = {
      xs: '0.25rem',
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.625rem',
      xl: '0.75rem',
    };
    
    const dotSize = sizeMap[$size] || sizeMap.md;
    
    return css`
      .dot {
        width: ${dotSize};
        height: ${dotSize};
      }
    `;
  }}
`;

const Dot = styled.div<{ $color?: string; $delay: number }>`
  border-radius: 50%;
  background-color: ${({ theme, $color }) => $color || theme.colors.primary[500]};
  animation: ${bounce} 1.4s ease-in-out ${({ $delay }) => $delay}s infinite both;
`;

// Bars spinner
const BarsContainer = styled.div<{ $size: Size }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: flex-end;
  
  ${({ $size }) => {
    const sizeMap = {
      xs: { width: '0.125rem', height: '1rem' },
      sm: { width: '0.1875rem', height: '1.25rem' },
      md: { width: '0.25rem', height: '1.5rem' },
      lg: { width: '0.3125rem', height: '2rem' },
      xl: { width: '0.375rem', height: '2.5rem' },
    };
    
    const { width, height } = sizeMap[$size] || sizeMap.md;
    
    return css`
      height: ${height};
      
      .bar {
        width: ${width};
        max-height: ${height};
      }
    `;
  }}
`;

const Bar = styled.div<{ $color?: string; $delay: number }>`
  background-color: ${({ theme, $color }) => $color || theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: ${pulse} 1.2s ease-in-out ${({ $delay }) => $delay}s infinite;
  height: 100%;
`;

// Label text
const LoadingLabel = styled.span<{ $size: Size }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  
  ${({ $size, theme }) => {
    const fontSizeMap = {
      xs: theme.fontSize.xs,
      sm: theme.fontSize.sm,
      md: theme.fontSize.base,
      lg: theme.fontSize.lg,
      xl: theme.fontSize.xl,
    };
    
    return css`
      font-size: ${fontSizeMap[$size] || fontSizeMap.md};
    `;
  }}
`;

// Loading component với các variant khác nhau
export const Loading = forwardRef<HTMLDivElement, LoadingProps & { variant?: 'spinner' | 'dots' | 'bars' }>(
  (
    {
      size = 'md',
      color,
      thickness,
      speed,
      emptyColor,
      label,
      variant = 'spinner',
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    
    const renderSpinner = () => {
      switch (variant) {
        case 'dots':
          return (
            <DotsContainer $size={size} theme={theme}>
              {[0, 1, 2].map((index) => (
                <Dot
                  key={index}
                  className="dot"
                  $color={color}
                  $delay={index * 0.16}
                  theme={theme}
                />
              ))}
            </DotsContainer>
          );
        
        case 'bars':
          return (
            <BarsContainer $size={size} theme={theme}>
              {[0, 1, 2, 3, 4].map((index) => (
                <Bar
                  key={index}
                  className="bar"
                  $color={color}
                  $delay={index * 0.1}
                  theme={theme}
                />
              ))}
            </BarsContainer>
          );
        
        case 'spinner':
        default:
          return (
            <SpinnerCircle
              $size={size}
              $color={color}
              $thickness={thickness}
              $speed={speed}
              $emptyColor={emptyColor}
              theme={theme}
            />
          );
      }
    };
    
    return (
      <LoadingContainer
        ref={ref}
        className={cn('ui-loading', className)}
        $hasLabel={!!label}
        theme={theme}
        role="status"
        aria-label={label || 'Đang tải...'}
        {...props}
      >
        {renderSpinner()}
        
        {label && (
          <LoadingLabel $size={size} theme={theme}>
            {label}
          </LoadingLabel>
        )}
      </LoadingContainer>
    );
  }
);

Loading.displayName = 'Loading';

// Preset loading components
export const SpinnerLoading = forwardRef<HTMLDivElement, LoadingProps>(
  (props, ref) => <Loading ref={ref} variant="spinner" {...props} />
);

export const DotsLoading = forwardRef<HTMLDivElement, LoadingProps>(
  (props, ref) => <Loading ref={ref} variant="dots" {...props} />
);

export const BarsLoading = forwardRef<HTMLDivElement, LoadingProps>(
  (props, ref) => <Loading ref={ref} variant="bars" {...props} />
);

SpinnerLoading.displayName = 'SpinnerLoading';
DotsLoading.displayName = 'DotsLoading';
BarsLoading.displayName = 'BarsLoading';
