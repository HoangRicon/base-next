// Modal Component - Component modal với backdrop, focus management và keyboard navigation
'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { ModalProps } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { cn, generateId } from '../../utils';

// Keyframes cho animation
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideIn = keyframes`
  from { transform: translate(-50%, -40%); opacity: 0; }
  to { transform: translate(-50%, -50%); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translate(-50%, -50%); opacity: 1; }
  to { transform: translate(-50%, -40%); opacity: 0; }
`;

// Backdrop overlay
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: ${({ $isOpen }) => $isOpen ? fadeIn : fadeOut} 0.3s ease-out forwards;
`;

// Modal container
const ModalContainer = styled.div<{
  $isOpen: boolean;
  $size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  $isCentered: boolean;
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  animation: ${({ $isOpen }) => $isOpen ? slideIn : slideOut} 0.3s ease-out forwards;
  
  ${({ $size, theme }) => {
    const sizeMap = {
      xs: '300px',
      sm: '400px',
      md: '500px',
      lg: '600px',
      xl: '800px',
      full: '100%',
    };
    
    return css`
      width: ${sizeMap[$size] || sizeMap.md};
      max-width: 90vw;
      max-height: 90vh;
    `;
  }}
  
  ${({ $isCentered }) => $isCentered && css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}
`;

// Modal header
const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Modal body
const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

// Modal footer
const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Close button
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Modal component
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      children,
      size = 'md',
      isCentered = true,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      preserveScrollBarGap = false,
      returnFocusOnClose = true,
      blockScrollOnMount = true,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    
    // Xử lý focus management
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        modalRef.current?.focus();
      } else if (returnFocusOnClose && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }, [isOpen, returnFocusOnClose]);
    
    // Xử lý block scroll
    useEffect(() => {
      if (blockScrollOnMount && isOpen) {
        document.body.style.overflow = 'hidden';
        if (!preserveScrollBarGap) {
          document.body.style.paddingRight = '15px'; // Scrollbar width
        }
      } else {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }
      
      return () => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      };
    }, [isOpen, blockScrollOnMount, preserveScrollBarGap]);
    
    // Xử lý keyboard events
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEsc) {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEsc, onClose]);
    
    if (typeof document === 'undefined' || !isOpen) {
      return null;
    }
    
    return createPortal(
      <>
        <ModalOverlay 
          $isOpen={isOpen} 
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <ModalContainer
          ref={ref || modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          $isOpen={isOpen}
          $size={size}
          $isCentered={isCentered}
          theme={theme}
          {...props}
        >
          {children}
        </ModalContainer>
      </>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

// Sub-components
export const ModalContent = styled.div`
  width: 100%;
`;

export { ModalHeader, ModalBody, ModalFooter, CloseButton };
