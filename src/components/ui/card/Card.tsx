// Card Component - Component card với header, body, footer và các variant
'use client';

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { CardProps, Size } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { cn } from '../../utils';

// Card container
const CardContainer = styled.div<{
  $variant: 'outline' | 'filled' | 'elevated';
  $size: Size;
  $clickable?: boolean;
}>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.background};
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'outline':
        return css`
          border: 1px solid ${theme.colors.border};
        `;
      
      case 'filled':
        return css`
          background-color: ${theme.colors.gray[50]};
          border: 1px solid transparent;
        `;
      
      case 'elevated':
        return css`
          box-shadow: ${theme.shadows.md};
          border: 1px solid transparent;
        `;
      
      default:
        return css``;
    }
  }}
  
  ${({ $size, theme }) => {
    const paddingMap = {
      xs: theme.spacing.sm,
      sm: theme.spacing.md,
      md: theme.spacing.lg,
      lg: theme.spacing.xl,
      xl: theme.spacing['2xl'],
    };
    
    return css`
      padding: ${paddingMap[$size] || paddingMap.md};
    `;
  }}
  
  ${({ $clickable, theme }) => $clickable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

// Card header
const CardHeader = styled.div<{ $size: Size }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ $size, theme }) => {
    if ($size === 'xs' || $size === 'sm') {
      return css`
        margin-bottom: ${theme.spacing.sm};
      `;
    }
    return css``;
  }}
`;

// Card title
const CardTitle = styled.h3<{ $size: Size }>`
  margin: 0;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  
  ${({ $size, theme }) => {
    const fontSizeMap = {
      xs: theme.fontSize.sm,
      sm: theme.fontSize.base,
      md: theme.fontSize.lg,
      lg: theme.fontSize.xl,
      xl: theme.fontSize['2xl'],
    };
    
    return css`
      font-size: ${fontSizeMap[$size] || fontSizeMap.md};
    `;
  }}
`;

// Card subtitle
const CardSubtitle = styled.p<{ $size: Size }>`
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  
  ${({ $size, theme }) => {
    const fontSizeMap = {
      xs: theme.fontSize.xs,
      sm: theme.fontSize.sm,
      md: theme.fontSize.sm,
      lg: theme.fontSize.base,
      xl: theme.fontSize.lg,
    };
    
    return css`
      font-size: ${fontSizeMap[$size] || fontSizeMap.md};
    `;
  }}
`;

// Card body
const CardBody = styled.div<{ $size: Size }>`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  
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
  
  & > *:first-child {
    margin-top: 0;
  }
  
  & > *:last-child {
    margin-bottom: 0;
  }
`;

// Card footer
const CardFooter = styled.div<{ $size: Size }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  
  ${({ $size, theme }) => {
    if ($size === 'xs' || $size === 'sm') {
      return css`
        margin-top: ${theme.spacing.sm};
        padding-top: ${theme.spacing.sm};
      `;
    }
    return css``;
  }}
`;

// Card image
const CardImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

// Card divider
const CardDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

// Card component
export const Card = forwardRef<HTMLDivElement, CardProps & { onClick?: () => void }>(
  (
    {
      variant = 'outline',
      size = 'md',
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    
    return (
      <CardContainer
        ref={ref}
        className={cn('ui-card', className)}
        $variant={variant}
        $size={size}
        $clickable={!!onClick}
        theme={theme}
        onClick={onClick}
        {...props}
      >
        {children}
      </CardContainer>
    );
  }
);

Card.displayName = 'Card';

// Sub-components
export { CardHeader, CardTitle, CardSubtitle, CardBody, CardFooter, CardImage, CardDivider };
