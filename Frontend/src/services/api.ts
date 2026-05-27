import type { Pagination, Task, TaskPayload, TaskStatus, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type AuthResponse = {
  token: string;
  user: User;
};

type TaskListResponse = {
  data: Task[];
  pagination: Pagination;
};

type RequestOptions = RequestInit & {
  token?: string | null;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as T;
};

export const authApi = {
  signup: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: (token: string) => request<{ user: User }>("/auth/me", { token }),
};

export const taskApi = {
  list: (token: string, params: { status: TaskStatus | "all"; search: string; page: number }) => {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: "8",
    });

    if (params.status !== "all") query.set("status", params.status);
    if (params.search.trim()) query.set("search", params.search.trim());

    return request<TaskListResponse>(`/tasks?${query.toString()}`, { token });
  },
  create: (token: string, payload: TaskPayload) => {
    request<{ data: Task }>("/tasks", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },
  update: (token: string, id: string, payload: Partial<TaskPayload>) =>
    request<{ data: Task }>(`/tasks/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }),
  remove: (token: string, id: string) =>
    request<void>(`/tasks/${id}`, {
      method: "DELETE",
      token,
    }),
};
