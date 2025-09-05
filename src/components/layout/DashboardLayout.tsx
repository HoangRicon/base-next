// DashboardLayout Component - Main dashboard layout tích hợp tất cả components
'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { DashboardLayoutProps, MenuItem } from './types';
import { useTheme } from '../utils/ThemeProvider';
import { LayoutProvider, useLayout } from './LayoutContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { SidePanel } from './SidePanel';
import { cn } from '../utils';

// Layout container
const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

// Dashboard layout inner component (inside LayoutProvider)
const DashboardLayoutInner = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      user,
      menuItems,
      currentPath,
      breadcrumbs,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const {
      sidebarCollapsed,
      setSidebarCollapsed,
      sidePanelOpen,
      setSidePanelOpen,
      sidePanelContent,
      sidePanelTitle,
      setCurrentPath,
      isMobile,
      sidebarOverlayOpen,
      setSidebarOverlayOpen,
    } = useLayout();

    // Update current path when prop changes
    useEffect(() => {
      setCurrentPath(currentPath);
    }, [currentPath, setCurrentPath]);

    // Handle sidebar toggle
    const handleSidebarToggle = () => {
      if (isMobile) {
        setSidebarOverlayOpen(!sidebarOverlayOpen);
      } else {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };

    // Handle menu item click
    const handleMenuItemClick = (item: MenuItem) => {
      setCurrentPath(item.path);
      
      // Close sidebar overlay on mobile after navigation
      if (isMobile && sidebarOverlayOpen) {
        setSidebarOverlayOpen(false);
      }
      
      // You can add navigation logic here
      // For example: router.push(item.path)
    };

    // Handle user menu actions
    const handleUserMenuAction = (action: 'profile' | 'settings' | 'logout') => {
      switch (action) {
        case 'profile':
          // Navigate to profile page or open profile panel
          console.log('Navigate to profile');
          break;
        case 'settings':
          // Navigate to settings page or open settings panel
          console.log('Navigate to settings');
          break;
        case 'logout':
          // Handle logout
          console.log('Logout user');
          break;
      }
    };

    // Handle side panel close
    const handleSidePanelClose = () => {
      setSidePanelOpen(false);
    };

    // Handle sidebar overlay close (mobile)
    const handleSidebarOverlayClose = () => {
      setSidebarOverlayOpen(false);
    };

    return (
      <LayoutContainer
        ref={ref}
        className={cn('dashboard-layout', className)}
        theme={theme}
        {...props}
      >
        {/* Header */}
        <Header
          user={user}
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
          onUserMenuAction={handleUserMenuAction}
        />

        {/* Sidebar */}
        <Sidebar
          menuItems={menuItems}
          currentPath={currentPath}
          collapsed={sidebarCollapsed}
          onMenuItemClick={handleMenuItemClick}
          onToggle={handleSidebarToggle}
          isMobile={isMobile}
          isOverlayOpen={sidebarOverlayOpen}
          onOverlayClose={handleSidebarOverlayClose}
        />

        {/* Main Content */}
        <MainContent
          breadcrumbs={breadcrumbs}
          sidebarCollapsed={sidebarCollapsed}
          sidePanelOpen={sidePanelOpen}
        >
          {children}
        </MainContent>

        {/* Side Panel */}
        {sidePanelOpen && (
          <SidePanel
            isOpen={sidePanelOpen}
            onClose={handleSidePanelClose}
            title={sidePanelTitle}
          >
            {sidePanelContent}
          </SidePanel>
        )}
      </LayoutContainer>
    );
  }
);

DashboardLayoutInner.displayName = 'DashboardLayoutInner';

// Main dashboard layout component with provider
export const DashboardLayout = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (props, ref) => {
    return (
      <LayoutProvider>
        <DashboardLayoutInner ref={ref} {...props} />
      </LayoutProvider>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';
