import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Zap, ChevronRight, Plus } from "lucide-react";
import InsuranceContentEditor, { FieldDef } from "../InsuranceContentEditor";

const IUL_FIELDS: FieldDef[] = [
  { section: "hero", field: "sub", label: "Hero — Nhãn phụ", defaultEn: "MEDICARE", defaultVi: "MEDICARE" },
  { section: "hero", field: "h1", label: "Hero — Tiêu đề chính (Dòng 1)", defaultEn: "UNDERSTAND YOUR", defaultVi: "TÌM HIỂU CÁC LỰA CHỌN" },
  { section: "hero", field: "h2", label: "Hero — Tiêu đề phụ (Dòng 2)", defaultEn: "MEDICARE OPTIONS", defaultVi: "BẢO HIỂM MEDICARE" },
  { section: "hero", field: "cta", label: "Hero — Nút bấm", defaultEn: "GET MEDICARE HELP", defaultVi: "NHẬN HỖ TRỢ MEDICARE" },
  { section: "sections", field: "reasons_h1", label: "Tiêu đề mục Lý do (Tìm Hiểu Về Medicare)", defaultEn: "WHY CHOOSE VIETPOINT", defaultVi: "TÌM HIỂU VỀ MEDICARE" },
  { section: "sections", field: "diseases_h1", label: "Tiêu đề mục Bệnh bảo hiểm / Quyền lợi", defaultEn: "MEDICARE BENEFITS & SUPPORT", defaultVi: "QUYỀN LỢI & HỖ TRỢ MEDICARE" },
  { section: "quote", field: "h1", label: "Mục Báo giá — Tiêu đề dòng 1", defaultEn: "GET PERSONALIZED", defaultVi: "NHẬN HƯỚNG DẪN" },
  { section: "quote", field: "h2", label: "Mục Báo giá — Tiêu đề dòng 2", defaultEn: "MEDICARE GUIDANCE", defaultVi: "MEDICARE THEO NHU CẦU" },
  { section: "quote", field: "or", label: "Mục Báo giá — Dòng gọi trực tiếp", defaultEn: "Or call us directly", defaultVi: "Hoặc gọi trực tiếp cho chúng tôi" },
  { section: "sections", field: "steps_h1", label: "Tiêu đề mục Các bước", defaultEn: "3 SIMPLE STEPS TO GET STARTED", defaultVi: "QUY TRÌNH LÀM VIỆC VỚI VIETPOINT" },
  { section: "sections", field: "faq_h1", label: "Tiêu đề mục FAQ", defaultEn: "MEDICARE FAQs", defaultVi: "CÂU HỎI THƯỜNG GẶP VỀ MEDICARE" },
  { section: "cta", field: "h1", label: "CTA cuối trang — Tiêu đề", defaultEn: "Get Help Understanding Your Medicare Options", defaultVi: "Nhận Hỗ Trợ Tìm Hiểu Các Lựa Chọn Medicare Của Bạn" },
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
      label: "Tìm Hiểu Về Medicare",
      desc: "Các nội dung giới thiệu & quyền lợi Medicare",
      count: reasonsCount ?? 0,
      color: "bg-blue-50 text-blue-600",
    },
    {
      href: "/insurance/iul/steps",
      label: "Quy trình làm việc với VietPoint",
      desc: "Các bước tư vấn, đăng ký & hỗ trợ",
      count: stepsCount ?? 0,
      color: "bg-purple-50 text-purple-600",
    },
    {
      href: "/insurance/iul/faqs",
      label: "FAQs",
      desc: "Câu hỏi thường gặp về Medicare",
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
        <span className="text-slate-700">Medicare</span>
      </div>
      <div className="flex items-center gap-3">
        <Zap size={22} className="text-blue-600" />
        <h1 className="text-xl font-bold text-slate-800">Medicare</h1>
      </div>

      <InsuranceContentEditor
        pageKey="insurance_iul"
        title="Nội dung trang Medicare (Hero, Tiêu đề, CTA)"
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
