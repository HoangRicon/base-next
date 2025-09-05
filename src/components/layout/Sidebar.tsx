// Sidebar Component - Navigation sidebar với menu items, submenu và responsive overlay
'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { SidebarProps, MenuItem } from './types';
import { LAYOUT_CONSTANTS } from './types';
import { useTheme } from '../utils/ThemeProvider';
import { cn } from '../utils';

// Sidebar container
const SidebarContainer = styled.aside<{
  $collapsed: boolean;
  $isMobile: boolean;
  $isOverlayOpen: boolean;
}>`
  position: fixed;
  top: ${LAYOUT_CONSTANTS.headerHeight};
  left: 0;
  bottom: 0;
  width: ${({ $collapsed }) => 
    $collapsed ? LAYOUT_CONSTANTS.sidebarCollapsedWidth : LAYOUT_CONSTANTS.sidebarWidth
  };
  background-color: ${({ theme }) => theme.colors.background};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  z-index: ${LAYOUT_CONSTANTS.zIndex.sidebar};
  transition: width 0.3s ease, transform 0.3s ease;
  overflow: hidden;
  
  /* Mobile styles */
  @media (max-width: 768px) {
    width: ${LAYOUT_CONSTANTS.sidebarWidth};
    transform: ${({ $isOverlayOpen }) => 
      $isOverlayOpen ? 'translateX(0)' : 'translateX(-100%)'
    };
    z-index: ${LAYOUT_CONSTANTS.zIndex.sidebarOverlay};
  }
`;

// Sidebar overlay (mobile only)
const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${LAYOUT_CONSTANTS.zIndex.sidebarOverlay - 1};
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

// Sidebar content
const SidebarContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Navigation menu
const NavigationMenu = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} 0;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[400]};
  }
`;

// Menu item container
const MenuItemContainer = styled.div<{ $collapsed: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// Menu item button
const MenuItemButton = styled.button<{
  $active: boolean;
  $collapsed: boolean;
  $hasChildren: boolean;
  $level: number;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme, $level }) => 
    `${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} ${
      $level === 0 ? theme.spacing.md : `calc(${theme.spacing.md} + ${$level * 20}px)`
    }`
  };
  border: none;
  background: none;
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary[600] : theme.colors.text.primary
  };
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme, $active }) => 
    $active ? theme.fontWeight.semibold : theme.fontWeight.normal
  };
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  ${({ $active, theme }) => $active && css`
    background-color: ${theme.colors.primary[50]};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: ${theme.colors.primary[500]};
    }
  `}
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) => 
      $active ? theme.colors.primary[100] : theme.colors.gray[100]
    };
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: -2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ $collapsed }) => $collapsed && css`
    justify-content: center;
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  `}
`;

// Menu icon
const MenuIcon = styled.span<{ $collapsed: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

// Menu label
const MenuLabel = styled.span<{ $collapsed: boolean }>`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

// Expand arrow
const ExpandArrow = styled.span<{ $expanded: boolean; $collapsed: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transform: ${({ $expanded }) => $expanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  
  &::before {
    content: '▶';
  }
`;

// Badge
const MenuBadge = styled.span<{ $collapsed: boolean }>`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

// Submenu container
const SubmenuContainer = styled.div<{ $expanded: boolean; $collapsed: boolean }>`
  overflow: hidden;
  max-height: ${({ $expanded }) => $expanded ? '500px' : '0'};
  transition: max-height 0.3s ease;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
`;

// Sidebar component
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      menuItems,
      currentPath,
      collapsed,
      onMenuItemClick,
      onToggle,
      isMobile = false,
      isOverlayOpen = false,
      onOverlayClose,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    // Auto expand parent menu khi có submenu active
    useEffect(() => {
      const findParentPath = (items: MenuItem[], targetPath: string, parentId?: string): string | null => {
        for (const item of items) {
          if (item.path === targetPath) {
            return parentId || null;
          }
          if (item.children) {
            const found = findParentPath(item.children, targetPath, item.id);
            if (found) return found;
          }
        }
        return null;
      };

      const parentId = findParentPath(menuItems, currentPath);
      if (parentId) {
        setExpandedItems(prev => new Set([...prev, parentId]));
      }
    }, [currentPath, menuItems]);

    // Toggle submenu expansion
    const toggleExpanded = (itemId: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    };

    // Check if menu item is active
    const isActive = (item: MenuItem): boolean => {
      if (item.path === currentPath) return true;
      if (item.children) {
        return item.children.some(child => isActive(child));
      }
      return false;
    };

    // Handle menu item click
    const handleItemClick = (item: MenuItem) => {
      if (item.disabled) return;

      if (item.children && item.children.length > 0) {
        // Toggle submenu
        toggleExpanded(item.id);
      } else {
        // Navigate to item
        onMenuItemClick(item);
        
        // Close overlay on mobile
        if (isMobile && onOverlayClose) {
          onOverlayClose();
        }
      }
    };

    // Render menu item
    const renderMenuItem = (item: MenuItem, level = 0): React.ReactNode => {
      const active = isActive(item);
      const expanded = expandedItems.has(item.id);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <MenuItemContainer key={item.id} $collapsed={collapsed} theme={theme}>
          <MenuItemButton
            $active={active}
            $collapsed={collapsed}
            $hasChildren={!!hasChildren}
            $level={level}
            disabled={item.disabled}
            onClick={() => handleItemClick(item)}
            theme={theme}
            title={collapsed ? item.label : undefined}
          >
            {/* Icon */}
            {item.icon && (
              <MenuIcon $collapsed={collapsed}>
                {item.icon}
              </MenuIcon>
            )}

            {/* Label */}
            <MenuLabel $collapsed={collapsed}>
              {item.label}
            </MenuLabel>

            {/* Badge */}
            {item.badge && (
              <MenuBadge $collapsed={collapsed} theme={theme}>
                {item.badge}
              </MenuBadge>
            )}

            {/* Expand arrow */}
            {hasChildren && (
              <ExpandArrow 
                $expanded={expanded} 
                $collapsed={collapsed}
              />
            )}
          </MenuItemButton>

          {/* Submenu */}
          {hasChildren && (
            <SubmenuContainer 
              $expanded={expanded} 
              $collapsed={collapsed}
            >
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </SubmenuContainer>
          )}
        </MenuItemContainer>
      );
    };

    return (
      <>
        {/* Overlay (Mobile only) */}
        <SidebarOverlay 
          $isOpen={isOverlayOpen} 
          onClick={onOverlayClose}
        />

        {/* Sidebar */}
        <SidebarContainer
          ref={ref}
          className={cn('dashboard-sidebar', className)}
          $collapsed={collapsed}
          $isMobile={isMobile}
          $isOverlayOpen={isOverlayOpen}
          theme={theme}
          {...props}
        >
          <SidebarContent>
            <NavigationMenu theme={theme}>
              {menuItems.map(item => renderMenuItem(item))}
            </NavigationMenu>
          </SidebarContent>
        </SidebarContainer>
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';
