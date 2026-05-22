"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Phone,
  Mail,
  KeyRound,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Employee } from "./actions";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  resetEmployeePassword,
} from "./actions";

// ─── Add Employee Modal ───────────────────────────────────────────────────────
function AddModal({ onClose }: { onClose: (added?: Employee) => void }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password || !form.name) return;
    setSaving(true);
    const result = await createEmployee(form);
    setSaving(false);
    if (result.error) {
      setErr(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Thêm nhân viên</h2>
          <button
            onClick={() => onClose()}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nguyễn Văn A"
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Email đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="nhanvien@email.com"
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Số điện thoại
            </label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(678) 000 0000"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          {err && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {err}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-1.5 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Employee Modal ──────────────────────────────────────────────────────
function EditModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: (updated?: Partial<Employee>) => void;
}) {
  const [form, setForm] = useState({
    name: employee.name,
    phone: employee.phone,
  });
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    const result = await updateEmployee(employee.id, form);
    if (result.error) {
      setErr(result.error);
      setSaving(false);
      return;
    }
    if (newPw) {
      const pwResult = await resetEmployeePassword(employee.id, newPw);
      if (pwResult.error) {
        setErr(pwResult.error);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    onClose({ name: form.name, phone: form.phone });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Chỉnh sửa nhân viên</h2>
          <button
            onClick={() => onClose()}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Họ và tên
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Email
            </label>
            <input
              value={employee.email}
              disabled
              className="w-full border border-slate-100 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Số điện thoại
            </label>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="(678) 000 0000"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <KeyRound size={12} />
              Đặt lại mật khẩu (để trống nếu không đổi)
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Mật khẩu mới..."
                minLength={newPw ? 6 : undefined}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {err && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {err}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-1.5 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main List ────────────────────────────────────────────────────────────────
export default function AgentList({ initial }: { initial: Employee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(initial);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | Employee | null>(null);
  const [, startTransition] = useTransition();

  const filtered = employees.filter(
    (e) =>
      !search.trim() ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    if (!confirm("Xoá tài khoản nhân viên này? Họ sẽ không thể đăng nhập nữa."))
      return;
    startTransition(async () => {
      const result = await deleteEmployee(id);
      if (!result.error) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      }
    });
  };

  const joined = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <>
      {modal === "add" && (
        <AddModal
          onClose={(added) => {
            if (added) {
              // Refresh the page to get updated list from server
              window.location.reload();
            }
            setModal(null);
          }}
        />
      )}
      {modal && modal !== "add" && (
        <EditModal
          employee={modal as Employee}
          onClose={(updated) => {
            if (updated) {
              setEmployees((prev) =>
                prev.map((e) =>
                  e.id === (modal as Employee).id ? { ...e, ...updated } : e,
                ),
              );
            }
            setModal(null);
          }}
        />
      )}

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT, email..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
          />
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={15} />
          Thêm nhân viên
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {search
              ? "Không tìm thấy kết quả phù hợp."
              : "Chưa có nhân viên nào."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Nhân viên
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Liên hệ
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                  Ngày tạo
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Lần cuối đăng nhập
                </th>
                <th className="text-right px-4 py-3">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                        {(emp.name || emp.email).slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {emp.name || (
                            <span className="text-slate-400 italic">
                              Chưa đặt tên
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Mail size={10} />
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {emp.phone ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone size={11} className="text-slate-400" />
                        {emp.phone}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">
                    {joined(emp.created_at)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {emp.last_sign_in_at ? (
                      <span className="text-xs text-slate-500">
                        {joined(emp.last_sign_in_at)}
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                        Chưa đăng nhập
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModal(emp)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

