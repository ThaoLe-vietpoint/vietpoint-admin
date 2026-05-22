"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Globe, BookOpen } from "lucide-react";

export default function BlogPostActions({
  postId,
  published,
}: {
  postId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    const supabase = createClient();
    await supabase
      .from("blog_posts")
      .update({ published: !published, updated_at: new Date().toISOString() })
      .eq("id", postId);
    router.refresh();
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", postId);
    router.refresh();
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-red-700 font-semibold">Xoá?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-md transition-colors"
        >
          {deleting ? <Loader2 size={10} className="animate-spin" /> : "Xoá"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-[11px] text-slate-500 hover:text-slate-700 px-1"
        >
          Huỷ
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleToggle}
        disabled={toggling}
        title={published ? "Huỷ xuất bản" : "Xuất bản"}
        className={`p-1.5 rounded-lg transition-colors ${
          published
            ? "text-emerald-600 hover:bg-emerald-50"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        }`}
      >
        {toggling ? (
          <Loader2 size={13} className="animate-spin" />
        ) : published ? (
          <Globe size={13} />
        ) : (
          <BookOpen size={13} />
        )}
      </button>
      <button
        onClick={() => setConfirm(true)}
        title="Xoá bài viết"
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
