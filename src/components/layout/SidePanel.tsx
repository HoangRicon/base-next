// SidePanel Component - Slide drawer từ phải sang trái với form và overlay backdrop
'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { SidePanelProps } from './types';
import { LAYOUT_CONSTANTS } from './types';
import { useTheme } from '../utils/ThemeProvider';
import { Button } from '../ui/button';
import { cn } from '../utils';

// Keyframes cho animations
const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutToRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Backdrop overlay
const PanelBackdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${LAYOUT_CONSTANTS.zIndex.sidePanelBackdrop};
  animation: ${({ $isOpen }) => $isOpen ? fadeIn : fadeOut} 0.3s ease-out forwards;
`;

// Side panel container
const SidePanelContainer = styled.aside<{
  $isOpen: boolean;
  $width: string;
}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${({ $width }) => $width};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: ${LAYOUT_CONSTANTS.zIndex.sidePanel};
  display: flex;
  flex-direction: column;
  animation: ${({ $isOpen }) => $isOpen ? slideInFromRight : slideOutToRight} 0.3s ease-out forwards;
  
  /* Mobile styles */
  @media (max-width: 768px) {
    width: 100%;
    left: 0;
  }
  
  /* Tablet styles */
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 50%;
    min-width: 400px;
  }
`;

// Panel header
const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
`;

// Panel title
const PanelTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
`;

// Close button
const CloseButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: auto;
  width: 32px;
  height: 32px;
  
  &::before {
    content: '×';
    font-size: 20px;
    line-height: 1;
  }
`;

// Panel body
const PanelBody = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[400]};
  }
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// Panel footer
const PanelFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
    flex-direction: column-reverse;
    
    & > * {
      width: 100%;
    }
  }
`;

// SidePanel component
export const SidePanel = forwardRef<HTMLElement, SidePanelProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      width = LAYOUT_CONSTANTS.sidePanelWidth,
      showBackdrop = true,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const panelRef = useRef<HTMLElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Focus management
    useEffect(() => {
      if (isOpen) {
        // Store currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;
        
        // Focus the panel
        setTimeout(() => {
          panelRef.current?.focus();
        }, 100);
        
        // Trap focus within panel
        const handleTabKey = (event: KeyboardEvent) => {
          if (event.key !== 'Tab') return;
          
          const panel = panelRef.current;
          if (!panel) return;
          
          const focusableElements = panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement?.focus();
            }
          }
        };
        
        document.addEventListener('keydown', handleTabKey);
        
        return () => {
          document.removeEventListener('keydown', handleTabKey);
        };
      } else {
        // Return focus to previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
      if (!closeOnEsc) return;
      
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }, [isOpen, closeOnEsc, onClose]);

    // Prevent body scroll when panel is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = (event: React.MouseEvent) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (typeof document === 'undefined' || !isOpen) {
      return null;
    }

    return createPortal(
      <>
        {/* Backdrop */}
        {showBackdrop && (
          <PanelBackdrop 
            $isOpen={isOpen}
            onClick={handleBackdropClick}
          />
        )}

        {/* Side Panel */}
        <SidePanelContainer
          ref={ref || panelRef}
          className={cn('dashboard-side-panel', className)}
          $isOpen={isOpen}
          $width={width}
          theme={theme}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'side-panel-title' : undefined}
          {...props}
        >
          {/* Header */}
          <PanelHeader theme={theme}>
            {title && (
              <PanelTitle id="side-panel-title" theme={theme}>
                {title}
              </PanelTitle>
            )}
            
            <CloseButton
              variant="ghost"
              onClick={onClose}
              aria-label="Đóng panel"
              theme={theme}
            >
              ×
            </CloseButton>
          </PanelHeader>

          {/* Body */}
          <PanelBody theme={theme}>
            {children}
          </PanelBody>
        </SidePanelContainer>
      </>,
      document.body
    );
  }
);

SidePanel.displayName = 'SidePanel';

// Sub-components
export { PanelHeader, PanelTitle, PanelBody, PanelFooter };
