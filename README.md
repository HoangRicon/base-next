# Next.js UI Component Library

A comprehensive, production-ready UI component library built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui. Features a complete theming system with multiple variants, full accessibility support, and responsive design.

##[object Object]Features

- [object Object]Complete Theming System**: 8 theme variants with light/dark mode support
- **♿ Accessibility First**: WCAG compliant with proper ARIA attributes and keyboard navigation
- **📱 Responsive Design**: Mobile-first approach with comprehensive breakpoint support
-[object Object]peScript**: Fully typed with comprehensive type definitions
- **🚀 Production Ready**: Optimized for performance and maintainability
- **🧩 Modular Architecture**: Well-organized component structure for easy maintenance

## 🎨 Theme Variants

- **Default**: Classic slate-based theme
- **Blue**: Professional blue color scheme
- **Green**: Nature-inspired green palette
- **Purple**: Creative purple theme
- **Orange**: Energetic orange variant
- **Red**: Bold red color scheme
- **Rose**: Elegant rose theme
- **Slate**: Neutral slate theme

## 📦 Component Categories

### Layout Components
- `Container` - Responsive container with size variants
- `Grid` - Flexible grid system with responsive breakpoints
- `Stack` - Vertical/horizontal stacking with spacing control
- `Flex` - Flexible layout component with alignment options

### Form Components
- `FormField` - Complete form field with label, description, and error handling
- `FormGroup` - Grouped form fields with consistent spacing
- `FormSection` - Sectioned forms with titles and descriptions
- All shadcn/ui form components (Input, Textarea, Select, etc.)

### Navigation Components
- `Navbar` - Responsive navigation bar with variants
- `Sidebar` - Collapsible sidebar with multiple positions
- `Breadcrumb` - Navigation breadcrumbs
- `NavigationMenu` - Dropdown navigation menus
- `Tabs` - Tabbed navigation interface

### Feedback Components
- `LoadingSpinner` - Multiple loading animation variants
- `Alert` - Contextual alerts with different severity levels
- `Progress` - Progress indicators with animations
- `Toast` - Toast notifications via Sonner

### Data Display Components
- `DataTable` - Feature-rich data tables with sorting and selection
- `EmptyState` - Empty state placeholders with actions
- `Badge` - Status and category badges
- `Avatar` - User avatars with fallbacks

### Overlay Components
- `Modal` - Flexible modal dialogs with size variants
- `ConfirmModal` - Pre-built confirmation dialogs
- `Drawer` - Side panel drawers
- `Dialog` - Base dialog component
- `Sheet` - Sliding panels

### Accessibility Components
- `VisuallyHidden` - Screen reader only content
- Focus management utilities
- ARIA attribute helpers

## 🛠️ Installation & Setup

1. **Clone and Install**:
```bash
git clone <repository-url>
cd base-next
npm install
```

2. **Run Development Server**:
```bash
npm run dev
```

3. **Build for Production**:
```bash
npm run build
npm start
```

## 🎯 Usage Examples

### Basic Component Usage
```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Theme Provider Setup
```tsx
import { ThemeProvider } from '@/contexts/theme-context'

export function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system', variant: 'default' }}>
      <YourApp />
    </ThemeProvider>
  )
}
```

### Theme Switcher
```tsx
import { ThemeSwitcher } from '@/components'

export function Header() {
  return (
    <header>
      <ThemeSwitcher />
    </header>
  )
}
```

### Form with Validation
```tsx
import { FormField, FormGroup, Input, Button } from '@/components'

export function ContactForm() {
  return (
    <FormGroup>
      <FormField label="Name" required>
        <Input placeholder="Enter your name" />
      </FormField>
      <FormField label="Email" required>
        <Input type="email" placeholder="Enter your email" />
      </FormField>
      <Button type="submit">Submit</Button>
    </FormGroup>
  )
}
```

## 🎨 Theming

### Using Theme Hook
```tsx
import { useTheme } from '@/contexts/theme-context'

export function ThemedComponent() {
  const { theme, setTheme, resolvedMode } = useTheme()

  return (
    <div>
      <p>Current theme: {theme.variant}</p>
      <p>Current mode: {resolvedMode}</p>
      <button onClick={() => setTheme({ variant: 'blue' })}>
        Switch to Blue Theme
      </button>
    </div>
  )
}
```

### Custom Theme Colors
```tsx
import { useThemeColors } from '@/contexts/theme-context'

export function CustomComponent() {
  const colors = useThemeColors()

  return (
    <div style={{ backgroundColor: colors.primary }}>
      Themed content
    </div>
  )
}
```

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive components
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus order and focus trapping in modals
- **High Contrast Support**: Respects user's contrast preferences
- **Reduced Motion**: Honors prefers-reduced-motion settings
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoint System**: Consistent breakpoints across all components
- **Flexible Layouts**: Components adapt to different screen sizes
- **Touch Friendly**: Optimized for touch interactions

## 🔧 TypeScript Support

- **Comprehensive Types**: Full TypeScript coverage for all components
- **Theme Types**: Strongly typed theme system
- **Component Props**: Detailed prop types with IntelliSense support
- **Utility Types**: Helper types for common patterns

## [object Object]ject Structure

```
src/
├── components/           # Component library
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   ├── forms/           # Form components
│   ├── navigation/      # Navigation components
│   ├── feedback/        # Feedback components
│   ├── data-display/    # Data display components
│   ├── overlays/        # Modal and overlay components
│   ├── accessibility/   # Accessibility utilities
│   └── demo/           # Demo showcase
├── contexts/            # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── app/                # Next.js app directory
```

## ⚡ Performance

- **Tree Shaking**: Only import what you use
- **Code Splitting**: Automatic code splitting with Next.js
- **Optimized Animations**: Respects user preferences for reduced motion
- **Minimal Bundle Size**: Efficient component architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Base component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
