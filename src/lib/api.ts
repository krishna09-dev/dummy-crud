// src/lib/api.ts
import type { Post, NewPost } from "./types";

/**
 * Centralized endpoints
 */
const BASE = "https://dummyjson.com";
const POSTS = `${BASE}/posts`;

/**
 * Small helper around fetch to ensure no caching while developing
 * and to produce clearer errors.
 */
async function request<T>(
  input: string,
  init?: RequestInit & { method?: "GET" | "POST" | "PUT" | "DELETE" }
): Promise<T> {
  const res = await fetch(input, { cache: "no-store", ...init });
  if (!res.ok) {
    let message = `HTTP ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) message += ` - ${body.message}`;
    } catch {
      try {
        const text = await res.text();
        if (text) message += ` - ${text}`;
      } catch {}
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function getPosts(limit = 12): Promise<Post[]> {
  const data = await request<{ posts: Post[] }>(`${POSTS}?limit=${limit}`);
  return data.posts;
}

export async function addPost(payload: NewPost): Promise<Post> {
  return request<Post>(`${POSTS}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function editPost(id: number, patch: Partial<Post>): Promise<Post> {
  // NOTE: DummyJSON can only "edit" known ids (roughly 1..150).
  // For local temp ids created in the UI, you should skip calling this API
  // and keep the optimistic update. See page.tsx handlers.
  return request<Post>(`${POSTS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export async function deletePost(id: number): Promise<{ isDeleted: boolean }> {
  return request<{ isDeleted: boolean }>(`${POSTS}/${id}`, {
    method: "DELETE",
  });
}