import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronRight, Baby } from "lucide-react";
import BenefitActions from "./BenefitActions";
import InsuranceContentEditor, { FieldDef } from "../InsuranceContentEditor";

const KID_FIELDS: FieldDef[] = [
  { section: "hero", field: "title", label: "Hero — Tiêu đề chính", defaultEn: "ACA Marketplace Health Insurance", defaultVi: "Bảo Hiểm Sức Khỏe ACA Marketplace" },
  { section: "hero", field: "cta", label: "Hero — Nút bấm", defaultEn: "Get Free Quote", defaultVi: "Nhận Tư Vấn Miễn Phí" },
  { section: "hero", field: "desc", label: "Hero — Mô tả", defaultEn: "Explore ACA Marketplace health insurance options with Vietnamese-language support. VietPoint helps you understand coverage, estimated costs, and available financial assistance based on your circumstances.", defaultVi: "Tìm hiểu các lựa chọn bảo hiểm sức khỏe ACA Marketplace với sự hỗ trợ bằng tiếng Việt. VietPoint giúp bạn hiểu rõ quyền lợi, chi phí dự kiến và khả năng đủ điều kiện nhận hỗ trợ tài chính tùy theo hoàn cảnh.", multiline: true, rows: 3 },
  { section: "how", field: "h", label: "Mục Cách hoạt động — Tiêu đề", defaultEn: "How It Works", defaultVi: "Quy Trình Hỗ Trợ" },
  { section: "how", field: "desc", label: "Mục Cách hoạt động — Mô tả", defaultEn: "VietPoint guides you through the ACA Marketplace enrollment process, from understanding your needs and reviewing available plans to completing your application and receiving enrollment confirmation.", defaultVi: "VietPoint đồng hành cùng bạn trong quá trình đăng ký ACA Marketplace, từ tìm hiểu nhu cầu, xem xét các chương trình hiện có đến hoàn tất hồ sơ và nhận xác nhận đăng ký.", multiline: true, rows: 3 },
  { section: "how", field: "step1_title", label: "Bước 01 — Tiêu đề", defaultEn: "Free Consultation", defaultVi: "Tư vấn miễn phí" },
  { section: "how", field: "step1_desc", label: "Bước 01 — Mô tả", defaultEn: "Contact VietPoint and tell us about your household, healthcare needs, and estimated income.", defaultVi: "Liên hệ VietPoint và chia sẻ thông tin hộ gia đình, nhu cầu chăm sóc sức khỏe và thu nhập dự kiến.", multiline: true, rows: 2 },
  { section: "how", field: "step2_title", label: "Bước 02 — Tiêu đề", defaultEn: "Review Your Options", defaultVi: "Xem xét các lựa chọn" },
  { section: "how", field: "step2_desc", label: "Bước 02 — Mô tả", defaultEn: "Review available plans, estimated premiums, deductibles, provider networks, and potential financial assistance.", defaultVi: "Xem xét các chương trình hiện có, phí bảo hiểm dự kiến, khoản khấu trừ, mạng lưới bác sĩ và khả năng nhận hỗ trợ tài chính.", multiline: true, rows: 2 },
  { section: "how", field: "step3_title", label: "Bước 03 — Tiêu đề", defaultEn: "Complete Your Application", defaultVi: "Hoàn tất hồ sơ đăng ký" },
  { section: "how", field: "step3_desc", label: "Bước 03 — Mô tả", defaultEn: "Provide the required information and complete your Marketplace application with guidance from your agent.", defaultVi: "Cung cấp thông tin cần thiết và hoàn tất hồ sơ Marketplace với sự hướng dẫn của tư vấn viên.", multiline: true, rows: 2 },
  { section: "how", field: "step4_title", label: "Bước 04 — Tiêu đề", defaultEn: "Enrollment Confirmation", defaultVi: "Xác nhận đăng ký" },
  { section: "how", field: "step4_desc", label: "Bước 04 — Mô tả", defaultEn: "Review your enrollment confirmation and follow any instructions provided by the insurance company, including premium payment if required.", defaultVi: "Kiểm tra xác nhận đăng ký và thực hiện các hướng dẫn từ công ty bảo hiểm, bao gồm thanh toán phí nếu được yêu cầu.", multiline: true, rows: 2 },
  { section: "how", field: "step5_title", label: "Bước 05 — Tiêu đề", defaultEn: "Ongoing Support", defaultVi: "Hỗ trợ sau đăng ký" },
  { section: "how", field: "step5_desc", label: "Bước 05 — Mô tả", defaultEn: "Contact VietPoint if you have questions about your coverage, premium payments, medical bills, or updating your Marketplace information.", defaultVi: "Liên hệ VietPoint nếu bạn có thắc mắc về quyền lợi bảo hiểm, thanh toán phí, hóa đơn y tế hoặc cập nhật thông tin Marketplace.", multiline: true, rows: 2 },
  { section: "cta", field: "h", label: "CTA cuối trang — Tiêu đề", defaultEn: "Get Help Finding the Right Coverage", defaultVi: "Nhận Hỗ Trợ Tìm Bảo Hiểm Phù Hợp" },
  { section: "cta", field: "sub", label: "CTA cuối trang — Phụ đề", defaultEn: "Contact VietPoint today for free consultation in Vietnamese.", defaultVi: "Liên hệ VietPoint ngay hôm nay để được tư vấn hoàn toàn miễn phí bằng tiếng Việt." },
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
        <span className="text-slate-700">ACA Marketplace</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Baby size={22} className="text-pink-600" />
          <h1 className="text-xl font-bold text-slate-800">
            ACA Marketplace — Quyền lợi
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
        title="Nội dung trang ACA Marketplace (Hero, Quy trình 5 bước, CTA)"
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
