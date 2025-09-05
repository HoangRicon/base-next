// Dashboard Layout Types - Định nghĩa các types cho dashboard layout

import { ReactNode } from 'react';

// Menu item type - Định nghĩa cấu trúc menu item
export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path: string;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
}

// User info type - Thông tin người dùng
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Breadcrumb item type - Định nghĩa breadcrumb
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: ReactNode;
}

// Dashboard layout props
export interface DashboardLayoutProps {
  children: ReactNode;
  user: UserInfo;
  menuItems: MenuItem[];
  currentPath: string;
  breadcrumbs?: BreadcrumbItem[];
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  sidePanelOpen?: boolean;
  onSidePanelClose?: () => void;
  sidePanelContent?: ReactNode;
  sidePanelTitle?: string;
  className?: string;
}

// Header props
export interface HeaderProps {
  user: UserInfo;
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
  onUserMenuAction: (action: 'profile' | 'settings' | 'logout') => void;
  className?: string;
}

// Sidebar props
export interface SidebarProps {
  menuItems: MenuItem[];
  currentPath: string;
  collapsed: boolean;
  onMenuItemClick: (item: MenuItem) => void;
  onToggle: () => void;
  isMobile?: boolean;
  isOverlayOpen?: boolean;
  onOverlayClose?: () => void;
  className?: string;
}

// Main content props
export interface MainContentProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  sidebarCollapsed: boolean;
  sidePanelOpen: boolean;
  className?: string;
}

// Side panel props
export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

// Layout context type - Context cho dashboard layout
export interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidePanelOpen: boolean;
  setSidePanelOpen: (open: boolean) => void;
  sidePanelContent: ReactNode;
  setSidePanelContent: (content: ReactNode) => void;
  sidePanelTitle: string;
  setSidePanelTitle: (title: string) => void;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  isMobile: boolean;
  sidebarOverlayOpen: boolean;
  setSidebarOverlayOpen: (open: boolean) => void;
}

// Navigation action types
export type NavigationAction = 
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_SIDE_PANEL'; payload: { title: string; content: ReactNode } }
  | { type: 'CLOSE_SIDE_PANEL' }
  | { type: 'SET_CURRENT_PATH'; payload: string }
  | { type: 'SET_MOBILE'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR_OVERLAY' };

// Navigation state type
export interface NavigationState {
  sidebarCollapsed: boolean;
  sidePanelOpen: boolean;
  sidePanelContent: ReactNode;
  sidePanelTitle: string;
  currentPath: string;
  isMobile: boolean;
  sidebarOverlayOpen: boolean;
}

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// Layout constants
export const LAYOUT_CONSTANTS = {
  headerHeight: '64px',
  sidebarWidth: '280px',
  sidebarCollapsedWidth: '64px',
  sidePanelWidth: '400px',
  contentPadding: '24px',
  zIndex: {
    header: 1000,
    sidebar: 999,
    sidebarOverlay: 998,
    sidePanel: 1001,
    sidePanelBackdrop: 1000,
  },
} as const;
