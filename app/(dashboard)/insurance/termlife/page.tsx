import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight, Clock } from "lucide-react";
import BenefitActions from "../kid-iul/BenefitActions";
import InsuranceContentEditor, { FieldDef } from "../InsuranceContentEditor";

const TERMLIFE_FIELDS: FieldDef[] = [
  { section: "hero", field: "title", label: "Hero — Tiêu đề chính", defaultEn: "TERM LIFE INSURANCE", defaultVi: "BẢO HIỂM KỲ HẠN (TERM LIFE)" },
  { section: "hero", field: "cta", label: "Hero — Nút bấm", defaultEn: "Get Free Quote", defaultVi: "Nhận Báo Giá Miễn Phí" },
  { section: "hero", field: "desc", label: "Hero — Mô tả", defaultEn: "Affordable protection for you and your family — covering over 16 critical illnesses with terms up to 30 years.", defaultVi: "Bảo vệ giá cả phải chăng cho bạn và gia đình — bao gồm hơn 16 bệnh nguy kịch với thời hạn lên đến 30 năm.", multiline: true, rows: 2 },
  { section: "sections", field: "benefits_h", label: "Tiêu đề mục Quyền lợi", defaultEn: "Why Choose Term Life?", defaultVi: "Tại Sao Chọn Bảo Hiểm Kỳ Hạn?" },
  { section: "sections", field: "compare_h", label: "Tiêu đề bảng So sánh", defaultEn: "Term Life vs. IUL — Which is Right for You?", defaultVi: "Term Life vs. IUL — Loại Nào Phù Hợp Với Bạn?" },
  { section: "cta", field: "h", label: "CTA cuối trang — Tiêu đề", defaultEn: "Get Your Free Term Life Quote", defaultVi: "Nhận Báo Giá Bảo Hiểm Kỳ Hạn Miễn Phí" },
  { section: "cta", field: "sub", label: "CTA cuối trang — Phụ đề", defaultEn: "Our agents are ready to find the most suitable Term Life plan for your family. Contact us today — consultation is completely free.", defaultVi: "Chuyên viên của chúng tôi sẵn sàng tìm gói Term Life phù hợp nhất cho gia đình bạn. Liên hệ ngay — tư vấn hoàn toàn miễn phí.", multiline: true, rows: 2 },
];

export default async function TermLifePage() {
  const supabase = await createClient();
  const [{ data: benefits }, { data: contentRows }] = await Promise.all([
    supabase
      .from("termlife_benefits")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("page_content")
      .select("page, section, field, value_en, value_vi")
      .eq("page", "insurance_termlife"),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/insurance" className="hover:text-slate-700">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">Term Life</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock size={22} className="text-orange-600" />
          <h1 className="text-xl font-bold text-slate-800">
            Term Life — Quyền lợi
          </h1>
        </div>
        <Link
          href="/insurance/termlife/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} /> Thêm mới
        </Link>
      </div>

      <InsuranceContentEditor
        pageKey="insurance_termlife"
        title="Nội dung trang Term Life (Hero, Tiêu đề, CTA)"
        fields={TERMLIFE_FIELDS}
        initialRows={contentRows ?? []}
      />

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
            {(benefits ?? []).map((b) => (
              <tr
                key={b.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-xl">{b.icon}</td>
                <td className="px-4 py-3 text-slate-800 font-medium">
                  <div>{(b as any).title_en || (b as any).title_vi || (b as any).title || <span className="text-slate-300 italic text-xs">—</span>}</div>
                  {(b as any).title_vi && (b as any).title_en && <div className="text-slate-400 text-xs mt-0.5">{(b as any).title_vi}</div>}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell max-w-xs truncate">
                  {(b as any).description_en || (b as any).description_vi || (b as any).description}
                </td>
                <td className="px-4 py-3 text-slate-500 text-center">
                  {b.sort_order}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {b.active ? "Hiện" : "Ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Link
                      href={`/insurance/termlife/${b.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
