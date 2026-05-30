import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Zap, ChevronRight, Plus } from "lucide-react";

export default async function IULPage() {
  const supabase = await createClient();

  const [{ count: reasonsCount }, { count: stepsCount }, { count: faqsCount }] =
    await Promise.all([
      supabase.from("iul_reasons").select("*", { count: "exact", head: true }),
      supabase.from("iul_steps").select("*", { count: "exact", head: true }),
      supabase.from("iul_faqs").select("*", { count: "exact", head: true }),
    ]);

  const sections = [
    {
      href: "/insurance/iul/reasons",
      label: "Lý do chọn IUL",
      desc: "Các lợi ích & lý do nổi bật",
      count: reasonsCount ?? 0,
      color: "bg-blue-50 text-blue-600",
    },
    {
      href: "/insurance/iul/steps",
      label: "Các bước",
      desc: "Quy trình từng bước",
      count: stepsCount ?? 0,
      color: "bg-purple-50 text-purple-600",
    },
    {
      href: "/insurance/iul/faqs",
      label: "FAQs",
      desc: "Câu hỏi thường gặp",
      count: faqsCount ?? 0,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-0">
        <Link href="/insurance" className="hover:text-slate-700">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">IUL Secrets</span>
      </div>
      <div className="flex items-center gap-3">
        <Zap size={22} className="text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">IUL Secrets</h1>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.href}
            className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-slate-400">{s.count} mục</span>
              <Link
                href={`${s.href}/new`}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus size={12} /> Thêm
              </Link>
              <Link
                href={s.href}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Quản lý <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
