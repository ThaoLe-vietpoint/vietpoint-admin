import { createClient } from "@/utils/supabase/server";
import { MessageSquare, Star, CheckCircle2, XCircle } from "lucide-react";
import TestimonialActions from "./TestimonialActions";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const total = testimonials?.length ?? 0;
  const active = testimonials?.filter((t) => t.active).length ?? 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Đánh giá khách hàng
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Quản lý testimonials hiển thị trên website
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng đánh giá",
            value: total,
            icon: MessageSquare,
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

      {/* Cards Grid */}
      {testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl border p-5 space-y-3 ${t.active ? "border-slate-100" : "border-slate-100 opacity-60"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full ${t.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                >
                  {t.active ? "Hiển thị" : "Đã ẩn"}
                </span>
              </div>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < (t.rating ?? 5)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200 fill-slate-200"
                    }
                  />
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                &ldquo;{t.quote}&rdquo;
              </p>

              <TestimonialActions id={t.id} active={t.active} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
          <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Chưa có đánh giá nào</p>
          <p className="text-slate-400 text-sm mt-1">
            Đánh giá từ khách hàng sẽ xuất hiện ở đây
          </p>
        </div>
      )}
    </div>
  );
}
