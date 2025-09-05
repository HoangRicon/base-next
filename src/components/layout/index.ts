// Layout components exports - Export tất cả các thành phần layout

// Main layout component
export { DashboardLayout } from './DashboardLayout';

// Individual components
export { Header } from './Header';
export { Sidebar } from './Sidebar';
export { MainContent, PageHeader, PageTitle, PageDescription, ContentBody } from './MainContent';
export { SidePanel, PanelHeader, PanelTitle, PanelBody, PanelFooter } from './SidePanel';

// Context and hooks
export { LayoutProvider, useLayout, useLayoutActions, useResponsive } from './LayoutContext';

// Types
export type * from './types';
