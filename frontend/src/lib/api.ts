import type { Horse, HorseInput, Match } from "@/types";

const TOKEN_KEY = "horse-tinder-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(`/api${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "Can't reach the stable right now. Check your connection.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  async createHorse(input: HorseInput): Promise<Horse> {
    const r = await request<{ token: string; horse: Horse }>("/horses", {
      method: "POST",
      body: JSON.stringify(input),
    });
    localStorage.setItem(TOKEN_KEY, r.token);
    return r.horse;
  },
  me: () => request<Horse>("/me"),
  feed: () => request<Horse[]>("/feed"),
  swipe: (targetId: number, liked: boolean) =>
    request<{ match: boolean; horse?: Horse }>("/swipes", {
      method: "POST",
      body: JSON.stringify({ targetId, liked }),
    }),
  matches: () => request<Match[]>("/matches"),
};

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");
