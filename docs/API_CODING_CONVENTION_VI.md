# Quy ước Xây dựng API CRUD

**Ngày:** 05/09/2025  
**Phiên bản:** 1.0

---

## Giới thiệu

Tài liệu này định nghĩa các quy ước và cấu trúc chuẩn để phát triển các API endpoint (Route Handlers) trong dự án Next.js. Việc tuân thủ các quy ước này giúp đảm bảo API nhất quán, dễ hiểu và dễ bảo trì.

### 1. Cấu trúc Thư mục

Tất cả các API endpoint phải được đặt trong thư mục `src/app/api/`. Chúng ta tuân theo cấu trúc dựa trên phiên bản và tài nguyên (resource-based).

-   **Cấu trúc chung:** `src/app/api/v1/[resource]/{route.ts, [id]/route.ts}`
-   **`v1`**: Phiên bản của API. Mọi API mới đều bắt đầu với `v1`.
-   **`[resource]`**: Tên của tài nguyên ở dạng số nhiều (ví dụ: `products`, `users`, `orders`).

**Ví dụ cho tài nguyên `products`:**
```
src/app/api/v1/
└── products/
    ├── route.ts                # Xử lý GET (list), POST (create)
    └── [id]/
        └── route.ts            # Xử lý GET (detail), PUT (update), DELETE
```

### 2. Quy ước Route Handler

Mỗi file `route.ts` sẽ export các hàm tương ứng với các phương thức HTTP. Luôn sử dụng `NextRequest` và `NextResponse` để xử lý request và response.

**Ví dụ mẫu cho `src/app/api/v1/products/[id]/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/services/productService';
import { z } from 'zod';

// GET /api/v1/products/123
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: { message: 'Sản phẩm không tồn tại' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Lỗi server' } }, { status: 500 });
  }
}

// PUT /api/v1/products/123
const updateSchema = z.object({ name: z.string().min(3), price: z.number().positive() });

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: { message: 'Dữ liệu không hợp lệ', details: validation.error.format() } }, { status: 400 });
    }

    const updatedProduct = await updateProduct(params.id, validation.data);
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Lỗi server' } }, { status: 500 });
  }
}

// DELETE /api/v1/products/123
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true, data: { message: 'Xóa sản phẩm thành công' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Lỗi server' } }, { status: 500 });
  }
}
```

### 3. Cấu trúc Dữ liệu (Request/Response)

Để đảm bảo tính nhất quán, tất cả các response từ API phải tuân theo cấu trúc JSON sau:

**Khi thành công:**
```json
{
  "success": true,
  "data": { ... } // Hoặc [ ... ] hoặc một thông điệp
}
```

**Khi thất bại:**
```json
{
  "success": false,
  "error": {
    "message": "Một thông điệp lỗi ngắn gọn, dễ hiểu.",
    "details": { ... } // (Tùy chọn) Chi tiết lỗi validation hoặc các thông tin khác
  }
}
```

### 4. Tách biệt Logic

**Tuyệt đối không** viết business logic phức tạp trực tiếp trong Route Handlers. Route Handlers chỉ nên đóng vai trò là một lớp controller mỏng, chịu trách nhiệm:

1.  Nhận và phân tích request.
2.  Validate dữ liệu đầu vào.
3.  Gọi các service hoặc function xử lý nghiệp vụ.
4.  Định dạng và trả về response.

Toàn bộ business logic, tương tác với database, hoặc gọi các API bên ngoài nên được đặt trong các thư mục riêng biệt.

-   **`src/lib/services/`**: Chứa các file xử lý business logic (ví dụ: `productService.ts`, `userService.ts`).
-   **`src/lib/db/`**: Chứa các file tương tác trực tiếp với cơ sở dữ liệu (ví dụ: sử dụng Prisma, Drizzle, v.v.).

### 5. Validation

Sử dụng **Zod** làm thư viện mặc định để validate dữ liệu đầu vào (request body, params, query). Validation schema nên được định nghĩa ngay trong file `route.ts` hoặc import từ một file schema dùng chung nếu phức tạp.

**Lợi ích:**

-   Đảm bảo dữ liệu đầu vào luôn đúng định dạng trước khi xử lý.
-   Cung cấp thông điệp lỗi chi tiết cho client khi dữ liệu không hợp lệ.
-   Tăng cường bảo mật bằng cách ngăn chặn các dữ liệu không mong muốn.

**Ví dụ validation với Zod:**
```typescript
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
  price: z.number().positive('Giá sản phẩm phải là số dương'),
  stock: z.number().int().min(0, 'Số lượng tồn kho không được âm'),
});

// Trong hàm POST
const validation = createProductSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ 
    success: false, 
    error: { message: 'Dữ liệu không hợp lệ', details: validation.error.format() } 
  }, { status: 400 });
}
// Tiếp tục xử lý với validation.data
```
