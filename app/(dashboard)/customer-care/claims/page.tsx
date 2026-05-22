import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FileCheck, Plus, Edit3, CheckCircle2, XCircle } from "lucide-react";
import StepActions from "./StepActions";

export default async function ClaimsAdminPage() {
  const supabase = await createClient();
  const { data: steps } = await supabase
    .from("claims_steps")
    .select("*")
    .order("sort_order", { ascending: true });

  const total = steps?.length ?? 0;
  const active = steps?.filter((s) => s.active).length ?? 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Giải quyết quyền lợi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Claims Process — quản lý các bước hướng dẫn
          </p>
        </div>
        <Link
          href="/customer-care/claims/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Thêm bước
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng bước",
            value: total,
            icon: FileCheck,
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

      {/* Steps list */}
      {steps && steps.length > 0 ? (
        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border p-5 flex gap-4 ${
                s.active ? "border-slate-100" : "border-slate-100 opacity-60"
              }`}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                {s.num || "—"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {s.title_en || s.title}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                      s.active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {s.active ? "Hiển thị" : "Đã ẩn"}
                  </span>
                </div>
                {(s.description_en || s.description) && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {s.description_en || s.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <Link
                    href={`/customer-care/claims/${s.id}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 size={13} />
                    Chỉnh sửa
                  </Link>
                  <span className="text-xs text-slate-300">
                    Thứ tự: {s.sort_order}
                  </span>
                  <StepActions id={s.id} active={s.active} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <FileCheck size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">Chưa có bước nào</p>
          <Link
            href="/customer-care/claims/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus size={14} />
            Thêm bước đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
}
