
export type ProductListItem={
    id: number;
    name: string;
    brand: string;
    category: string | null;
};

export type ProductDetails = {
  id: number;
  name: string;
  brand: string;
  categoryId: number | null;
  category: string | null;
};

export type ReviewItem = {
  id: number;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  userId: number;
};

export type CreateReviewDto={
  productId: number;
  rating: number;
  title: string;
  body: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type DecodedToken = {
  sub?: string;
  nameid?: string;
  role?: string | string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  [key: string]: any;
};

export type AuthUser = {
  userId: number | null;
  role: string | null;
  token: string | null;
};

export type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export type ReviewSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export type LogItem = {
  id: number;
  userId: number | null;
  action: string;
  details: string | null;
  timestamp: string;
};

export type ReportsSummary = {
  users: number;
  products: number;
  categories: number;
  reviews: ReviewSummary;
  lastLogs: LogItem[];
};

export type Category = {
  id: number;
  name: string;
};

export type CreateProductDto = {
  name: string;
  brand: string;
  categoryId: number;
};

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};
