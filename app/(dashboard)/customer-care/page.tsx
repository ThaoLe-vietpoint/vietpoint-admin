import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import {
  Phone,
  HelpCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Clock,
  ShieldAlert,
  Headphones,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerCarePage() {
  const supabase = await createClient();

  // Count complaints from leads table
  const { data: complaints } = await supabase
    .from("leads")
    .select("id, processed")
    .eq("source", "complaint_resolution_form");

  const totalComplaints = complaints?.length ?? 0;
  const pendingComplaints = complaints?.filter((c) => !c.processed).length ?? 0;

  const sections = [
    {
      href: "/customer-care/support",
      webHref: "http://localhost:3000/customer-care/support",
      icon: Headphones,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      label: "Hỗ trợ khách hàng",
      desc: "Quản lý kênh hotline tư vấn, hotline CSKH, email hỗ trợ, giờ làm việc và 4 chủ đề tư vấn chính.",
      countLabel: "Kênh & Giờ hỗ trợ",
    },
    {
      href: "/customer-care/faqs",
      webHref: "http://localhost:3000/customer-care/faqs",
      icon: HelpCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      label: "Câu hỏi thường gặp (FAQs)",
      desc: "Quản lý các câu hỏi thường gặp về Bảo hiểm ACA, Medicare, Medicaid, Bảo hiểm xe hơi và Quy trình hồ sơ.",
      countLabel: "4 nhóm danh mục",
    },
    {
      href: "/customer-care/documents",
      webHref: "http://localhost:3000/customer-care/documents",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      label: "Hướng dẫn giấy tờ",
      desc: "Quản lý 5 phần hướng dẫn: Giấy tờ cần lưu ý, Cách đọc thư bảo hiểm, Medical Bill, EOB và Verification Notice.",
      countLabel: "5 bài hướng dẫn",
    },
    {
      href: "/customer-care/complaints",
      webHref: "http://localhost:3000/customer-care/complaints",
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      label: "Khiếu nại & Giải quyết vấn đề",
      desc: "Tiếp nhận và xử lý yêu cầu hỗ trợ sai sót hóa đơn, từ chối quyền lợi hoặc khiếu nại gửi từ khách hàng.",
      badge: pendingComplaints > 0 ? `${pendingComplaints} chờ xử lý` : undefined,
      badgeColor: "bg-red-100 text-red-700 font-bold",
      countLabel: `${totalComplaints} phiếu tiếp nhận`,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Chăm sóc khách hàng
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Đồng bộ 4 mục chính tương ứng với trang Chăm sóc khách hàng trên Website
          </p>
        </div>
        <a
          href="http://localhost:3000/customer-care"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <ExternalLink size={14} />
          Xem trang CSKH trên Web
        </a>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Headphones size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Kênh hỗ trợ</p>
            <p className="text-lg font-bold text-slate-800">Hotline & Email</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <HelpCircle size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">FAQs & Giấy tờ</p>
            <p className="text-lg font-bold text-slate-800">Đầy đủ 2 ngôn ngữ</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Phiếu khiếu nại</p>
            <p className="text-lg font-bold text-slate-800">
              {totalComplaints}{" "}
              <span className="text-xs font-normal text-red-600">
                ({pendingComplaints} chưa xử lý)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main 4 Sections matching Web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.href}
              className={`bg-white rounded-2xl border ${sec.border} p-6 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${sec.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={20} className={sec.color} />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-base">
                        {sec.label}
                      </h2>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {sec.countLabel}
                      </span>
                    </div>
                  </div>
                  {sec.badge && (
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${sec.badgeColor}`}
                    >
                      {sec.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <a
                  href={sec.webHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 transition-colors"
                >
                  <ExternalLink size={12} />
                  Xem trên Web
                </a>
                <Link
                  href={sec.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                >
                  Quản lý nội dung
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
