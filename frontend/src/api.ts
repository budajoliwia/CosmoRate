import type {
  LoginRequest,
  LoginResponse,
  ProductDetails,
  ProductListItem,
  ReviewItem,
  CreateReviewDto,
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

export async function apiCreateReview(dto: CreateReviewDto): Promise<void> {
  await request("/reviews", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}