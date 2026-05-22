import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, FileText, Globe, BookOpen } from "lucide-react";
import BlogPostActions from "./BlogPostActions";

const categoryColors: Record<string, string> = {
  IUL: "bg-blue-50 text-blue-700 border-blue-100",
  "Term Life": "bg-violet-50 text-violet-700 border-violet-100",
  "Max-Funded IUL": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Kids IUL": "bg-pink-50 text-pink-700 border-pink-100",
  "Financial Planning": "bg-emerald-50 text-emerald-700 border-emerald-100",
  General: "bg-slate-50 text-slate-600 border-slate-100",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(
      "id, title_vi, title_en, excerpt_vi, category, image, published, created_at",
    )
    .order("created_at", { ascending: false });

  const total = posts?.length ?? 0;
  const published = posts?.filter((p) => p.published).length ?? 0;
  const drafts = total - published;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bài viết Blog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý nội dung song ngữ EN / VI
          </p>
        </div>
        <Link
          href="/blog/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          Tạo bài viết
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng bài viết",
            value: total,
            icon: <BookOpen size={16} className="text-blue-600" />,
            bg: "bg-blue-50",
            num: "text-blue-700",
          },
          {
            label: "Đã xuất bản",
            value: published,
            icon: <Globe size={16} className="text-emerald-600" />,
            bg: "bg-emerald-50",
            num: "text-emerald-700",
          },
          {
            label: "Bản nháp",
            value: drafts,
            icon: <FileText size={16} className="text-amber-600" />,
            bg: "bg-amber-50",
            num: "text-amber-700",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}
            >
              {c.icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${c.num}`}>{c.value}</p>
              <p className="text-xs text-slate-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Post list */}
      {posts && posts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Thumbnail */}
              <div
                className="relative overflow-hidden bg-slate-100"
                style={{ height: "160px" }}
              >
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.title_vi || post.title_en || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={28} className="text-slate-300" />
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      post.published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        post.published ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                    {post.published ? "Đã đăng" : "Nháp"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 gap-2.5">
                {/* Category + date */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                      categoryColors[post.category] ??
                      "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title_vi || post.title_en || "(Không có tiêu đề)"}
                </h3>

                {/* Excerpt */}
                {post.excerpt_vi && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt_vi}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                  >
                    Chỉnh sửa
                  </Link>
                  <BlogPostActions
                    postId={post.id}
                    published={post.published}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <FileText size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Chưa có bài viết nào</p>
          <p className="text-slate-400 text-sm mt-1 mb-5">
            Tạo bài viết đầu tiên để bắt đầu
          </p>
          <Link
            href="/blog/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} />
            Tạo bài viết đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
}
