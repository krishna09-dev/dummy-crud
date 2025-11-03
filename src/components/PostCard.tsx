// src/components/PostCard.tsx
"use client";
import { Post } from "@/lib/types";

type Props = {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
};

export default function PostCard({ post, onEdit, onDelete }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* DARK title */}
      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900">
        {post.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.body}</p>

      {!!post.tags?.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1" aria-label="Likes">
          <span role="img" aria-hidden>👍</span>
          <span className="tabular-nums">{post.reactions?.likes ?? 0}</span>
        </div>
        <div className="flex items-center gap-1" aria-label="Dislikes">
          <span role="img" aria-hidden>👎</span>
          <span className="tabular-nums">{post.reactions?.dislikes ?? 0}</span>
        </div>
        <div className="flex items-center gap-1" aria-label="Views">
          <span role="img" aria-hidden>👁️</span>
          <span className="tabular-nums">{post.views ?? 0}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(post)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  );
}