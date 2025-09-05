# Component Library Usage Guide

**Date:** 2025-09-05  
**Version:** 1.0

---

## Introduction

This document guides developers on how to effectively use the shared component library in the project. Adhering to these conventions will help ensure consistent, maintainable, and scalable code.

### 1. Component Structure Philosophy

Instead of placing all components into a flat `ui` folder, we organize them into specialized, feature-based directories. This approach offers several advantages:

-   **Discoverability:** You can easily find a component based on its role. For example, a layout-related component will always be in `components/layout/`.
-   **Maintainability:** Components with similar functionality are co-located, making it easier to refactor or update logic.
-   **Scalability:** As the project grows, we can easily add new categories (e.g., `charts`, `media`) without cluttering the existing structure.

### 2. How to Import Components

Always import components from the "barrel" files (`index.ts`) at the top level of each category. This keeps import paths clean and consistent.

**Do:**
```tsx
import { FormField, FormGroup } from '@/components/forms';
import { Navbar, Sidebar } from '@/components/navigation';
import { Button, Input } from '@/components/ui';
```

**Don't:**
```tsx
import { FormField } from '@/components/forms/form-field';
import { Navbar } from '@/components/navigation/navbar';
```

### 3. Usage Examples

#### 3.1. Building a Complex Form

The `FormField` component is designed to wrap `Input` and `Label` components, handling error display consistently.

```tsx
import { FormField, FormGroup } from '@/components/forms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginForm() {
  return (
    <FormGroup>
      <FormField label="Email" required error="Invalid email address.">
        <Input type="email" placeholder="Enter your email" />
      </FormField>
      <FormField label="Password" required>
        <Input type="password" placeholder="Enter your password" />
      </FormField>
      <Button type="submit">Login</Button>
    </FormGroup>
  );
}
```

#### 3.2. Using Modals

The `Modal` and `ConfirmModal` components simplify the implementation of dialogs.

```tsx
import { Modal, ConfirmModal } from '@/components/overlays';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function DeleteButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    console.log('Item deleted!');
    // Item deletion logic
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setShowConfirm(true)}>
        Delete Product
      </Button>
      <ConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Deletion"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
```

### 4. Theming System

#### 4.1. Setting up the ThemeProvider

To enable the theming system, you must wrap your entire application in the `ThemeProvider`, typically in the root `layout.tsx` or `page.tsx` file.

```tsx
// src/app/page.tsx
'use client'

import { ThemeProvider } from '@/contexts/theme-context';
import { ComponentShowcase } from '@/components/demo/component-showcase';

export default function HomePage() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system', variant: 'default' }}>
      <ComponentShowcase />
    </ThemeProvider>
  );
}
```

#### 4.2. Changing the Theme

Use the `useTheme` hook to access and modify the current theme.

```tsx
import { useTheme } from '@/contexts/theme-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ThemeVariantSwitcher() {
  const { theme, setTheme, availableVariants } = useTheme();

  return (
    <Select value={theme.variant} onValueChange={(v) => setTheme({ variant: v as any })}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        {availableVariants.map(variant => (
          <SelectItem key={variant} value={variant}>{variant}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

#### 4.3. Placing the ThemeSwitcher in the Navbar

The `ThemeSwitcher` component is pre-built for easy integration.

```tsx
import { Navbar, NavbarContent, NavbarBrand } from '@/components/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';

function AppHeader() {
  return (
    <Navbar>
      <NavbarBrand>
        <span>My App</span>
      </NavbarBrand>
      <NavbarContent>
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
}
```

### 5. Custom Hooks for Responsiveness

The `useMediaQuery` hook and other utility hooks help you easily build responsive interfaces.

```tsx
import { useBreakpoint } from '@/hooks/use-media-query';

function ResponsiveComponent() {
  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return <div>This is the mobile view</div>;
  }

  return <div>This is the desktop view</div>;
}
```
