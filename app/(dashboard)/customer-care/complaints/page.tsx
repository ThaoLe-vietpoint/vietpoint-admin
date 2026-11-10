import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { AlertCircle, ExternalLink, ArrowLeft, Phone, Mail, CheckCircle2, Circle, Clock, MessageSquare } from "lucide-react";
import ComplaintsTable from "./ComplaintsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ComplaintsPage() {
  const supabase = await createClient();

  const { data: allLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  // Filter complaints
  const complaints = (allLeads ?? []).filter(
    (l) =>
      l.source === "complaint_resolution_form" ||
      (l.message && l.message.includes("[KHIẾU NẠI"))
  );

  const total = complaints.length;
  const pending = complaints.filter((c) => !c.processed).length;
  const done = complaints.filter((c) => c.processed).length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/customer-care"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              Chăm sóc khách hàng
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Khiếu nại & Giải quyết vấn đề
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Danh sách phiếu yêu cầu hỗ trợ sai sót hóa đơn, quyền lợi từ chối gửi từ trang /customer-care/complaints
          </p>
        </div>
        <a
          href="http://localhost:3000/customer-care/complaints"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <ExternalLink size={14} />
          Xem form trên Web
        </a>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <MessageSquare size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tổng số phiếu</p>
            <p className="text-lg font-bold text-slate-800">{total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Circle size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Chưa xử lý</p>
            <p className="text-lg font-bold text-amber-600">{pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Đã giải quyết</p>
            <p className="text-lg font-bold text-emerald-600">{done}</p>
          </div>
        </div>
      </div>

      {/* Complaints Table Component */}
      <ComplaintsTable initialComplaints={complaints} />
    </div>
  );
}
