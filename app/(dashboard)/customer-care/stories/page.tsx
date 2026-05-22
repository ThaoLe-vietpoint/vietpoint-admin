import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Heart, Plus, CheckCircle2, XCircle, Edit3 } from "lucide-react";
import StoryActions from "./StoryActions";

export default async function StoriesPage() {
  const supabase = await createClient();
  const { data: stories } = await supabase
    .from("customer_stories")
    .select("*")
    .order("created_at", { ascending: false });

  const total = stories?.length ?? 0;
  const active = stories?.filter((s) => s.active).length ?? 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Câu chuyện khách hàng
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            My Story, My Family — quản lý câu chuyện hiển thị trên website
          </p>
        </div>
        <Link
          href="/customer-care/stories/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Thêm câu chuyện
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng câu chuyện",
            value: total,
            icon: Heart,
            color: "text-pink-600",
            bg: "bg-pink-50",
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

      {/* Cards */}
      {stories && stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stories.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border p-5 space-y-3 flex flex-col ${
                s.active ? "border-slate-100" : "border-slate-100 opacity-60"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: s.tag_color ?? "#2F5E9E" }}
                  >
                    {s.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {s.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {[s.location_en || s.location, s.amount]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
                {(s.tag_en || s.tag) && (
                  <span
                    className="text-[10px] font-semibold px-2 py-1 rounded-full text-white shrink-0"
                    style={{ background: s.tag_color ?? "#2F5E9E" }}
                  >
                    {s.tag_en || s.tag}
                  </span>
                )}
              </div>

              {/* Story excerpt */}
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                &ldquo;{s.story_en || s.story}&rdquo;
              </p>

              {/* Edit link + Actions */}
              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href={`/customer-care/stories/${s.id}`}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit3 size={13} />
                  Chỉnh sửa
                </Link>
                <span
                  className={`px-2 py-1 rounded-full font-semibold ${
                    s.active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {s.active ? "Hiển thị" : "Đã ẩn"}
                </span>
              </div>

              <StoryActions id={s.id} active={s.active} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <Heart size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">
            Chưa có câu chuyện nào
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Thêm câu chuyện khách hàng để hiển thị trên website
          </p>
          <Link
            href="/customer-care/stories/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus size={14} />
            Thêm câu chuyện đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
}
