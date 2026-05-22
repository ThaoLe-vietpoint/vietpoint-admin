import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users2 } from "lucide-react";
import { listEmployees } from "./actions";
import AgentList from "./AgentList";

export default async function AgentsPage() {
  // Only admins can access this page
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role === "employee") redirect("/");

  const employees = await listEmployees().catch(() => []);

  const total = employees.length;
  const active = employees.filter((e) => e.last_sign_in_at !== null).length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Nhân viên</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Danh sách nhân viên trực thuộc — có thể đăng nhập vào hệ thống admin
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng nhân viên",
            value: total,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Đã đăng nhập",
            value: active,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Chưa đăng nhập",
            value: total - active,
            color: "text-slate-500",
            bg: "bg-slate-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-100 p-5"
          >
            <div
              className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
            >
              <Users2 size={18} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Employee list with CRUD */}
      <AgentList initial={employees} />
    </div>
  );
}
