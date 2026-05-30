import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Zap, Baby, TrendingUp, Clock, ChevronRight } from "lucide-react";

export default async function InsurancePage() {
  const supabase = await createClient();

  const [
    { count: iulReasonsCount },
    { count: iulStepsCount },
    { count: iulFaqsCount },
    { count: kidBenefitsCount },
    { count: maxReasonsCount },
    { count: termBenefitsCount },
  ] = await Promise.all([
    supabase.from("iul_reasons").select("*", { count: "exact", head: true }),
    supabase.from("iul_steps").select("*", { count: "exact", head: true }),
    supabase.from("iul_faqs").select("*", { count: "exact", head: true }),
    supabase
      .from("kid_iul_benefits")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("max_iul_reasons")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("termlife_benefits")
      .select("*", { count: "exact", head: true }),
  ]);

  const iulTotal = (iulReasonsCount ?? 0) + (iulStepsCount ?? 0) + (iulFaqsCount ?? 0);

  const products = [
    {
      href: "/insurance/iul",
      label: "IUL Secrets",
      desc: "Quản lý lý do chọn IUL, các bước và câu hỏi thường gặp",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      count: iulTotal,
      countLabel: "mục",
    },
    {
      href: "/insurance/kid-iul",
      label: "IUL Cho Trẻ",
      desc: "Quản lý các quyền lợi bảo hiểm cho trẻ em",
      icon: Baby,
      color: "text-pink-600",
      bg: "bg-pink-50",
      count: kidBenefitsCount ?? 0,
      countLabel: "quyền lợi",
    },
    {
      href: "/insurance/max-iul",
      label: "Max-Funded IUL",
      desc: "Quản lý các lý do chọn Max-Funded IUL",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      count: maxReasonsCount ?? 0,
      countLabel: "lý do",
    },
    {
      href: "/insurance/termlife",
      label: "Term Life",
      desc: "Quản lý các quyền lợi bảo hiểm Term Life",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
      count: termBenefitsCount ?? 0,
      countLabel: "quyền lợi",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Bảo hiểm</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Quản lý nội dung 4 trang sản phẩm bảo hiểm
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "IUL Secrets", value: iulTotal, icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "IUL Cho Trẻ", value: kidBenefitsCount ?? 0, icon: Baby, color: "text-pink-600", bg: "bg-pink-50" },
          { label: "Max-Funded IUL", value: maxReasonsCount ?? 0, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Term Life", value: termBenefitsCount ?? 0, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}>
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

      {/* Section cards */}
      <div className="space-y-3">
        {products.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div className={`w-11 h-11 ${p.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={20} className={p.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{p.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-slate-400">
                  {p.count} {p.countLabel}
                </span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
