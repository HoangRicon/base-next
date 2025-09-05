// MainContent Component - Main content area với breadcrumb và responsive layout
'use client';

import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { MainContentProps, BreadcrumbItem } from './types';
import { LAYOUT_CONSTANTS } from './types';
import { useTheme } from '../utils/ThemeProvider';
import { cn } from '../utils';

// Main content container
const MainContentContainer = styled.main<{
  $sidebarCollapsed: boolean;
  $sidePanelOpen: boolean;
}>`
  margin-top: ${LAYOUT_CONSTANTS.headerHeight};
  margin-left: ${({ $sidebarCollapsed }) => 
    $sidebarCollapsed ? LAYOUT_CONSTANTS.sidebarCollapsedWidth : LAYOUT_CONSTANTS.sidebarWidth
  };
  margin-right: ${({ $sidePanelOpen }) => 
    $sidePanelOpen ? LAYOUT_CONSTANTS.sidePanelWidth : '0'
  };
  min-height: calc(100vh - ${LAYOUT_CONSTANTS.headerHeight});
  padding: ${LAYOUT_CONSTANTS.contentPadding};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  transition: margin-left 0.3s ease, margin-right 0.3s ease;
  
  /* Mobile styles */
  @media (max-width: 768px) {
    margin-left: 0;
    margin-right: 0;
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  /* Tablet styles */
  @media (min-width: 769px) and (max-width: 1024px) {
    margin-left: ${({ $sidebarCollapsed }) => 
      $sidebarCollapsed ? LAYOUT_CONSTANTS.sidebarCollapsedWidth : '0'
    };
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

// Content wrapper
const ContentWrapper = styled.div`
  max-width: 100%;
  width: 100%;
`;

// Breadcrumb container
const BreadcrumbContainer = styled.nav`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

// Breadcrumb list
const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`;

// Breadcrumb item
const BreadcrumbItemElement = styled.li<{ $isLast: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.sm};
  
  &:not(:last-child)::after {
    content: '/';
    color: ${({ theme }) => theme.colors.text.disabled};
    margin-left: ${({ theme }) => theme.spacing.xs};
  }
`;

// Breadcrumb link
const BreadcrumbLink = styled.a<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary
  };
  text-decoration: none;
  font-weight: ${({ theme, $isActive }) => 
    $isActive ? theme.fontWeight.medium : theme.fontWeight.normal
  };
  cursor: ${({ $isActive }) => $isActive ? 'default' : 'pointer'};
  transition: color 0.2s ease;
  
  &:hover:not([aria-current="page"]) {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

// Breadcrumb icon
const BreadcrumbIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
`;

// Content area
const ContentArea = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  min-height: 400px;
  overflow: hidden;
`;

// Page header
const PageHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

// Page title
const PageTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
  
  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

// Page description
const PageDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

// Content body
const ContentBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// MainContent component
export const MainContent = forwardRef<HTMLElement, MainContentProps>(
  (
    {
      children,
      breadcrumbs,
      sidebarCollapsed,
      sidePanelOpen,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    // Render breadcrumb
    const renderBreadcrumb = () => {
      if (!breadcrumbs || breadcrumbs.length === 0) return null;

      return (
        <BreadcrumbContainer 
          aria-label="Breadcrumb navigation"
          theme={theme}
        >
          <BreadcrumbList theme={theme}>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <BreadcrumbItemElement 
                  key={index} 
                  $isLast={isLast}
                  theme={theme}
                >
                  {item.path && !isLast ? (
                    <BreadcrumbLink
                      href={item.path}
                      $isActive={false}
                      theme={theme}
                    >
                      {item.icon && (
                        <BreadcrumbIcon>
                          {item.icon}
                        </BreadcrumbIcon>
                      )}
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink
                      $isActive={true}
                      aria-current="page"
                      theme={theme}
                    >
                      {item.icon && (
                        <BreadcrumbIcon>
                          {item.icon}
                        </BreadcrumbIcon>
                      )}
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItemElement>
              );
            })}
          </BreadcrumbList>
        </BreadcrumbContainer>
      );
    };

    return (
      <MainContentContainer
        ref={ref}
        className={cn('dashboard-main-content', className)}
        $sidebarCollapsed={sidebarCollapsed}
        $sidePanelOpen={sidePanelOpen}
        theme={theme}
        {...props}
      >
        <ContentWrapper>
          {/* Breadcrumb */}
          {renderBreadcrumb()}

          {/* Content Area */}
          <ContentArea theme={theme}>
            {children}
          </ContentArea>
        </ContentWrapper>
      </MainContentContainer>
    );
  }
);

MainContent.displayName = 'MainContent';

// Sub-components for easier content structuring
export { PageHeader, PageTitle, PageDescription, ContentBody };
