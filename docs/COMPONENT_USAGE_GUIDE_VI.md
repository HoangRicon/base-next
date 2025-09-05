# Hướng dẫn sử dụng Thư viện Component

**Ngày:** 05/09/2025  
**Phiên bản:** 1.0

---

## Giới thiệu

Tài liệu này hướng dẫn các lập trình viên cách sử dụng thư viện component dùng chung trong dự án. Việc tuân thủ các quy ước này sẽ giúp đảm bảo code nhất quán, dễ bảo trì và mở rộng.

### 1. Triết lý Cấu trúc Component

Thay vì đặt tất cả component vào một thư mục `ui` phẳng, chúng ta tổ chức chúng thành các thư mục chuyên biệt dựa trên chức năng. Cách tiếp cận này mang lại nhiều lợi ích:

-   **Dễ tìm kiếm (Discoverability):** Bạn có thể dễ dàng tìm thấy một component dựa trên vai trò của nó. Ví dụ, một component liên quan đến layout chắc chắn sẽ nằm trong `components/layout/`.
-   **Dễ bảo trì (Maintainability):** Các component có cùng chức năng được đặt gần nhau, giúp việc refactor hoặc cập nhật logic trở nên dễ dàng hơn.
-   **Khả năng mở rộng (Scalability):** Khi dự án phát triển, chúng ta có thể dễ dàng thêm các danh mục mới (ví dụ: `charts`, `media`) mà không làm lộn xộn cấu trúc hiện có.

### 2. Cách Import Component

Luôn luôn import component từ các file "barrel" (`index.ts`) ở cấp cao nhất của mỗi danh mục. Điều này giúp đường dẫn import luôn gọn gàng và nhất quán.

**Nên:**
```tsx
import { FormField, FormGroup } from '@/components/forms';
import { Navbar, Sidebar } from '@/components/navigation';
import { Button, Input } from '@/components/ui';
```

**Không nên:**
```tsx
import { FormField } from '@/components/forms/form-field';
import { Navbar } from '@/components/navigation/navbar';
```

### 3. Ví dụ sử dụng

#### 3.1. Xây dựng Form phức hợp

Component `FormField` được thiết kế để bao bọc các component `Input`, `Label` và hiển thị lỗi một cách nhất quán.

```tsx
import { FormField, FormGroup } from '@/components/forms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginForm() {
  return (
    <FormGroup>
      <FormField label="Email" required error="Email không hợp lệ.">
        <Input type="email" placeholder="Nhập email của bạn" />
      </FormField>
      <FormField label="Mật khẩu" required>
        <Input type="password" placeholder="Nhập mật khẩu" />
      </FormField>
      <Button type="submit">Đăng nhập</Button>
    </FormGroup>
  );
}
```

#### 3.2. Sử dụng Modal

Component `Modal` và `ConfirmModal` giúp đơn giản hóa việc hiển thị các hộp thoại.

```tsx
import { Modal, ConfirmModal } from '@/components/overlays';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function DeleteButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    console.log('Item deleted!');
    // Logic xóa item
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setShowConfirm(true)}>
        Xóa sản phẩm
      </Button>
      <ConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
```

### 4. Hệ thống Theme

#### 4.1. Cài đặt ThemeProvider

Để hệ thống theme hoạt động, bạn cần bọc toàn bộ ứng dụng trong `ThemeProvider` tại file `layout.tsx` hoặc `page.tsx` gốc.

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

#### 4.2. Thay đổi Theme

Sử dụng hook `useTheme` để truy cập và thay đổi theme hiện tại.

```tsx
import { useTheme } from '@/contexts/theme-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ThemeVariantSwitcher() {
  const { theme, setTheme, availableVariants } = useTheme();

  return (
    <Select value={theme.variant} onValueChange={(v) => setTheme({ variant: v as any })}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn theme" />
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

#### 4.3. Đặt ThemeSwitcher vào Navbar

Component `ThemeSwitcher` đã được tạo sẵn để dễ dàng tích hợp.

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

### 5. Custom Hooks cho Responsive

Hook `useMediaQuery` và các hook tiện ích khác giúp bạn dễ dàng xây dựng giao diện responsive.

```tsx
import { useBreakpoint } from '@/hooks/use-media-query';

function ResponsiveComponent() {
  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return <div>Đây là giao diện mobile</div>;
  }

  return <div>Đây là giao diện desktop</div>;
}
```
