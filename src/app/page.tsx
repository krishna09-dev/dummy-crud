// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getPosts, addPost, editPost, deletePost } from "@/lib/api";
import { usePostsStore } from "@/store/usePostsStore";
import PostCard from "@/components/PostCard";
import PostFormModal from "@/components/PostFormModal";
import type { Post, NewPost } from "@/lib/types";

export default function Home() {
  const { posts, setPosts, addLocal, applyUpdate, remove, nextLocalId } =
    usePostsStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  // fetch on first mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getPosts(12);
        setPosts(data);
      } catch {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [setPosts]);

  // create
  async function handleCreate(payload: NewPost) {
    const tempId = nextLocalId();
    const tempPost: Post = {
      id: tempId,
      ...payload,
      tags: payload.tags ?? [],
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
      userId: payload.userId ?? 1,
    };
    addLocal(tempPost);
    try {
      const saved = await addPost(payload);
      applyUpdate(tempId, { id: saved.id });
    } catch (e) {
      console.error("Failed to save", e);
    }
  }

  // update
  async function handleUpdate(payload: NewPost & { id: number }) {
    applyUpdate(payload.id, payload);
    try {
      await editPost(payload.id, payload);
    } catch (e) {
      console.error("Failed to update", e);
    }
  }

  // delete
  async function handleDelete(id: number) {
    remove(id);
    try {
      await deletePost(id);
    } catch (e) {
      console.error("Failed to delete", e);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-6 text-slate-900">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true); // <— THIS should open the modal
              // console.log("open set to true"); // uncomment to verify
            }}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Post
          </button>
        </header>

        {loading && <p className="text-slate-600">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onEdit={(post) => {
                  setEditing(post);
                  setOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </div>

      {/* Keep modal outside the grid/container so z-index works */}
      <PostFormModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSubmit={(values) =>
          editing
            ? handleUpdate({ ...values, id: editing.id })
            : handleCreate(values)
        }
      />
    </main>
  );
}