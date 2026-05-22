import { createClient } from "@/utils/supabase/server";
import { Phone, MessageCircle, Users } from "lucide-react";
import LeadsTable from "./LeadsTable";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const total = leads?.length ?? 0;
  const withPhone = leads?.filter((l) => l.phone).length ?? 0;
  const withMessage = leads?.filter((l) => l.message).length ?? 0;

  const cards = [
    {
      label: "Tổng liên hệ",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Có số điện thoại",
      value: withPhone,
      icon: Phone,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Có tin nhắn",
      value: withMessage,
      icon: MessageCircle,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Khách hàng liên hệ</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Danh sách khách hàng đã điền form liên hệ
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => {
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">
            Danh sách liên hệ
          </h2>
        </div>

        {leads && leads.length > 0 ? (
          <LeadsTable leads={leads} />
        ) : (
          <div className="py-16 text-center">
            <Users size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Chưa có liên hệ nào</p>
            <p className="text-slate-400 text-sm mt-1">
              Khách hàng điền form sẽ xuất hiện ở đây
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
