import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Zap, ChevronRight, Plus } from "lucide-react";
import InsuranceContentEditor, { FieldDef } from "../InsuranceContentEditor";

const IUL_FIELDS: FieldDef[] = [
  { section: "hero", field: "sub", label: "Hero — Nhãn phụ", defaultEn: "IUL SECRETS", defaultVi: "IUL SECRETS" },
  { section: "hero", field: "h1", label: "Hero — Tiêu đề chính (Dòng 1)", defaultEn: "THE KEY TO YOUR", defaultVi: "CHÌA KHÓA CHO" },
  { section: "hero", field: "h2", label: "Hero — Tiêu đề phụ (Dòng 2)", defaultEn: "FINANCIAL FUTURE", defaultVi: "TƯƠNG LAI TÀI CHÍNH CỦA BẠN" },
  { section: "hero", field: "cta", label: "Hero — Nút bấm", defaultEn: "DISCOVER MORE", defaultVi: "KHÁM PHÁ NGAY" },
  { section: "sections", field: "reasons_h1", label: "Tiêu đề mục Lý do", defaultEn: "6 REASONS TO JOIN", defaultVi: "6 LÝ DO NÊN THAM GIA" },
  { section: "sections", field: "diseases_h1", label: "Tiêu đề mục Bệnh bảo hiểm", defaultEn: "Over 16 Types of Diseases and Injuries Covered", defaultVi: "Hơn 16 Loại Bệnh và Chấn Thương Được Bảo Hiểm" },
  { section: "sections", field: "diseases_sub", label: "Phụ đề mục Bệnh bảo hiểm", defaultEn: "in the program's policy", defaultVi: "trong chính sách của chương trình" },
  { section: "sections", field: "steps_h1", label: "Tiêu đề mục Các bước", defaultEn: "3 SIMPLE STEPS TO JOIN", defaultVi: "3 BƯỚC ĐƠN GIẢN ĐỂ THAM GIA" },
  { section: "sections", field: "faq_h1", label: "Tiêu đề mục FAQ", defaultEn: "FAQ – Some Questions You Are Wondering", defaultVi: "FAQ – Những Câu Hỏi Bạn Đang Thắc Mắc" },
  { section: "cta", field: "h1", label: "CTA cuối trang — Tiêu đề", defaultEn: "Get a Free Consultation Today", defaultVi: "Nhận Tư Vấn Miễn Phí Ngay Hôm Nay" },
];

export default async function IULPage() {
  const supabase = await createClient();

  const [
    { count: reasonsCount },
    { count: stepsCount },
    { count: faqsCount },
    { data: contentRows },
  ] = await Promise.all([
    supabase.from("iul_reasons").select("*", { count: "exact", head: true }),
    supabase.from("iul_steps").select("*", { count: "exact", head: true }),
    supabase.from("iul_faqs").select("*", { count: "exact", head: true }),
    supabase
      .from("page_content")
      .select("page, section, field, value_en, value_vi")
      .eq("page", "insurance_iul"),
  ]);

  const sections = [
    {
      href: "/insurance/iul/reasons",
      label: "Lý do chọn IUL",
      desc: "Các lợi ích & lý do nổi bật",
      count: reasonsCount ?? 0,
      color: "bg-blue-50 text-blue-600",
    },
    {
      href: "/insurance/iul/steps",
      label: "Các bước",
      desc: "Quy trình từng bước",
      count: stepsCount ?? 0,
      color: "bg-purple-50 text-purple-600",
    },
    {
      href: "/insurance/iul/faqs",
      label: "FAQs",
      desc: "Câu hỏi thường gặp",
      count: faqsCount ?? 0,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-0">
        <Link href="/insurance" className="hover:text-slate-700">
          Bảo hiểm
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">IUL Secrets</span>
      </div>
      <div className="flex items-center gap-3">
        <Zap size={22} className="text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">IUL Secrets</h1>
      </div>

      <InsuranceContentEditor
        pageKey="insurance_iul"
        title="Nội dung trang IUL Secrets (Hero, Tiêu đề, CTA)"
        fields={IUL_FIELDS}
        initialRows={contentRows ?? []}
      />

      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.href}
            className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-slate-400">{s.count} mục</span>
              <Link
                href={`${s.href}/new`}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus size={12} /> Thêm
              </Link>
              <Link
                href={s.href}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Quản lý <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
