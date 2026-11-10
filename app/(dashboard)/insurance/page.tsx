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
      label: "Medicare",
      desc: "Quản lý Tìm hiểu về Medicare, Quy trình làm việc và FAQs",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      count: iulTotal,
      countLabel: "mục",
    },
    {
      href: "/insurance/kid-iul",
      label: "ACA Marketplace",
      desc: "Quản lý Quy trình hỗ trợ và các quyền lợi ACA Marketplace",
      icon: Baby,
      color: "text-pink-600",
      bg: "bg-pink-50",
      count: kidBenefitsCount ?? 0,
      countLabel: "quyền lợi",
    },
    {
      href: "/insurance/termlife",
      label: "Bảo hiểm xe hơi",
      desc: "Quản lý các quyền lợi Bảo hiểm xe hơi (Auto Insurance)",
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
          Quản lý nội dung 3 sản phẩm bảo hiểm (Medicare, ACA Marketplace, Bảo hiểm xe hơi)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Medicare", value: iulTotal, icon: Zap, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "ACA Marketplace", value: kidBenefitsCount ?? 0, icon: Baby, color: "text-pink-600", bg: "bg-pink-50" },
          { label: "Bảo hiểm xe hơi", value: termBenefitsCount ?? 0, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
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
