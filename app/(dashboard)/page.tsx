import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  FileText,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Plus,
  Eye,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: blogCount },
    { count: publishedCount },
    { count: leadsCount },
    { count: testimonialsCount },
    { data: recentLeads },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id, name, email, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("blog_posts")
      .select("id, title_vi, title_en, published, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Tổng bài viết",
      value: blogCount ?? 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/blog",
    },
    {
      label: "Đã xuất bản",
      value: publishedCount ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/blog",
    },
    {
      label: "Khách liên hệ",
      value: leadsCount ?? 0,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
      href: "/leads",
    },
    {
      label: "Đánh giá",
      value: testimonialsCount ?? 0,
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/testimonials",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 to-blue-900 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-sm font-medium mb-1">Xin chào 👋</p>
          <h2 className="text-white text-xl font-bold">
            Chào mừng trở lại, Admin
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/blog/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Bài viết mới
          </Link>
          <Link
            href="/leads"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Eye size={15} />
            Xem liên hệ
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all group"
            >
              <div
                className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon size={18} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-0.5">
                {s.value}
              </p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <div className="flex items-center gap-1 mt-3 text-[11px] text-slate-400 group-hover:text-blue-600 transition-colors">
                <TrendingUp size={11} />
                <span>Xem chi tiết</span>
                <ArrowRight size={11} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">
              Liên hệ gần đây
            </h3>
            <Link
              href="/leads"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads && recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 px-6 py-3.5"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {lead.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {lead.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {lead.email || lead.phone}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                    {new Date(lead.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm">
                Chưa có liên hệ nào
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">
              Bài viết gần đây
            </h3>
            <Link
              href="/blog"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 px-6 py-3.5"
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${post.published ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {post.title_vi || post.title_en || "(Không có tiêu đề)"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {post.published ? "Đã xuất bản" : "Bản nháp"}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-[11px] text-blue-600 hover:underline shrink-0 font-medium"
                  >
                    Sửa
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm">
                Chưa có bài viết nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
