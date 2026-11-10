"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Phone,
  Mail,
  CheckCircle2,
  Circle,
  Trash2,
  Search,
  Plus,
  Edit2,
  X,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";

type Complaint = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  processed: boolean;
  created_at: string;
};

export default function ComplaintsTable({
  initialComplaints,
}: {
  initialComplaints: Complaint[];
}) {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [search, setSearch] = useState("");

  // Modal Create state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [createProcessed, setCreateProcessed] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Modal Edit state
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editProcessed, setEditProcessed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const handleToggle = async (id: string, current: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ processed: !current })
      .eq("id", id);
    if (!error) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, processed: !current } : c))
      );
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá phiếu khiếu nại này?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setComplaints((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!createName.trim() || !createPhone.trim() || !createMessage.trim()) {
      setCreateError("Vui lòng điền họ tên, số điện thoại và nội dung khiếu nại.");
      return;
    }
    setCreating(true);
    try {
      const supabase = createClient();
      const newLead = {
        name: createName.trim(),
        phone: createPhone.trim(),
        email: createEmail.trim() || null,
        message: `[KHIẾU NẠI & GIẢI QUYẾT VẤN ĐỀ] ${createMessage.trim()}`,
        source: "complaint_resolution_form",
        processed: createProcessed,
      };

      const { data, error } = await supabase
        .from("leads")
        .insert(newLead)
        .select()
        .single();

      if (error) {
        setCreateError(error.message);
      } else if (data) {
        setComplaints((prev) => [data, ...prev]);
        setShowCreateModal(false);
        setCreateName("");
        setCreatePhone("");
        setCreateEmail("");
        setCreateMessage("");
        setCreateProcessed(false);
        router.refresh();
      }
    } catch (err: any) {
      setCreateError(err.message || "Lỗi khi tạo phiếu khiếu nại");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (item: Complaint) => {
    setEditingComplaint(item);
    setEditName(item.name || "");
    setEditPhone(item.phone || "");
    setEditEmail(item.email || "");
    const clean = (item.message || "").replace("[KHIẾU NẠI & GIẢI QUYẾT VẤN ĐỀ]", "").trim();
    setEditMessage(clean);
    setEditProcessed(item.processed);
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;
    setEditError("");
    if (!editName.trim() || !editPhone.trim() || !editMessage.trim()) {
      setEditError("Vui lòng điền họ tên, số điện thoại và nội dung.");
      return;
    }
    setUpdating(true);
    try {
      const supabase = createClient();
      const updatedMessage = `[KHIẾU NẠI & GIẢI QUYẾT VẤN ĐỀ] ${editMessage.trim()}`;
      const { error } = await supabase
        .from("leads")
        .update({
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim() || null,
          message: updatedMessage,
          processed: editProcessed,
        })
        .eq("id", editingComplaint.id);

      if (error) {
        setEditError(error.message);
      } else {
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === editingComplaint.id
              ? {
                  ...c,
                  name: editName.trim(),
                  phone: editPhone.trim(),
                  email: editEmail.trim(),
                  message: updatedMessage,
                  processed: editProcessed,
                }
              : c
          )
        );
        setEditingComplaint(null);
        router.refresh();
      }
    } catch (err: any) {
      setEditError(err.message || "Lỗi khi cập nhật");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filter === "pending" && c.processed) return false;
    if (filter === "done" && !c.processed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inName = c.name.toLowerCase().includes(q);
      const inPhone = c.phone.toLowerCase().includes(q);
      const inMsg = (c.message || "").toLowerCase().includes(q);
      if (!inName && !inPhone && !inMsg) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, vấn đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            onClick={() => {
              setCreateError("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus size={14} />
            Tạo phiếu mới
          </button>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-full sm:w-auto">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chưa xử lý" },
            { key: "done", label: "Đã giải quyết" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.key
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs divide-y divide-slate-100">
        {filtered.map((item) => {
          const cleanMsg = (item.message || "")
            .replace("[KHIẾU NẠI & GIẢI QUYẾT VẤN ĐỀ]", "")
            .trim();
          return (
            <div
              key={item.id}
              className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                !item.processed ? "bg-amber-50/20" : "hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.processed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {item.processed ? (
                      <>
                        <CheckCircle2 size={11} /> Đã giải quyết
                      </>
                    ) : (
                      <>
                        <Circle size={11} /> Đang chờ xử lý
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                  <a
                    href={`tel:${item.phone}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Phone size={11} />
                    {item.phone}
                  </a>
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="text-xs text-slate-500 hover:underline flex items-center gap-1"
                    >
                      <Mail size={11} />
                      {item.email}
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium whitespace-pre-wrap">
                  {cleanMsg || item.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                <a
                  href={`tel:${item.phone}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 transition-colors"
                >
                  <Phone size={12} />
                  Gọi ngay
                </a>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Edit2 size={12} />
                  Sửa
                </button>

                <button
                  onClick={() => handleToggle(item.id, item.processed)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    item.processed
                      ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {item.processed ? "Đổi: Chưa xử lý" : "Đã giải quyết"}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Xoá phiếu"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Không có phiếu khiếu nại nào trong danh mục này.
          </div>
        )}
      </div>

      {/* ================= MODAL TẠO PHIẾU KHIẾU NẠI ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                ➕ Tiếp nhận phiếu khiếu nại mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Họ tên khách hàng *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(407) 123-4567"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email (nếu có)
                  </label>
                  <input
                    type="email"
                    placeholder="khachhang@email.com"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Mô tả vấn đề / Nội dung khiếu nại *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mô tả sai sót hóa đơn Medical Bill, từ chối quyền lợi hoặc nội dung khách hàng phản ánh..."
                  value={createMessage}
                  onChange={(e) => setCreateMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="createProcessed"
                  checked={createProcessed}
                  onChange={(e) => setCreateProcessed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="createProcessed" className="text-xs font-medium text-slate-700">
                  Đánh dấu là đã xử lý xong
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-60"
                >
                  {creating && <Loader2 size={13} className="animate-spin" />}
                  Lưu phiếu khiếu nại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL SỬA PHIẾU KHIẾU NẠI ================= */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                ✏️ Cập nhật phiếu khiếu nại
              </h3>
              <button
                onClick={() => setEditingComplaint(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Họ tên khách hàng *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nội dung khiếu nại / Ghi chú xử lý *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editProcessed"
                  checked={editProcessed}
                  onChange={(e) => setEditProcessed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="editProcessed" className="text-xs font-medium text-slate-700">
                  Đã giải quyết xong khiếu nại
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-60"
                >
                  {updating && <Loader2 size={13} className="animate-spin" />}
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
