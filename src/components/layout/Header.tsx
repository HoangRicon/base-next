// Header Component - Dashboard header với logo, user menu và sidebar toggle
'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { HeaderProps } from './types';
import { LAYOUT_CONSTANTS } from './types';
import { useTheme } from '../utils/ThemeProvider';
import { Button } from '../ui/button';
import { cn } from '../utils';

// Header container
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${LAYOUT_CONSTANTS.headerHeight};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: ${LAYOUT_CONSTANTS.zIndex.header};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

// Left section với sidebar toggle và logo
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// Sidebar toggle button
const SidebarToggle = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: auto;
  width: 40px;
  height: 40px;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

// Logo container
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  
  img {
    height: 32px;
    width: auto;
  }
  
  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSize.lg};
    
    img {
      height: 28px;
    }
  }
`;

// Right section với user menu
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// User menu container
const UserMenuContainer = styled.div`
  position: relative;
`;

// User menu trigger
const UserMenuTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

// User avatar
const UserAvatar = styled.div<{ $src?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  overflow: hidden;
  
  ${({ $src }) => $src && css`
    background-image: url(${$src});
    background-size: cover;
    background-position: center;
  `}
`;

// User info
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
`;

const UserRole = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.2;
`;

// Dropdown arrow
const DropdownArrow = styled.div<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  &::before {
    content: '▼';
    font-size: 10px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

// User menu dropdown
const UserMenuDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 200px;
  z-index: 1000;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

// Menu item
const MenuItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: none;
    background-color: ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  }
  
  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

// Divider
const MenuDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

// Header component
export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      user,
      onSidebarToggle,
      sidebarCollapsed,
      onUserMenuAction,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Đóng user menu khi click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
          setIsUserMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xử lý keyboard navigation cho user menu
    const handleUserMenuKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsUserMenuOpen(!isUserMenuOpen);
      }
    };

    // Xử lý menu item click
    const handleMenuItemClick = (action: 'profile' | 'settings' | 'logout') => {
      setIsUserMenuOpen(false);
      onUserMenuAction(action);
    };

    // Tạo initials từ tên user
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <HeaderContainer
        ref={ref}
        className={cn('dashboard-header', className)}
        theme={theme}
        {...props}
      >
        {/* Left Section */}
        <LeftSection theme={theme}>
          {/* Sidebar Toggle (Mobile only) */}
          <SidebarToggle
            variant="ghost"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
            theme={theme}
          >
            ☰
          </SidebarToggle>

          {/* Logo */}
          <LogoContainer theme={theme}>
            <img src="/logo.svg" alt="Company Logo" />
            <span>Dashboard</span>
          </LogoContainer>
        </LeftSection>

        {/* Right Section */}
        <RightSection theme={theme}>
          {/* User Menu */}
          <UserMenuContainer ref={userMenuRef}>
            <UserMenuTrigger
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              onKeyDown={handleUserMenuKeyDown}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              theme={theme}
            >
              <UserAvatar $src={user.avatar} theme={theme}>
                {!user.avatar && getInitials(user.name)}
              </UserAvatar>
              
              <UserInfo theme={theme}>
                <UserName theme={theme}>{user.name}</UserName>
                {user.role && (
                  <UserRole theme={theme}>{user.role}</UserRole>
                )}
              </UserInfo>
              
              <DropdownArrow $isOpen={isUserMenuOpen} theme={theme} />
            </UserMenuTrigger>

            {/* User Menu Dropdown */}
            <UserMenuDropdown $isOpen={isUserMenuOpen} theme={theme}>
              <MenuItem
                onClick={() => handleMenuItemClick('profile')}
                theme={theme}
              >
               [object Object]sơ
              </MenuItem>
              
              <MenuItem
                onClick={() => handleMenuItemClick('settings')}
                theme={theme}
              >
                ⚙️ Cài đặt
              </MenuItem>
              
              <MenuDivider theme={theme} />
              
              <MenuItem
                onClick={() => handleMenuItemClick('logout')}
                theme={theme}
              >
                🚪 Đăng xuất
              </MenuItem>
            </UserMenuDropdown>
          </UserMenuContainer>
        </RightSection>
      </HeaderContainer>
    );
  }
);

Header.displayName = 'Header';
