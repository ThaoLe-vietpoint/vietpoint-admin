import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight, Baby } from "lucide-react";
import BenefitActions from "./BenefitActions";
import InsuranceContentEditor, { FieldDef } from "../InsuranceContentEditor";

const KID_FIELDS: FieldDef[] = [
  { section: "hero", field: "title", label: "Hero — Tiêu đề chính", defaultEn: "IUL For Kids (EBTP)", defaultVi: "IUL Cho Trẻ Em (EBTP)" },
  { section: "hero", field: "cta", label: "Hero — Nút bấm", defaultEn: "Get Free Quote", defaultVi: "Nhận Báo Giá Miễn Phí" },
  { section: "hero", field: "desc", label: "Hero — Mô tả", defaultEn: "Protect your children and build a financial fund for them to enter university, giving them wings to fly far and higher at the age of 18.", defaultVi: "Bảo vệ con bạn và xây dựng quỹ tài chính cho con vào đại học, cho con đôi cánh để bay xa hơn ở tuổi 18.", multiline: true, rows: 2 },
  { section: "how", field: "h", label: "Mục Cách hoạt động — Tiêu đề", defaultEn: "How It Works", defaultVi: "Cách Thức Hoạt Động" },
  { section: "how", field: "desc", label: "Mục Cách hoạt động — Mô tả", defaultEn: "IUL For Kids (EBTP — Educational Benefits Trust Program) is a specially designed Indexed Universal Life insurance policy for children. Parents start the policy early, premiums grow with the market, and by age 18 your child has a tax-free fund ready for college or life expenses.", defaultVi: "IUL For Kids (EBTP — Chương trình Tín thác Phúc lợi Giáo dục) là hợp đồng bảo hiểm nhân thọ toàn cầu có chỉ số được thiết kế đặc biệt cho trẻ em. Cha mẹ bắt đầu hợp đồng sớm, phí bảo hiểm tăng theo thị trường và đến năm 18 tuổi, con bạn có quỹ miễn thuế sẵn sàng cho đại học hoặc chi phí cuộc sống.", multiline: true, rows: 3 },
  { section: "sections", field: "benefits_h", label: "Tiêu đề mục Quyền lợi", defaultEn: "Key Benefits", defaultVi: "Các Lợi Ích Chính" },
  { section: "cta", field: "h", label: "CTA cuối trang — Tiêu đề", defaultEn: "Give Your Child the Gift of Financial Security", defaultVi: "Tặng Con Bạn Nền Tảng Tài Chính Vững Chắc" },
  { section: "cta", field: "sub", label: "CTA cuối trang — Phụ đề", defaultEn: "Start your child's IUL policy today. Consultation is free.", defaultVi: "Bắt đầu hợp đồng IUL cho con ngay hôm nay. Tư vấn hoàn toàn miễn phí." },
];

export default async function KidIULPage() {
  const supabase = await createClient();
  const [{ data: benefits }, { data: contentRows }] = await Promise.all([
    supabase
      .from("kid_iul_benefits")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("page_content")
      .select("page, section, field, value_en, value_vi")
      .eq("page", "insurance_kid_iul"),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/insurance" className="hover:text-slate-700">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">IUL Cho Trẻ</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Baby size={22} className="text-pink-600" />
          <h1 className="text-xl font-bold text-slate-800">
            IUL Cho Trẻ — Quyền lợi
          </h1>
        </div>
        <Link
          href="/insurance/kid-iul/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} /> Thêm mới
        </Link>
      </div>

      <InsuranceContentEditor
        pageKey="insurance_kid_iul"
        title="Nội dung trang IUL Cho Trẻ (Hero, Mô tả, CTA)"
        fields={KID_FIELDS}
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
                      href={`/insurance/kid-iul/${b.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <BenefitActions benefit={b} table="kid_iul_benefits" />
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
