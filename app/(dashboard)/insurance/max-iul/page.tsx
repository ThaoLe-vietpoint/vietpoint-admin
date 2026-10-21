import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight, TrendingUp } from "lucide-react";
import MaxReasonActions from "./MaxReasonActions";
import InsuranceContentEditor, { FieldDef } from "../InsuranceContentEditor";

const MAX_FIELDS: FieldDef[] = [
  { section: "hero", field: "h", label: "Hero — Tiêu đề chính", defaultEn: "WHAT IS MAX FUNDED IUL SECRETS?", defaultVi: "MAX FUNDED IUL SECRETS LÀ GÌ?" },
  { section: "hero", field: "cta", label: "Hero — Nút bấm", defaultEn: "REGISTER NOW", defaultVi: "ĐĂNG KÝ NGAY" },
  { section: "hero", field: "desc", label: "Hero — Mô tả (phần đầu)", defaultEn: "Max-Funded IUL Secrets is a powerful, safe investment program — integrated with life insurance. With the aim of helping participants receive an average of", defaultVi: "Max-Funded IUL Secrets là chương trình đầu tư mạnh mẽ, an toàn — tích hợp với bảo hiểm nhân thọ. Với mục tiêu giúp người tham gia nhận trung bình", multiline: true, rows: 2 },
  { section: "hero", field: "amount", label: "Hero — Số tiền nổi bật", defaultEn: "$50,000 per year", defaultVi: "$50,000 mỗi năm" },
  { section: "hero", field: "desc2", label: "Hero — Mô tả (phần sau)", defaultEn: ", received continuously for 20 consecutive years, tax-free.", defaultVi: ", nhận liên tục trong 20 năm liên tiếp, hoàn toàn miễn thuế." },
  { section: "sections", field: "reasons_h1", label: "Tiêu đề mục Lý do", defaultEn: "9 REASONS WHY YOU SHOULD JOIN", defaultVi: "9 LÝ DO TẠI SAO BẠN NÊN THAM GIA" },
  { section: "cta", field: "h", label: "CTA cuối trang — Tiêu đề", defaultEn: "Ready to Secure Your Retirement?", defaultVi: "Sẵn Sàng Bảo Vệ Hưu Trí Của Bạn?" },
  { section: "cta", field: "sub", label: "CTA cuối trang — Phụ đề", defaultEn: "Get a free consultation with our expert agents today.", defaultVi: "Nhận tư vấn miễn phí từ chuyên gia của chúng tôi ngay hôm nay." },
];

export default async function MaxIULPage() {
  const supabase = await createClient();
  const [{ data: reasons }, { data: contentRows }] = await Promise.all([
    supabase
      .from("max_iul_reasons")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("page_content")
      .select("page, section, field, value_en, value_vi")
      .eq("page", "insurance_max_iul"),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/insurance" className="hover:text-slate-700">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">Max-Funded IUL</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp size={22} className="text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-800">
            Max-Funded IUL — Lý do chọn
          </h1>
        </div>
        <Link
          href="/insurance/max-iul/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} /> Thêm mới
        </Link>
      </div>

      <InsuranceContentEditor
        pageKey="insurance_max_iul"
        title="Nội dung trang Max-Funded IUL (Hero, Tiêu đề, CTA)"
        fields={MAX_FIELDS}
        initialRows={contentRows ?? []}
      />

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-16">
                Số
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
                <td className="px-4 py-3">
                  <span className="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {r.num}
                  </span>
                </td>
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
                      href={`/insurance/max-iul/${r.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <MaxReasonActions reason={r} />
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
