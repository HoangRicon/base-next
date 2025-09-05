// Layout Context - Context và Provider cho dashboard layout state management
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { 
  LayoutContextType, 
  NavigationState, 
  NavigationAction, 
  BREAKPOINTS 
} from './types';

// Initial state
const initialState: NavigationState = {
  sidebarCollapsed: false,
  sidePanelOpen: false,
  sidePanelContent: null,
  sidePanelTitle: '',
  currentPath: '/',
  isMobile: false,
  sidebarOverlayOpen: false,
};

// Reducer function
const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
        sidebarOverlayOpen: false, // Đóng overlay khi toggle
      };
    
    case 'OPEN_SIDE_PANEL':
      return {
        ...state,
        sidePanelOpen: true,
        sidePanelTitle: action.payload.title,
        sidePanelContent: action.payload.content,
      };
    
    case 'CLOSE_SIDE_PANEL':
      return {
        ...state,
        sidePanelOpen: false,
        sidePanelTitle: '',
        sidePanelContent: null,
      };
    
    case 'SET_CURRENT_PATH':
      return {
        ...state,
        currentPath: action.payload,
      };
    
    case 'SET_MOBILE':
      return {
        ...state,
        isMobile: action.payload,
        // Tự động collapse sidebar trên mobile
        sidebarCollapsed: action.payload ? true : state.sidebarCollapsed,
        sidebarOverlayOpen: false,
      };
    
    case 'TOGGLE_SIDEBAR_OVERLAY':
      return {
        ...state,
        sidebarOverlayOpen: !state.sidebarOverlayOpen,
      };
    
    default:
      return state;
  }
};

// Create context
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Layout Provider component
export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < BREAKPOINTS.mobile;
      dispatch({ type: 'SET_MOBILE', payload: isMobile });
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key for closing panels
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (state.sidePanelOpen) {
          dispatch({ type: 'CLOSE_SIDE_PANEL' });
        } else if (state.sidebarOverlayOpen) {
          dispatch({ type: 'TOGGLE_SIDEBAR_OVERLAY' });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.sidePanelOpen, state.sidebarOverlayOpen]);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    if (collapsed !== state.sidebarCollapsed) {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    }
  }, [state.sidebarCollapsed]);

  const setSidePanelOpen = useCallback((open: boolean) => {
    if (!open && state.sidePanelOpen) {
      dispatch({ type: 'CLOSE_SIDE_PANEL' });
    }
    // Opening is handled by useLayoutActions to ensure content is provided
  }, [state.sidePanelOpen]);

  const setSidePanelContent = useCallback((content: ReactNode) => {
    dispatch({ type: 'OPEN_SIDE_PANEL', payload: { title: state.sidePanelTitle, content } });
  }, [state.sidePanelTitle]);

  const setSidePanelTitle = useCallback((title: string) => {
    dispatch({ type: 'OPEN_SIDE_PANEL', payload: { title, content: state.sidePanelContent } });
  }, [state.sidePanelContent]);

  const setCurrentPath = useCallback((path: string) => {
    if (path !== state.currentPath) {
      dispatch({ type: 'SET_CURRENT_PATH', payload: path });
    }
  }, [state.currentPath]);

  const setSidebarOverlayOpen = useCallback((open: boolean) => {
    if (open !== state.sidebarOverlayOpen) {
      dispatch({ type: 'TOGGLE_SIDEBAR_OVERLAY' });
    }
  }, [state.sidebarOverlayOpen]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sidebarCollapsed: state.sidebarCollapsed,
    setSidebarCollapsed,
    sidePanelOpen: state.sidePanelOpen,
    setSidePanelOpen,
    sidePanelContent: state.sidePanelContent,
    setSidePanelContent,
    sidePanelTitle: state.sidePanelTitle,
    setSidePanelTitle,
    currentPath: state.currentPath,
    setCurrentPath,
    isMobile: state.isMobile,
    sidebarOverlayOpen: state.sidebarOverlayOpen,
    setSidebarOverlayOpen,
  }), [state, setSidebarCollapsed, setSidePanelOpen, setSidePanelContent, setSidePanelTitle, setCurrentPath, setSidebarOverlayOpen]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

// Hook để sử dụng layout context
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout phải được sử dụng bên trong LayoutProvider');
  }
  return context;
};

// Custom hooks cho các actions thường dùng
export const useLayoutActions = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutActions phải được sử dụng bên trong LayoutProvider');
  }

  const {
    setSidebarCollapsed,
    sidebarCollapsed,
    setSidePanelOpen,
    setSidePanelContent,
    setSidePanelTitle,
    setCurrentPath,
    setSidebarOverlayOpen,
    sidebarOverlayOpen
  } = context;

  return {
    // Toggle sidebar
    toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),

    // Open side panel với content
    openSidePanel: (title: string, content: ReactNode) => {
      setSidePanelTitle(title);
      setSidePanelContent(content);
      setSidePanelOpen(true);
    },

    // Close side panel
    closeSidePanel: () => setSidePanelOpen(false),

    // Navigate to path
    navigateTo: (path: string) => {
      setCurrentPath(path);
    },

    // Toggle sidebar overlay (mobile)
    toggleSidebarOverlay: () => setSidebarOverlayOpen(!sidebarOverlayOpen),
  };
};

// Hook để lấy responsive state
export const useResponsive = () => {
  const { isMobile } = useLayout();

  // Safe window check
  const getWindowWidth = () => {
    if (typeof window === 'undefined') return BREAKPOINTS.desktop;
    return window.innerWidth;
  };

  const windowWidth = getWindowWidth();

  return {
    isMobile,
    isTablet: !isMobile && windowWidth < BREAKPOINTS.tablet,
    isDesktop: windowWidth >= BREAKPOINTS.desktop,
    windowWidth,
    // Utility functions
    isSmallMobile: windowWidth < 480,
    isLargeMobile: windowWidth >= 480 && windowWidth < BREAKPOINTS.mobile,
    isSmallTablet: windowWidth >= BREAKPOINTS.mobile && windowWidth < 900,
    isLargeTablet: windowWidth >= 900 && windowWidth < BREAKPOINTS.tablet,
  };
};
