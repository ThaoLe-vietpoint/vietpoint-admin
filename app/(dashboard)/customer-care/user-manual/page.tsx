import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { BookOpen, Plus, CheckCircle2, XCircle, Edit3 } from "lucide-react";
import GuideActions from "./GuideActions";

export default async function UserManualPage() {
  const supabase = await createClient();
  const { data: guides } = await supabase
    .from("manual_guides")
    .select("*")
    .order("created_at", { ascending: false });

  const total = guides?.length ?? 0;
  const active = guides?.filter((g) => g.active).length ?? 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Hướng dẫn sử dụng
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            User Manual — quản lý bài hướng dẫn hiển thị trên website
          </p>
        </div>
        <Link
          href="/customer-care/user-manual/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Thêm bài hướng dẫn
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng bài viết",
            value: total,
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Đang hiển thị",
            value: active,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Đã ẩn",
            value: total - active,
            icon: XCircle,
            color: "text-slate-500",
            bg: "bg-slate-50",
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3"
            >
              <div
                className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}
              >
                <Icon size={16} className={c.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{c.value}</p>
                <p className="text-xs text-slate-500">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      {guides && guides.length > 0 ? (
        <div className="space-y-3">
          {guides.map((g) => (
            <div
              key={g.id}
              className={`bg-white rounded-2xl border p-5 flex items-start gap-4 ${
                g.active ? "border-slate-100" : "border-slate-100 opacity-60"
              }`}
            >
              {/* Tag badge */}
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-blue-600 text-center leading-tight">
                  {g.tag_en || g.tag || "—"}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {g.title_en || g.title}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                      g.active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {g.active ? "Hiển thị" : "Đã ẩn"}
                  </span>
                </div>
                {g.date_label && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {g.date_label}
                  </p>
                )}
                {(g.description_en || g.description) && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {g.description_en || g.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <Link
                    href={`/customer-care/user-manual/${g.id}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 size={13} />
                    Chỉnh sửa
                  </Link>
                  <GuideActions id={g.id} active={g.active} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <BookOpen size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">
            Chưa có bài hướng dẫn nào
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Thêm bài hướng dẫn để hiển thị trong mục User Manual
          </p>
          <Link
            href="/customer-care/user-manual/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus size={14} />
            Thêm bài đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
}
