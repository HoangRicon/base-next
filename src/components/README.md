# Thư viện Component UI

Thư viện component UI tái sử dụng được xây dựng với TypeScript, styled-components và hỗ trợ đầy đủ accessibilit[object Object]ính năng

- ✅ **TypeScript** - Type safety đầy đủ
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Theme** - Hỗ trợ chuyển đổi theme
- ✅ **Accessibility** - ARIA labels, keyboard navigation
- ✅ **Styled Components** - CSS-in-JS với theme system
- ✅ **Storybook Ready** - Documentation và testing
- ✅ **Unit Tests** - Jest và React Testing Library

## 📦 Cài đặt

```bash
npm install styled-components framer-motion react-hook-form react-select react-portal
npm install -D @types/styled-components
```

## 🎨 Sử dụng cơ bản

### 1. Setup ThemeProvider

```tsx
import { ThemeProvider, GlobalThemeStyles } from './components';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <GlobalThemeStyles />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Sử dụng Components

```tsx
import { 
  Button, 
  Input, 
  Combobox, 
  Checkbox, 
  Radio, 
  RadioGroup,
  Modal,
  Loading,
  Toast,
  Card,
  Table 
} from './components';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="md">
        Click me
      </Button>
      
      <Input 
        label="Email"
        type="email"
        placeholder="Nhập email của bạn"
        isRequired
      />
    </div>
  );
}
```

## 🧩 Components

### Button

```tsx
<Button 
  variant="primary" // primary | secondary | outline | ghost | link
  size="md" // xs | sm | md | lg | xl
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  fullWidth={false}
>
  Button Text
</Button>
```

### Input

```tsx
<Input
  type="text" // text | password | email | number
  variant="outline" // outline | filled | flushed
  size="md" // xs | sm | md | lg | xl
  label="Label"
  placeholder="Placeholder"
  helperText="Helper text"
  errorText="Error message"
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  isRequired={false}
  isDisabled={false}
  isInvalid={false}
/>
```

### Combobox/Select

```tsx
const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3', disabled: true },
];

<Combobox
  options={options}
  placeholder="Chọn một tùy chọn..."
  isSearchable={true}
  isMulti={false}
  size="md"
  onChange={(value) => console.log(value)}
/>
```

### Checkbox & Radio

```tsx
// Checkbox
<Checkbox 
  size="md"
  colorScheme="primary"
  isIndeterminate={false}
  isDisabled={false}
>
  Checkbox Label
</Checkbox>

// Radio Group
<RadioGroup 
  name="radio-group" 
  value={value} 
  onChange={setValue}
>
  <Radio value="1">Option 1</Radio>
  <Radio value="2">Option 2</Radio>
  <Radio value="3">Option 3</Radio>
</RadioGroup>
```

### Modal

```tsx
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  size="md" // xs | sm | md | lg | xl | full
  isCentered={true}
>
  <ModalHeader>
    <h2>Modal Title</h2>
    <CloseButton onClick={onClose} />
  </ModalHeader>
  
  <ModalBody>
    Modal content goes here
  </ModalBody>
  
  <ModalFooter>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="primary">Save</Button>
  </ModalFooter>
</Modal>
```

### Loading

```tsx
// Spinner (default)
<Loading size="md" label="Đang tải..." />

// Dots
<DotsLoading size="md" color="#3b82f6" />

// Bars
<BarsLoading size="lg" />
```

### Toast

```tsx
import { ToastProvider, useToast } from './components';

// Wrap your app
<ToastProvider>
  <App />
</ToastProvider>

// Use in component
function MyComponent() {
  const { success, error, warning, info } = useToast();
  
  const showToast = () => {
    success({
      title: 'Thành công!',
      description: 'Dữ liệu đã được lưu.',
      duration: 5000,
    });
  };
}
```

### Card

```tsx
<Card variant="elevated" size="md">
  <CardHeader>
    <CardTitle size="md">Card Title</CardTitle>
    <CardSubtitle size="md">Card Subtitle</CardSubtitle>
  </CardHeader>
  
  <CardBody size="md">
    Card content goes here
  </CardBody>
  
  <CardFooter size="md">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Table

```tsx
const columns = [
  {
    key: 'name',
    title: 'Tên',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'age',
    title: 'Tuổi',
    dataIndex: 'age',
    sortable: true,
    align: 'center',
  },
  {
    key: 'actions',
    title: 'Hành động',
    render: (_, record) => (
      <Button size="sm" onClick={() => handleEdit(record)}>
        Sửa
      </Button>
    ),
  },
];

<Table
  columns={columns}
  data={data}
  loading={loading}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    onChange: (page, pageSize) => console.log(page, pageSize),
  }}
  onRow={(record) => ({
    onClick: () => console.log('Row clicked', record),
  })}
/>
```

## 🎨 Theme System

### Sử dụng Theme Hook

```tsx
import { useTheme, useIsDark } from './components';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  const isDark = useIsDark();
  
  return (
    <div style={{ color: theme.colors.text.primary }}>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### Custom Theme

```tsx
import { lightTheme, darkTheme } from './components';

const customTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: {
      ...lightTheme.colors.primary,
      500: '#your-custom-color',
    },
  },
};
```

## 🧪 Testing

Tất cả components đều có unit tests. Chạy tests:

```bash
npm test
```

## 📚 Storybook

Xem documentation và test components:

```bash
npm run storybook
```

## 🔧 Customization

### CSS Variables

Thư viện tự động inject CSS variables:

```css
:root {
  --color-primary-500: #3b82f6;
  --spacing-md: 1rem;
  --border-radius-md: 0.375rem;
  /* ... */
}
```

### Styled Components

Tất cả components sử dụng styled-components và có thể được customize:

```tsx
import styled from 'styled-components';
import { Button } from './components';

const CustomButton = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
`;
```

##[object Object]Accessibility

- Tất cả components hỗ trợ keyboard navigation
- ARIA labels và roles được implement đầy đủ
- Focus management cho Modal và các interactive elements
- Screen reader friendly

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes với message rõ ràng
4. Tạo Pull Request

## 📄 License

MIT License
