// Utility functions - Các hàm tiện ích cho thư viện component UI

import React, { ReactNode } from 'react';

// Hàm kết hợp className
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Hàm tạo ID duy nhất
export const generateId = (prefix = 'ui'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Hàm debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Hàm throttle
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Hàm kiểm tra xem element có phải là ReactNode không
export const isValidReactNode = (node: any): node is ReactNode => {
  return (
    node !== null &&
    node !== undefined &&
    (typeof node === 'string' ||
      typeof node === 'number' ||
      typeof node === 'boolean' ||
      React.isValidElement(node) ||
      Array.isArray(node))
  );
};

// Hàm format số
export const formatNumber = (num: number, locale = 'vi-VN'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

// Hàm format tiền tệ
export const formatCurrency = (
  amount: number,
  currency = 'VND',
  locale = 'vi-VN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Hàm kiểm tra device type
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Hàm kiểm tra touch device
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Hàm copy text vào clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback cho các trình duyệt cũ
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Lỗi khi copy vào clipboard:', error);
    return false;
  }
};

// Hàm kiểm tra email hợp lệ
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hàm kiểm tra số điện thoại Việt Nam
export const isValidVietnamesePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Hàm escape HTML
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Hàm tính toán vị trí tooltip/popover
export const calculatePosition = (
  triggerElement: HTMLElement,
  popoverElement: HTMLElement,
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  offset = 8
): { top: number; left: number } => {
  const triggerRect = triggerElement.getBoundingClientRect();
  const popoverRect = popoverElement.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = triggerRect.top - popoverRect.height - offset;
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
      left = triggerRect.left - popoverRect.width - offset;
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
      left = triggerRect.right + offset;
      break;
  }

  // Điều chỉnh để không bị tràn viewport
  if (left < 0) left = 8;
  if (left + popoverRect.width > viewport.width) {
    left = viewport.width - popoverRect.width - 8;
  }
  if (top < 0) top = 8;
  if (top + popoverRect.height > viewport.height) {
    top = viewport.height - popoverRect.height - 8;
  }

  return { top, left };
};

// Hàm tạo animation delay
export const createStaggeredAnimation = (
  index: number,
  baseDelay = 0,
  increment = 100
): string => {
  return `${baseDelay + index * increment}ms`;
};

// Hàm kiểm tra dark color
export const isDarkColor = (color: string): boolean => {
  // Chuyển đổi hex sang RGB
  let r: number, g: number, b: number;
  
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      r = parseInt(matches[0]);
      g = parseInt(matches[1]);
      b = parseInt(matches[2]);
    } else {
      return false;
    }
  } else {
    return false;
  }

  // Tính độ sáng theo công thức YIQ
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

// Hàm format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Hàm tạo slug từ string
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/[đĐ]/g, 'd') // Thay thế đ
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay thế space bằng -
    .replace(/-+/g, '-'); // Loại bỏ - trùng lặp
};
