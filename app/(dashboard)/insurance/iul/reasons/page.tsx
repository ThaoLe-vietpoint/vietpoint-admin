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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/insurance" className="hover:text-slate-700">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <Link href="/insurance/iul" className="hover:text-slate-700">
          Medicare
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">Tìm Hiểu Về Medicare</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">Tìm Hiểu Về Medicare</h1>
        <Link
          href="/insurance/iul/reasons/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} /> Thêm mới
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                Icon
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                Tiêu đề
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">
                Mô tả
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">
                Thứ tự
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-20">
                Trạng thái
              </th>
              <th className="px-4 py-3 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(reasons ?? []).map((r) => (
              <tr
                key={r.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-xl">{r.icon}</td>
                <td className="px-4 py-3 text-slate-800 font-medium">
                  <div>{(r as any).title_en || (r as any).title_vi || (r as any).title || <span className="text-slate-300 italic text-xs">—</span>}</div>
                  {(r as any).title_vi && (r as any).title_en && <div className="text-slate-400 text-xs mt-0.5">{(r as any).title_vi}</div>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell max-w-xs truncate">
                  {(r as any).description_en || (r as any).description_vi || (r as any).description}
                </td>
                <td className="px-4 py-3 text-slate-500 text-center">
                  {r.sort_order}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {r.active ? "Hiện" : "Ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/insurance/iul/reasons/${r.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
