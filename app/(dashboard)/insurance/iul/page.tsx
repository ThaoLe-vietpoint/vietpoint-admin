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
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      href: "/insurance/iul/steps",
      label: "Các bước",
      desc: "Quy trình từng bước",
      count: stepsCount ?? 0,
      color: "bg-purple-500/10 text-purple-400",
    },
    {
      href: "/insurance/iul/faqs",
      label: "FAQs",
      desc: "Câu hỏi thường gặp",
      count: faqsCount ?? 0,
      color: "bg-amber-500/10 text-amber-400",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
        <Link href="/insurance" className="hover:text-slate-200">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-200">IUL Secrets</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Zap size={22} className="text-blue-400" />
        <h1 className="text-xl font-bold text-slate-100">IUL Secrets</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div
            key={s.href}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-lg ${s.color}`}
              >
                {s.count} mục
              </span>
              <Link
                href={`${s.href}/new`}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus size={12} /> Thêm
              </Link>
            </div>
            <h3 className="text-slate-100 font-semibold mb-1">{s.label}</h3>
            <p className="text-xs text-slate-400 mb-3">{s.desc}</p>
            <Link
              href={s.href}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Quản lý <ChevronRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
