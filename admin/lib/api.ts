export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export type ApiResult<T> = { success: boolean; message: string; data: T; errors?: string[] };

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> { const response = await fetch(`${API_URL}/api/v1${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } }); const result = await response.json() as ApiResult<T>; if (!response.ok || !result.success) { if (response.status === 401 && typeof window !== "undefined" && !location.pathname.endsWith("/login")) location.href = "/admin/login"; throw new Error(result.message || "Request failed"); } return result.data; }
export const adminApi = {
  login: (email: string, password: string) => api<{ user: AdminUser }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password, deviceId: crypto.randomUUID() }) }),
  me: () => api<AdminUser>("/auth/me"), logout: () => api("/auth/logout", { method: "POST" }),
  dashboard: () => api<DashboardData>("/admin/dashboard"),
  list: <T>(resource: string, params: URLSearchParams) => api<{ items: T[]; pagination: Pagination }>(`/admin/${resource}?${params}`),
  one: <T>(resource: string, id: string) => api<T>(`/admin/${resource}/${id}`),
  create: <T>(resource: string, body: Record<string, unknown>) => api<T>(`/admin/${resource}`, { method: "POST", body: JSON.stringify(body) }),
  update: <T>(resource: string, id: string, body: Record<string, unknown>) => api<T>(`/admin/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (resource: string, id: string) => api(`/admin/${resource}/${id}`, { method: "DELETE" }),
};
export type AdminUser = { sub: string; name: string; email: string; roles: string[]; permissions: string[] };
export type Pagination = { page: number; limit: number; total: number; pages: number };
export type DashboardData = { metrics: Record<string, number>; recentActivity: Array<Record<string, unknown>>; trends?: Array<Record<string, unknown>>; leadSources?: Array<Record<string, unknown>> };
