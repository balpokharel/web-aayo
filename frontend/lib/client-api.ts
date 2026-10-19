const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function postPublic<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1/public${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const payload = await response.json().catch(() => ({ success: false, message: "Something went wrong. Please try again." })) as { success: boolean; message?: string; data?: T };
  if (!response.ok || !payload.success) throw new Error(payload.message ?? "Request failed");
  return payload.data as T;
}
