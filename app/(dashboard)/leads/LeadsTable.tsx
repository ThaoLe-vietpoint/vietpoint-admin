"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Mail,
  Phone,
  X,
  Calendar,
  MapPin,
  User,
  FileText,
  MessageSquare,
  CheckCircle2,
  Circle,
  Trash2,
  Filter,
} from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  processed: boolean;
  created_at: string;
};

type FilterType = "all" | "pending" | "done";

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chưa xử lý" },
  { key: "done", label: "Đã xử lý" },
];

function parseMessage(message: string): Record<string, string> {
  if (!message) return {};
  const result: Record<string, string> = {};
  message.split(" | ").forEach((part) => {
    const idx = part.indexOf(": ");
    if (idx !== -1) {
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 2).trim();
      result[key] = val;
    } else {
      result["Nội dung"] = part.trim();
    }
  });
  return result;
}

const KEY_ICONS: Record<string, React.ReactNode> = {
  "Đã tham gia": <User size={13} />,
  Joined: <User size={13} />,
  "Yêu cầu": <FileText size={13} />,
  Request: <FileText size={13} />,
  "Câu hỏi": <MessageSquare size={13} />,
  Question: <MessageSquare size={13} />,
  "Ngày sinh": <Calendar size={13} />,
  DOB: <Calendar size={13} />,
  "Giới tính": <User size={13} />,
  Gender: <User size={13} />,
  "Tiểu bang": <MapPin size={13} />,
  State: <MapPin size={13} />,
  "Hợp đồng": <FileText size={13} />,
  Policy: <FileText size={13} />,
  "Green Card": <FileText size={13} />,
};

function LeadDialog({
  lead,
  onClose,
  onToggle,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const parsed = parseMessage(lead.message);
  const entries = Object.entries(parsed);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {lead.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{lead.name || "—"}</p>
              <p className="text-xs text-slate-400">
                {new Date(lead.created_at).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contact info */}
        <div className="px-6 py-4 space-y-2 border-b border-slate-100">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Phone size={14} className="text-slate-400 shrink-0" />
              {lead.phone}
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Mail size={14} className="text-slate-400 shrink-0" />
              {lead.email}
            </a>
          )}
        </div>

        {/* Parsed message fields */}
        {entries.length > 0 && (
          <div className="px-6 py-4 space-y-3 max-h-60 overflow-y-auto border-b border-slate-100">
            {entries.map(([key, val]) => (
              <div key={key}>
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-0.5">
                  {KEY_ICONS[key] ?? <FileText size={13} />}
                  {key}
                </p>
                <p className="text-sm text-slate-700 wrap-break-word">{val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 space-y-3">
          <div className="flex gap-2">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: "#2F5E9E" }}
              >
                <Phone size={14} />
                Gọi ngay
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Mail size={14} />
                Gửi email
              </a>
            )}
          </div>

          {/* Toggle status */}
          <button
            onClick={() => onToggle(lead.id, lead.processed)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl border transition-colors ${
              lead.processed
                ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {lead.processed ? (
              <><Circle size={15} /> Đánh dấu chưa xử lý</>
            ) : (
              <><CheckCircle2 size={15} /> Đánh dấu đã xử lý</>
            )}
          </button>

          {/* Delete */}
          {confirmDelete ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(lead.id)}
                className="flex-1 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Xác nhận xoá
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 text-sm font-semibold bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Huỷ
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-500 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} />
              Xoá liên hệ này
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LeadsTable({ leads: initial }: { leads: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initial);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = leads.filter((l) => {
    if (filter === "pending") return !l.processed;
    if (filter === "done") return l.processed;
    return true;
  });

  async function handleToggle(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("leads").update({ processed: !current }).eq("id", id);
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, processed: !current } : l))
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, processed: !current } : prev
    );
    router.refresh();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("leads").delete().eq("id", id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected(null);
    router.refresh();
  }

  const counts = {
    all: leads.length,
    pending: leads.filter((l) => !l.processed).length,
    done: leads.filter((l) => l.processed).length,
  };

  return (
    <>
      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
        <Filter size={14} className="text-slate-400 shrink-0" />
        <div className="flex gap-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === tab.key
                  ? "bg-[#2F5E9E] text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-14 text-center text-slate-400 text-sm">
          Không có liên hệ nào
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Khách hàng
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                  Điện thoại
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                  Tin nhắn
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ngày
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Trạng thái
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                    lead.processed ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {lead.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="font-medium text-slate-800">
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {lead.phone ? (
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Phone size={13} className="text-slate-400" />
                        {lead.phone}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {lead.email ? (
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Mail size={13} className="text-slate-400" />
                        {lead.email}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {lead.message ? (
                      <p className="text-slate-500 text-xs max-w-xs truncate">
                        {lead.message}
                      </p>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    {lead.processed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        Đã xử lý
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                        <Circle size={11} />
                        Chưa xử lý
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(lead.id, lead.processed);
                      }}
                      title={lead.processed ? "Đánh dấu chưa xử lý" : "Đánh dấu đã xử lý"}
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                        lead.processed
                          ? "text-slate-400 hover:bg-slate-100"
                          : "text-emerald-500 hover:bg-emerald-50"
                      }`}
                    >
                      {lead.processed ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <LeadDialog
          lead={selected}
          onClose={() => setSelected(null)}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
