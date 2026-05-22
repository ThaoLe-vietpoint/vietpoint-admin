"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  X,
  Calendar,
  MapPin,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  created_at: string;
};

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

function LeadDialog({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const parsed = parseMessage(lead.message);
  const entries = Object.entries(parsed);

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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
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
          <div className="px-6 py-4 space-y-3 max-h-72 overflow-y-auto">
            {entries.map(([key, val]) => (
              <div key={key}>
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-0.5">
                  {KEY_ICONS[key] ?? <FileText size={13} />}
                  {key}
                </p>
                <p className="text-sm text-slate-700 break-words">{val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 flex gap-2">
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
      </div>
    </div>
  );
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Lead | null>(null);

  return (
    <>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <LeadDialog lead={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
