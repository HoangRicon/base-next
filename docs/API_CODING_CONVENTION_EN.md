# API CRUD Coding Convention

**Date:** 2025-09-05  
**Version:** 1.0

---

## Introduction

This document defines the standard conventions and structure for developing API endpoints (Route Handlers) in this Next.js project. Adhering to these conventions ensures a consistent, understandable, and maintainable API.

### 1. Directory Structure

All API endpoints must be located within the `src/app/api/` directory. We follow a versioned, resource-based structure.

-   **General Structure:** `src/app/api/v1/[resource]/{route.ts, [id]/route.ts}`
-   **`v1`**: The version of the API. All new APIs should start with `v1`.
-   **`[resource]`**: The name of the resource in plural form (e.g., `products`, `users`, `orders`).

**Example for a `products` resource:**
```
src/app/api/v1/
└── products/
    ├── route.ts                # Handles GET (list), POST (create)
    └── [id]/
        └── route.ts            # Handles GET (detail), PUT (update), DELETE
```

### 2. Route Handler Conventions

Each `route.ts` file should export functions corresponding to HTTP methods. Always use `NextRequest` and `NextResponse` to handle requests and responses.

**Example template for `src/app/api/v1/products/[id]/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/services/productService';
import { z } from 'zod';

// GET /api/v1/products/123
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: { message: 'Product not found' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 });
  }
}

// PUT /api/v1/products/123
const updateSchema = z.object({ name: z.string().min(3), price: z.number().positive() });

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: { message: 'Invalid input data', details: validation.error.format() } }, { status: 400 });
    }

    const updatedProduct = await updateProduct(params.id, validation.data);
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 });
  }
}

// DELETE /api/v1/products/123
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true, data: { message: 'Product deleted successfully' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 });
  }
}
```

### 3. Data Structure (Request/Response)

To ensure consistency, all API responses must follow this JSON structure:

**On Success:**
```json
{
  "success": true,
  "data": { ... } // Or [ ... ] or a message
}
```

**On Failure:**
```json
{
  "success": false,
  "error": {
    "message": "A short, user-friendly error message.",
    "details": { ... } // (Optional) Validation error details or other info
  }
}
```

### 4. Separation of Logic

**Do not** write complex business logic directly in Route Handlers. Route Handlers should act as a thin controller layer, responsible for:

1.  Receiving and parsing the request.
2.  Validating input data.
3.  Calling services or functions that handle the business logic.
4.  Formatting and returning the response.

All business logic, database interactions, or third-party API calls should be placed in separate directories.

-   **`src/lib/services/`**: Contains files for business logic (e.g., `productService.ts`, `userService.ts`).
-   **`src/lib/db/`**: Contains files that interact directly with the database (e.g., using Prisma, Drizzle, etc.).

### 5. Validation

Use **Zod** as the default library for validating all incoming data (request body, params, query). Validation schemas should be defined within the `route.ts` file or imported from a shared schema file if they are complex.

**Benefits:**

-   Ensures input data is correctly formatted before processing.
-   Provides detailed error messages to the client for invalid data.
-   Enhances security by preventing unexpected data structures.

**Example validation with Zod:**
```typescript
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long'),
  price: z.number().positive('Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});

// Inside a POST handler
const validation = createProductSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ 
    success: false, 
    error: { message: 'Invalid input data', details: validation.error.format() } 
  }, { status: 400 });
}
// Continue processing with validation.data
```
