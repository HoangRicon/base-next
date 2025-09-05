// Toast Component - Component thông báo toast với các loại và vị trí khác nhau
'use client';

import React, { forwardRef, useEffect, useState, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { ToastProps, ToastStatus, ToastPosition } from '../../types';
import { useTheme } from '../../utils/ThemeProvider';
import { cn, generateId } from '../../utils';

// Keyframes cho animation
const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInTop = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideInBottom = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Toast container
const ToastContainer = styled.div<{
  $status: ToastStatus;
  $position: ToastPosition;
  $isClosing: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-left: 4px solid;
  min-width: 300px;
  max-width: 500px;
  position: relative;
  
  ${({ $status, theme }) => {
    const statusColors = {
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.info,
    };
    
    return css`
      border-left-color: ${statusColors[$status]};
    `;
  }}
  
  ${({ $position }) => {
    if ($position.includes('right')) {
      return css`
        animation: ${slideInRight} 0.3s ease-out;
      `;
    } else if ($position.includes('left')) {
      return css`
        animation: ${slideInLeft} 0.3s ease-out;
      `;
    } else if ($position.includes('top')) {
      return css`
        animation: ${slideInTop} 0.3s ease-out;
      `;
    } else {
      return css`
        animation: ${slideInBottom} 0.3s ease-out;
      `;
    }
  }}
  
  ${({ $isClosing }) => $isClosing && css`
    animation: ${fadeOut} 0.2s ease-out forwards;
  `}
`;

// Toast icon
const ToastIcon = styled.div<{ $status: ToastStatus }>`
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  
  ${({ $status, theme }) => {
    const statusConfig = {
      success: { color: theme.colors.success, icon: '✓' },
      error: { color: theme.colors.error, icon: '✕' },
      warning: { color: theme.colors.warning, icon: '⚠' },
      info: { color: theme.colors.info, icon: 'ℹ' },
    };
    
    const config = statusConfig[$status];
    
    return css`
      color: ${config.color};
      
      &::before {
        content: '${config.icon}';
      }
    `;
  }}
`;

// Toast content
const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// Toast title
const ToastTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// Toast description
const ToastDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

// Close button
const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.25rem;
  padding: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &::before {
    content: '×';
  }
`;

// Progress bar
const ProgressBar = styled.div<{ $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  animation: progress ${({ $duration }) => $duration}ms linear forwards;
  
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

// Toast wrapper container
const ToastWrapper = styled.div<{ $position: ToastPosition }>`
  position: fixed;
  z-index: 1050;
  pointer-events: none;
  
  ${({ $position }) => {
    const positions = {
      'top': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
      'top-left': { top: '1rem', left: '1rem' },
      'top-right': { top: '1rem', right: '1rem' },
      'bottom': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
      'bottom-left': { bottom: '1rem', left: '1rem' },
      'bottom-right': { bottom: '1rem', right: '1rem' },
    };
    
    return css`
      ${Object.entries(positions[$position] || positions.bottom).map(([key, value]) => 
        `${key}: ${value};`
      ).join('')}
    `;
  }}
  
  & > * {
    pointer-events: auto;
  }
`;

// Toast component
export const Toast = forwardRef<HTMLDivElement, ToastProps & { onAnimationEnd?: () => void }>(
  (
    {
      id,
      title,
      description,
      status = 'info',
      duration = 5000,
      isClosable = true,
      position = 'bottom-right',
      onClose,
      onAnimationEnd,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isClosing, setIsClosing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    // Auto close toast
    useEffect(() => {
      if (duration > 0 && !isPaused) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [duration, isPaused]);
    
    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose?.();
        onAnimationEnd?.();
      }, 200);
    };
    
    return (
      <ToastContainer
        ref={ref}
        $status={status}
        $position={position}
        $isClosing={isClosing}
        theme={theme}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <ToastIcon $status={status} theme={theme} />
        
        <ToastContent>
          {title && (
            <ToastTitle theme={theme}>
              {title}
            </ToastTitle>
          )}
          
          {description && (
            <ToastDescription theme={theme}>
              {description}
            </ToastDescription>
          )}
        </ToastContent>
        
        {isClosable && (
          <CloseButton onClick={handleClose} theme={theme} />
        )}
        
        {duration > 0 && !isPaused && (
          <ProgressBar $duration={duration} theme={theme} />
        )}
      </ToastContainer>
    );
  }
);

Toast.displayName = 'Toast';

// Toast context
interface ToastContextType {
  toasts: (ToastProps & { id: string })[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);
  
  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = generateId('toast');
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const removeAllToasts = () => {
    setToasts([]);
  };
  
  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  };
  
  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, (ToastProps & { id: string })[]>);
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Render toasts */}
      {typeof document !== 'undefined' && Object.entries(toastsByPosition).map(([position, positionToasts]) =>
        createPortal(
          <ToastWrapper key={position} $position={position as ToastPosition}>
            {positionToasts.map(toast => (
              <Toast
                key={toast.id}
                {...toast}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </ToastWrapper>,
          document.body
        )
      )}
    </ToastContext.Provider>
  );
};

// Hook để sử dụng toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được sử dụng bên trong ToastProvider');
  }
  
  return {
    toast: context.addToast,
    success: (toast: Omit<ToastProps, 'id' | 'status'>) => 
      context.addToast({ ...toast, status: 'success' }),
    error: (toast: Omit<ToastProps, 'id' | 'status'>) => 
      context.addToast({ ...toast, status: 'error' }),
    warning: (toast: Omit<ToastProps, 'id' | 'status'>) => 
      context.addToast({ ...toast, status: 'warning' }),
    info: (toast: Omit<ToastProps, 'id' | 'status'>) => 
      context.addToast({ ...toast, status: 'info' }),
    remove: context.removeToast,
    removeAll: context.removeAllToasts,
  };
};
