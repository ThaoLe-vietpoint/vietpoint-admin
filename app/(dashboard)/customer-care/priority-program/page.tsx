import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Trophy, Plus, Edit3, CheckCircle2, XCircle } from "lucide-react";
import PerkActions from "./PerkActions";

export default async function PriorityProgramAdminPage() {
  const supabase = await createClient();
  const { data: perks } = await supabase
    .from("priority_perks")
    .select("*")
    .order("sort_order", { ascending: true });

  const total = perks?.length ?? 0;
  const active = perks?.filter((p) => p.active).length ?? 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Chương trình ưu tiên
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Priority Program — quản lý quyền lợi thành viên ưu tiên
          </p>
        </div>
        <Link
          href="/customer-care/priority-program/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Thêm quyền lợi
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng quyền lợi",
            value: total,
            icon: Trophy,
            color: "text-amber-600",
            bg: "bg-amber-50",
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

      {/* Perks grid */}
      {perks && perks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {perks.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-5 space-y-3 flex flex-col ${
                p.active ? "border-slate-100" : "border-slate-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{p.icon}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                    p.active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {p.active ? "Hiển thị" : "Đã ẩn"}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                  {p.label_en || p.label}
                </p>
                {(p.description_en || p.description) && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {p.description_en || p.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href={`/customer-care/priority-program/${p.id}`}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit3 size={13} />
                  Chỉnh sửa
                </Link>
                <span className="text-slate-300">#{p.sort_order}</span>
              </div>
              <PerkActions id={p.id} active={p.active} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
          <Trophy size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">
            Chưa có quyền lợi nào
          </p>
          <Link
            href="/customer-care/priority-program/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus size={14} />
            Thêm quyền lợi đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
}
