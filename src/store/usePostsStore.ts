// src/store/usePostsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Post } from "@/lib/types";

type State = {
  posts: Post[];                 // merged list (locals + patched API)
  upserts: Record<number, Post>; // local updates by id
  locals: Post[];                // locally created (with generated ids)
};

type Actions = {
  setPosts: (posts: Post[]) => void;
  addLocal: (post: Post) => void;
  applyUpdate: (id: number, patch: Partial<Post>) => void; // <-- fixed name
  remove: (id: number) => void;
  nextLocalId: () => number;
};

export const usePostsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      posts: [],
      upserts: {},
      locals: [],

      setPosts: (posts) => {
        const { upserts, locals } = get();
        // overlay local edits on top of fresh API posts
        const patched = posts.map((p) =>
          upserts[p.id] ? { ...p, ...upserts[p.id] } : p
        );
        set({ posts: [...locals, ...patched] });
      },

      addLocal: (post) =>
        set((state) => ({
          locals: [post, ...state.locals],
          posts: [post, ...state.posts],
        })),

      applyUpdate: (id, patch) =>
        set((state) => {
          const posts = state.posts.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          );
          return {
            posts,
            upserts: {
              ...state.upserts,
              [id]: { ...(state.upserts[id] ?? {}), ...patch },
            },
          };
        }),

      remove: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
          locals: state.locals.filter((p) => p.id !== id),
          upserts: Object.fromEntries(
            Object.entries(state.upserts).filter(([k]) => Number(k) !== id)
          ),
        })),

      nextLocalId: () => {
        const used = new Set(get().posts.map((p) => p.id));
        let id = 100000; // avoid clashing with API ids
        while (used.has(id)) id++;
        return id;
      },
    }),
    { name: "posts-state" }
  )
);