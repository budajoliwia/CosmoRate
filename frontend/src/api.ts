import type {
  LoginRequest,
  LoginResponse,
  ProductDetails,
  ProductListItem,
  ReviewItem,
  CreateReviewDto,
  ReportsSummary,
  Category,
  CreateProductDto,
  RegisterRequest
} from "./type";

const BASE_URL = "https://localhost:7080/api"; // backend

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    // No Content
    return {} as T;
  }

  return res.json();
}

// ===== AUTH =====
export async function apiLogin(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function apiRegister(data: RegisterRequest): Promise<void> {
  await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ===== PRODUCTS =====
export async function apiGetProducts(): Promise<ProductListItem[]> {
  return request<ProductListItem[]>("/products");
}

export async function apiGetProduct(id: number): Promise<ProductDetails> {
  return request<ProductDetails>(`/products/${id}`);
}

// ===== REVIEWS =====
export async function apiGetReviewsForProduct(
  productId: number
): Promise<ReviewItem[]> {
  return request<ReviewItem[]>(`/reviews/product/${productId}`);
}

export async function apiGetReportsSummary(): Promise<ReportsSummary> {
  return request<ReportsSummary>("/reports/summary");
}

export async function apiCreateReview(dto: CreateReviewDto): Promise<void> {
  await request("/reviews", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// ===== CATEGORIES (ADMIN) =====
export async function apiGetCategories(): Promise<Category[]> {
    return request<Category[]>("/categories");
}
// ===== PRODUCTS (ADMIN) =====
export async function apiCreateProduct(dto: CreateProductDto):Promise<void> {
    await request("/products",{
        method:"POST",
        body:JSON.stringify(dto),
    });
}

export async function apiUpdateProduct(
    id:number,
    dto:CreateProductDto): Promise<void>{
        await request(`/products/${id}`,{
            method:"PUT",
            body:JSON.stringify(dto),
        });
    }

    export async function apiDeleteProduct(id:number):Promise<void>{
        await request(`/products/${id}`,{
            method:"DELETE",
        });

    }
// ===== CATEGORIES (ADMIN) =====
export async function apiCreateCategory(name: string): Promise<void> {
  await request("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function apiUpdateCategory(
  id: number,
  name: string
): Promise<void> {
  // backend wymaga obiektu z Name (Id może być, ale nie musi)
  await request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, name }),
  });
}

export async function apiDeleteCategory(id: number): Promise<void> {
  await request(`/categories/${id}`, {
    method: "DELETE",
  });
}