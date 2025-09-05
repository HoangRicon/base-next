// Theme Provider - Component cung cấp theme cho toàn bộ ứng dụng
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeContextType } from '../types';
import { lightTheme, darkTheme } from './theme';

// Tạo context cho theme
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props cho ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

// Hook để sử dụng theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
  }
  return context;
};

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme',
}) => {
  const [isDark, setIsDark] = useState<boolean>(defaultTheme === 'dark');

  // Khôi phục theme từ localStorage khi component mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.warn('Không thể đọc theme từ localStorage:', error);
    }
  }, [storageKey]);

  // Lưu theme vào localStorage khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
    } catch (error) {
      console.warn('Không thể lưu theme vào localStorage:', error);
    }
  }, [isDark, storageKey]);

  // Cập nhật class cho document.documentElement để hỗ trợ CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Hàm toggle theme
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Chọn theme hiện tại
  const currentTheme: Theme = isDark ? darkTheme : lightTheme;

  // Context value
  const contextValue: ThemeContextType = {
    theme: currentTheme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Global styles component để inject CSS variables
export const GlobalThemeStyles: React.FC = () => {
  const { theme, isDark } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    
    // Inject CSS variables vào :root
    const cssVariables = {
      // Colors
      '--color-primary-50': theme.colors.primary[50],
      '--color-primary-100': theme.colors.primary[100],
      '--color-primary-200': theme.colors.primary[200],
      '--color-primary-300': theme.colors.primary[300],
      '--color-primary-400': theme.colors.primary[400],
      '--color-primary-500': theme.colors.primary[500],
      '--color-primary-600': theme.colors.primary[600],
      '--color-primary-700': theme.colors.primary[700],
      '--color-primary-800': theme.colors.primary[800],
      '--color-primary-900': theme.colors.primary[900],
      
      '--color-secondary-50': theme.colors.secondary[50],
      '--color-secondary-100': theme.colors.secondary[100],
      '--color-secondary-200': theme.colors.secondary[200],
      '--color-secondary-300': theme.colors.secondary[300],
      '--color-secondary-400': theme.colors.secondary[400],
      '--color-secondary-500': theme.colors.secondary[500],
      '--color-secondary-600': theme.colors.secondary[600],
      '--color-secondary-700': theme.colors.secondary[700],
      '--color-secondary-800': theme.colors.secondary[800],
      '--color-secondary-900': theme.colors.secondary[900],
      
      '--color-gray-50': theme.colors.gray[50],
      '--color-gray-100': theme.colors.gray[100],
      '--color-gray-200': theme.colors.gray[200],
      '--color-gray-300': theme.colors.gray[300],
      '--color-gray-400': theme.colors.gray[400],
      '--color-gray-500': theme.colors.gray[500],
      '--color-gray-600': theme.colors.gray[600],
      '--color-gray-700': theme.colors.gray[700],
      '--color-gray-800': theme.colors.gray[800],
      '--color-gray-900': theme.colors.gray[900],
      
      '--color-success': theme.colors.success,
      '--color-warning': theme.colors.warning,
      '--color-error': theme.colors.error,
      '--color-info': theme.colors.info,
      '--color-background': theme.colors.background,
      '--color-surface': theme.colors.surface,
      '--color-text-primary': theme.colors.text.primary,
      '--color-text-secondary': theme.colors.text.secondary,
      '--color-text-disabled': theme.colors.text.disabled,
      '--color-border': theme.colors.border,
      
      // Spacing
      '--spacing-xs': theme.spacing.xs,
      '--spacing-sm': theme.spacing.sm,
      '--spacing-md': theme.spacing.md,
      '--spacing-lg': theme.spacing.lg,
      '--spacing-xl': theme.spacing.xl,
      '--spacing-2xl': theme.spacing['2xl'],
      
      // Border radius
      '--border-radius-none': theme.borderRadius.none,
      '--border-radius-sm': theme.borderRadius.sm,
      '--border-radius-md': theme.borderRadius.md,
      '--border-radius-lg': theme.borderRadius.lg,
      '--border-radius-xl': theme.borderRadius.xl,
      '--border-radius-full': theme.borderRadius.full,
      
      // Font sizes
      '--font-size-xs': theme.fontSize.xs,
      '--font-size-sm': theme.fontSize.sm,
      '--font-size-base': theme.fontSize.base,
      '--font-size-lg': theme.fontSize.lg,
      '--font-size-xl': theme.fontSize.xl,
      '--font-size-2xl': theme.fontSize['2xl'],
      '--font-size-3xl': theme.fontSize['3xl'],
      
      // Font weights
      '--font-weight-normal': theme.fontWeight.normal.toString(),
      '--font-weight-medium': theme.fontWeight.medium.toString(),
      '--font-weight-semibold': theme.fontWeight.semibold.toString(),
      '--font-weight-bold': theme.fontWeight.bold.toString(),
      
      // Shadows
      '--shadow-sm': theme.shadows.sm,
      '--shadow-md': theme.shadows.md,
      '--shadow-lg': theme.shadows.lg,
      '--shadow-xl': theme.shadows.xl,
    };

    // Áp dụng CSS variables
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme, isDark]);

  return null;
};

// Hook để lấy theme hiện tại (chỉ theme object)
export const useCurrentTheme = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

// Hook để kiểm tra dark mode
export const useIsDark = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};
