// Định nghĩa các types chung cho toàn bộ thư viện component UI

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Theme types - Định nghĩa các kiểu theme
export interface Theme {
  colors: {
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    secondary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Component size variants - Các kích thước component
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Component variants - Các biến thể component
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

// Button types - Định nghĩa types cho Button component
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// Input types - Định nghĩa types cho Input component
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  variant?: 'outline' | 'filled' | 'flushed';
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

// Select/Combobox types - Định nghĩa types cho Select component
export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: Option[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  size?: Size;
  onChange?: (value: string | number | (string | number)[]) => void;
  onInputChange?: (inputValue: string) => void;
  label?: string;
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
}

// Checkbox types - Định nghĩa types cho Checkbox component
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  isIndeterminate?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  children?: ReactNode;
  colorScheme?: 'primary' | 'secondary';
}

// Radio types - Định nghĩa types cho Radio component
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  isInvalid?: boolean;
  isDisabled?: boolean;
  children?: ReactNode;
  colorScheme?: 'primary' | 'secondary';
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  isDisabled?: boolean;
  size?: Size;
  colorScheme?: 'primary' | 'secondary';
}

// Modal types - Định nghĩa types cho Modal component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isCentered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  preserveScrollBarGap?: boolean;
  returnFocusOnClose?: boolean;
  blockScrollOnMount?: boolean;
}

// Loading types - Định nghĩa types cho Loading component
export interface LoadingProps {
  size?: Size;
  color?: string;
  thickness?: string;
  speed?: string;
  emptyColor?: string;
  label?: string;
}

// Toast types - Định nghĩa types cho Toast component
export type ToastStatus = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  status?: ToastStatus;
  duration?: number;
  isClosable?: boolean;
  position?: ToastPosition;
  onClose?: () => void;
}

// Card types - Định nghĩa types cho Card component
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'outline' | 'filled' | 'elevated';
  size?: Size;
  children: ReactNode;
}

// Table types - Định nghĩa types cho Table component
export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  scroll?: {
    x?: string | number;
    y?: string | number;
  };
}

// Common component props - Props chung cho tất cả components
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}
