import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import {
  BookOpen,
  Heart,
  ChevronRight,
  Users,
  FileText,
  FileCheck,
  Trophy,
} from "lucide-react";

export default async function CustomerCarePage() {
  const supabase = await createClient();

  const [
    { count: storiesCount },
    { count: guidesCount },
    { count: stepsCount },
    { count: perksCount },
  ] = await Promise.all([
    supabase
      .from("customer_stories")
      .select("*", { count: "exact", head: true }),
    supabase.from("manual_guides").select("*", { count: "exact", head: true }),
    supabase.from("claims_steps").select("*", { count: "exact", head: true }),
    supabase.from("priority_perks").select("*", { count: "exact", head: true }),
  ]);

  const sections = [
    {
      href: "/customer-care/stories",
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-50",
      label: "Câu chuyện khách hàng",
      desc: "Quản lý các câu chuyện thực tế từ khách hàng (My Story, My Family)",
      count: storiesCount ?? 0,
      countLabel: "câu chuyện",
    },
    {
      href: "/customer-care/user-manual",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      label: "Hướng dẫn sử dụng",
      desc: "Quản lý các bài hướng dẫn quản lý hợp đồng bảo hiểm",
      count: guidesCount ?? 0,
      countLabel: "bài hướng dẫn",
    },
    {
      href: "/customer-care/claims",
      icon: FileCheck,
      color: "text-teal-600",
      bg: "bg-teal-50",
      label: "Giải quyết quyền lợi",
      desc: "Quản lý các bước hướng dẫn quy trình giải quyết bảo hiểm",
      count: stepsCount ?? 0,
      countLabel: "bước",
    },
    {
      href: "/customer-care/priority-program",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
      label: "Chương trình ưu tiên",
      desc: "Quản lý quyền lợi dành cho thành viên ưu tiên (Priority Member)",
      count: perksCount ?? 0,
      countLabel: "quyền lợi",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          Chăm sóc khách hàng
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Quản lý nội dung trang Customer Care
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Câu chuyện KH",
            value: storiesCount ?? 0,
            icon: Users,
            color: "text-pink-600",
            bg: "bg-pink-50",
          },
          {
            label: "Bài hướng dẫn",
            value: guidesCount ?? 0,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Bước Claims",
            value: stepsCount ?? 0,
            icon: FileCheck,
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            label: "Quyền lợi UT",
            value: perksCount ?? 0,
            icon: Trophy,
            color: "text-amber-600",
            bg: "bg-amber-50",
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

      {/* Section cards */}
      <div className="space-y-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <div
                className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}
              >
                <Icon size={20} className={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {s.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-slate-400">
                  {s.count} {s.countLabel}
                </span>
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-blue-400 transition-colors"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
