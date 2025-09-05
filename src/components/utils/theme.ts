// Theme configuration - Cấu hình theme cho hệ thống
import { Theme } from '../types';

// Light theme - Theme sáng
export const lightTheme: Theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#ffffff',
    surface: '#ffffff',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    border: '#e5e7eb',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Dark theme - Theme tối
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      disabled: '#64748b',
    },
    border: '#334155',
  },
};

// Theme context type - Kiểu dữ liệu cho theme context
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

// Utility functions để làm việc với theme
export const getColorValue = (theme: Theme, colorPath: string): string => {
  const paths = colorPath.split('.');
  let value: any = theme.colors;
  
  for (const path of paths) {
    if (value && typeof value === 'object' && path in value) {
      value = value[path];
    } else {
      return colorPath; // Trả về giá trị gốc nếu không tìm thấy
    }
  }
  
  return typeof value === 'string' ? value : colorPath;
};

// Hàm tạo responsive styles
export const createResponsiveStyles = (theme: Theme) => ({
  mobile: `@media (max-width: ${theme.breakpoints.sm})`,
  tablet: `@media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.lg})`,
  desktop: `@media (min-width: ${theme.breakpoints.lg})`,
});

// Hàm tạo focus styles
export const createFocusStyles = (theme: Theme, color = 'primary') => `
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px ${getColorValue(theme, `${color}.200`)};
`;

// Hàm tạo disabled styles
export const createDisabledStyles = (theme: Theme) => `
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
`;

// Hàm tính toán contrast color
export const getContrastColor = (theme: Theme, backgroundColor: string): string => {
  // Đơn giản hóa: trả về màu text phù hợp dựa trên background
  const lightColors = [
    theme.colors.primary[50],
    theme.colors.primary[100],
    theme.colors.primary[200],
    theme.colors.secondary[50],
    theme.colors.secondary[100],
    theme.colors.gray[50],
    theme.colors.gray[100],
    theme.colors.background,
  ];
  
  return lightColors.includes(backgroundColor) 
    ? theme.colors.text.primary 
    : theme.colors.background;
};

// Animation utilities
export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(10px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  slideDown: `
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
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
};

// Size utilities - Tiện ích cho kích thước
export const getSizeStyles = (size: string, theme: Theme) => {
  const sizeMap = {
    xs: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: theme.fontSize.xs,
      height: '1.5rem',
    },
    sm: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.fontSize.sm,
      height: '2rem',
    },
    md: {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: theme.fontSize.base,
      height: '2.5rem',
    },
    lg: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.fontSize.lg,
      height: '3rem',
    },
    xl: {
      padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
      fontSize: theme.fontSize.xl,
      height: '3.5rem',
    },
  };
  
  return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
};

// Transition utilities
export const transitions = {
  default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};
