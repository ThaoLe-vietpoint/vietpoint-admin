import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import FaqActions from "./FaqActions";

export default async function IULFaqsPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("iul_faqs")
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
          IUL Secrets
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">FAQs</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">FAQs – IUL</h1>
        <Link
          href="/insurance/iul/faqs/new"
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
                Câu hỏi
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">
                Trả lời
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
            {(faqs ?? []).map((f) => (
              <tr
                key={f.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-slate-800 font-medium max-w-xs">
                  <div>{(f as any).question_en || (f as any).question_vi || (f as any).question || <span className="text-slate-300 italic text-xs">—</span>}</div>
                  {(f as any).question_vi && (f as any).question_en && <div className="text-slate-400 text-xs mt-0.5">{(f as any).question_vi}</div>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell max-w-xs truncate">
                  {(f as any).answer_en || (f as any).answer_vi || (f as any).answer}
                </td>
                <td className="px-4 py-3 text-slate-500 text-center">
                  {f.sort_order}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {f.active ? "Hiện" : "Ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/insurance/iul/faqs/${f.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <FaqActions faq={f} />
                  </div>
                </td>
              </tr>
            ))}
            {(faqs ?? []).length === 0 && (
              <tr>
                <td
                  colSpan={5}
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
