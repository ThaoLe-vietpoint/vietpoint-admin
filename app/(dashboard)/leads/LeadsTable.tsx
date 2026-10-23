"use client";
import { useState, useMemo } from "react";
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
  Search,
  RotateCcw,
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
  Age: <User size={13} />,
  "Savings/mo": <FileText size={13} />,
  Protect: <FileText size={13} />,
};

function formatSource(source?: string): { label: string; cls: string } {
  switch (source) {
    case "medicare_quote_form":
    case "iul_quote_form":
      return {
        label: "Form Medicare / IUL",
        cls: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "quote_form":
    case "home_quote":
      return {
        label: "Báo giá Trang chủ",
        cls: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "chat_widget":
      return {
        label: "Chat Widget",
        cls: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "calculator":
    case "fee_calculator":
      return {
        label: "Tính phí BH",
        cls: "bg-teal-50 text-teal-700 border-teal-200",
      };
    default:
      return {
        label: "Trang Liên hệ",
        cls: "bg-slate-100 text-slate-600 border-slate-200",
      };
  }
}

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
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800">{lead.name || "—"}</p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${formatSource(lead.source).cls}`}
                >
                  {formatSource(lead.source).label}
                </span>
              </div>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<"all" | "today" | "7d" | "30d" | "custom">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Extract unique states from messages
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      const parsed = parseMessage(l.message);
      const st = parsed["Tiểu bang"] || parsed["State"];
      if (st) set.add(st);
    });
    return Array.from(set).sort();
  }, [leads]);

  const hasActiveFilters =
    filter !== "all" ||
    searchQuery.trim() !== "" ||
    sourceFilter !== "all" ||
    topicFilter !== "all" ||
    stateFilter !== "all" ||
    dateRange !== "all" ||
    sortBy !== "newest";

  const resetFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setSourceFilter("all");
    setTopicFilter("all");
    setStateFilter("all");
    setDateRange("all");
    setFromDate("");
    setToDate("");
    setSortBy("newest");
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return leads
      .filter((l) => {
        // 1. Status filter
        if (filter === "pending" && l.processed) return false;
        if (filter === "done" && !l.processed) return false;

        // 2. Source filter
        if (sourceFilter !== "all") {
          const s = l.source || "contact_form";
          if (sourceFilter === "medicare" && s !== "medicare_quote_form" && s !== "iul_quote_form") return false;
          if (sourceFilter === "contact" && s !== "contact_form") return false;
          if (sourceFilter === "home" && s !== "quote_form" && s !== "home_quote") return false;
          if (sourceFilter === "chat" && s !== "chat_widget") return false;
        }

        // 3. Topic / Product / Request filter
        if (topicFilter !== "all") {
          const msgLower = (l.message || "").toLowerCase();
          const srcLower = (l.source || "").toLowerCase();
          if (topicFilter === "medicare") {
            if (!msgLower.includes("medicare") && !msgLower.includes("iul") && !srcLower.includes("medicare") && !srcLower.includes("iul")) return false;
          } else if (topicFilter === "aca") {
            if (!msgLower.includes("aca") && !msgLower.includes("marketplace") && !msgLower.includes("kid-iul")) return false;
          } else if (topicFilter === "auto") {
            if (!msgLower.includes("auto") && !msgLower.includes("xe") && !msgLower.includes("termlife")) return false;
          } else if (topicFilter === "consult") {
            if (!msgLower.includes("tư vấn sản phẩm") && !msgLower.includes("product consultation")) return false;
          } else if (topicFilter === "info") {
            if (!msgLower.includes("hỗ trợ thông tin") && !msgLower.includes("information support")) return false;
          } else if (topicFilter === "billing") {
            if (!msgLower.includes("địa chỉ thanh toán") && !msgLower.includes("billing address")) return false;
          } else if (topicFilter === "feedback") {
            if (!msgLower.includes("phản hồi") && !msgLower.includes("khiếu nại") && !msgLower.includes("feedback") && !msgLower.includes("complaint")) return false;
          }
        }

        // 4. State filter
        if (stateFilter !== "all") {
          const parsed = parseMessage(l.message);
          const st = parsed["Tiểu bang"] || parsed["State"] || "";
          if (st !== stateFilter) return false;
        }

        // 5. Date range filter
        if (dateRange !== "all") {
          const createdMs = new Date(l.created_at).getTime();
          if (dateRange === "today" && createdMs < startOfToday) return false;
          if (dateRange === "7d" && createdMs < now.getTime() - 7 * 86400000) return false;
          if (dateRange === "30d" && createdMs < now.getTime() - 30 * 86400000) return false;
          if (dateRange === "custom") {
            if (fromDate) {
              const fromMs = new Date(fromDate + "T00:00:00").getTime();
              if (createdMs < fromMs) return false;
            }
            if (toDate) {
              const toMs = new Date(toDate + "T23:59:59").getTime();
              if (createdMs > toMs) return false;
            }
          }
        }

        // 6. Keyword search (name, phone, email, message, source)
        if (q) {
          const hay = [
            l.name,
            l.phone,
            l.email,
            l.message,
            formatSource(l.source).label,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === "name") {
          return (a.name || "").localeCompare(b.name || "", "vi");
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [leads, filter, searchQuery, sourceFilter, topicFilter, stateFilter, dateRange, fromDate, toDate, sortBy]);

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
      {/* Filter & Search bar */}
      <div className="px-6 py-4 border-b border-slate-100 space-y-3 bg-slate-50/40">
        {/* Top row: Search input + Status tabs + Reset */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, SĐT, email, tiểu bang, nội dung..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} className="text-slate-400 shrink-0 mr-1" />
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === tab.key
                    ? "bg-[#2F5E9E] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filter === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Second row: Detailed dropdown filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Nguồn gửi */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Nguồn form
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">Tất cả nguồn</option>
              <option value="medicare">Form Medicare / IUL</option>
              <option value="contact">Trang Liên hệ</option>
              <option value="home">Báo giá Trang chủ</option>
              <option value="chat">Chat Widget</option>
            </select>
          </div>

          {/* Sản phẩm / Loại yêu cầu */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Sản phẩm / Yêu cầu
            </label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">Tất cả sản phẩm & yêu cầu</option>
              <option value="medicare">Bảo hiểm Medicare</option>
              <option value="aca">ACA Marketplace</option>
              <option value="auto">Auto Insurance (Bảo hiểm xe)</option>
              <option value="consult">Tư vấn sản phẩm bảo hiểm</option>
              <option value="info">Hỗ trợ thông tin</option>
              <option value="billing">Cập nhật địa chỉ thanh toán</option>
              <option value="feedback">Phản hồi / Khiếu nại</option>
            </select>
          </div>

          {/* Tiểu bang */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Tiểu bang
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">Tất cả tiểu bang</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Thời gian */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Thời gian gửi
            </label>
            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value as "all" | "today" | "7d" | "30d" | "custom")
              }
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="all">Mọi thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="custom">Tuỳ chọn từ ngày – đến ngày...</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
              Sắp xếp
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="name">Tên khách hàng (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Custom date range inputs */}
        {dateRange === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Từ ngày:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Đến ngày:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
              />
            </div>
          </div>
        )}

        {/* Active filter summary & reset button */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span>
            Hiển thị <strong className="text-slate-700">{filtered.length}</strong> /{" "}
            {leads.length} liên hệ
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <RotateCcw size={12} />
              Xoá bộ lọc
            </button>
          )}
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
                  Nguồn
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                  Tin nhắn / Chi tiết
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
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${formatSource(lead.source).cls}`}
                    >
                      {formatSource(lead.source).label}
                    </span>
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
