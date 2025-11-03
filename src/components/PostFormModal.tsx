// src/components/PostFormModal.tsx
"use client";

import { useEffect, useState } from "react";
import type { Post, NewPost } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: NewPost) => void;
  initial?: Post | null;
};

export default function PostFormModal({ open, onClose, onSubmit, initial }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Tags: managed as a list + current input text
  const [tagsText, setTagsText] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setBody(initial.body);
      setTagsList(initial.tags ?? []);
      setTagsText("");
    } else {
      setTitle("");
      setBody("");
      setTagsList([]);
      setTagsText("");
    }
  }, [initial, open]);

  if (!open) return null;

  function tryAddTag(raw: string) {
    const t = raw.trim();
    if (!t) return;
    // avoid duplicates (case-insensitive)
    const exists = tagsList.some((x) => x.toLowerCase() === t.toLowerCase());
    if (exists) {
      setTagsText("");
      return;
    }
    setTagsList((prev) => [...prev, t]);
    setTagsText("");
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Add on Enter or comma
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      tryAddTag(tagsText);
    }
    // Backspace on empty input removes last tag
    if (e.key === "Backspace" && tagsText.length === 0 && tagsList.length > 0) {
      e.preventDefault();
      setTagsList((prev) => prev.slice(0, -1));
    }
  }

  function handleRemoveTag(idx: number) {
    setTagsList((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: NewPost = {
      title: title.trim(),
      body: body.trim(),
      tags: tagsList,
      userId: 1,
    };
    onSubmit(payload);
    onClose();
  }

  return (
    // BLUR + DARK overlay
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      {/* MODAL CARD */}
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl
                   transition-all duration-200 ease-out animate-[fadeIn_0.15s_ease-out]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {initial ? "Edit Post" : "Create Post"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Post title"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Write your content…"
              required
            />
          </label>

          {/* Tags input + Add button + chip list */}
          <div className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Tags</span>

            <div className="flex items-center gap-2">
              <input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
                           placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Type a tag and press Enter"
              />
              <button
                type="button"
                onClick={() => tryAddTag(tagsText)}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                Add
              </button>
            </div>

            {/* Chips */}
            {tagsList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tagsList.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                  >
                    #{t}
                    <button
                      type="button"
                      aria-label={`Remove ${t}`}
                      onClick={() => handleRemoveTag(i)}
                      className="rounded-full border border-slate-200 px-1 leading-none text-slate-500 hover:bg-slate-100"
                      title="Remove tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}