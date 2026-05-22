import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import ReasonActions from "./ReasonActions";

export default async function IULReasonsPage() {
  const supabase = await createClient();
  const { data: reasons } = await supabase
    .from("iul_reasons")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
        <Link href="/insurance" className="hover:text-slate-200">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <Link href="/insurance/iul" className="hover:text-slate-200">
          IUL Secrets
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-200">Lý do chọn IUL</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-100">Lý do chọn IUL</h1>
        <Link
          href="/insurance/iul/reasons/new"
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
            {(reasons ?? []).map((r) => (
              <tr
                key={r.id}
                className="hover:bg-slate-750/50 transition-colors"
              >
                <td className="px-4 py-3 text-xl">{r.icon}</td>
                <td className="px-4 py-3 text-slate-200 font-medium">
                  {r.title}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell max-w-xs truncate">
                  {r.description}
                </td>
                <td className="px-4 py-3 text-slate-400 text-center">
                  {r.sort_order}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-400"}`}
                  >
                    {r.active ? "Hiện" : "Ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/insurance/iul/reasons/${r.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <ReasonActions reason={r} />
                  </div>
                </td>
              </tr>
            ))}
            {(reasons ?? []).length === 0 && (
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
