const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}${path.includes("?") ? "&" : "?"}token=${token}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || res.statusText);
  }

  // 204 No Content
  if (res.status === 204) return null as T;

  return res.json();
}

export const apiClient = {
  get: <T>(path: string, token: string) =>
    request<T>(path, token, { method: "GET" }),

  post: <T>(path: string, token: string, body: unknown) =>
    request<T>(path, token, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
