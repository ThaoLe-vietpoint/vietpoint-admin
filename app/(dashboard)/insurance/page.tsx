import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Baby,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";

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

  const products = [
    {
      href: "/insurance/iul",
      label: "IUL Secrets",
      icon: Zap,
      color: "bg-blue-500",
      sections: [
        { name: "Lý do chọn IUL", count: iulReasonsCount ?? 0 },
        { name: "Các bước", count: iulStepsCount ?? 0 },
        { name: "FAQs", count: iulFaqsCount ?? 0 },
      ],
    },
    {
      href: "/insurance/kid-iul",
      label: "IUL Cho Trẻ",
      icon: Baby,
      color: "bg-pink-500",
      sections: [{ name: "Quyền lợi", count: kidBenefitsCount ?? 0 }],
    },
    {
      href: "/insurance/max-iul",
      label: "Max-Funded IUL",
      icon: TrendingUp,
      color: "bg-emerald-500",
      sections: [{ name: "Lý do chọn", count: maxReasonsCount ?? 0 }],
    },
    {
      href: "/insurance/termlife",
      label: "Term Life",
      icon: Clock,
      color: "bg-orange-500",
      sections: [{ name: "Quyền lợi", count: termBenefitsCount ?? 0 }],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ShieldCheck size={22} className="text-blue-500" />
          <h1 className="text-xl font-bold text-slate-100">Bảo hiểm</h1>
        </div>
        <p className="text-sm text-slate-400">
          Quản lý nội dung 4 trang sản phẩm bảo hiểm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 hover:bg-slate-750 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 ${p.color} rounded-xl flex items-center justify-center`}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-500 group-hover:text-blue-400 transition-colors mt-1"
                />
              </div>
              <h3 className="text-slate-100 font-semibold mb-3">{p.label}</h3>
              <div className="space-y-1.5">
                {p.sections.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-400">{s.name}</span>
                    <span className="text-xs font-medium text-slate-300 bg-slate-700 px-2 py-0.5 rounded-full">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
