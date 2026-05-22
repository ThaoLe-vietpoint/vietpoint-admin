import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight, Clock } from "lucide-react";
import BenefitActions from "../kid-iul/BenefitActions";

export default async function TermLifePage() {
  const supabase = await createClient();
  const { data: benefits } = await supabase
    .from("termlife_benefits")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
        <Link href="/insurance" className="hover:text-slate-200">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-200">Term Life</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock size={22} className="text-orange-400" />
          <h1 className="text-xl font-bold text-slate-100">
            Term Life — Quyền lợi
          </h1>
        </div>
        <Link
          href="/insurance/termlife/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} /> Thêm mới
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                Icon
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
                Tiêu đề
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">
                Mô tả
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase w-20">
                Thứ tự
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase w-20">
                Trạng thái
              </th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {(benefits ?? []).map((b) => (
              <tr
                key={b.id}
                className="hover:bg-slate-750/50 transition-colors"
              >
                <td className="px-4 py-3 text-xl">{b.icon}</td>
                <td className="px-4 py-3 text-slate-200 font-medium">
                  {b.title}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell max-w-xs truncate">
                  {b.description}
                </td>
                <td className="px-4 py-3 text-slate-400 text-center">
                  {b.sort_order}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-400"}`}
                  >
                    {b.active ? "Hiện" : "Ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/insurance/termlife/${b.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <BenefitActions benefit={b} table="termlife_benefits" />
                  </div>
                </td>
              </tr>
            ))}
            {(benefits ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
