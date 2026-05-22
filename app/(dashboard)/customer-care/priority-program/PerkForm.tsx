"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type PerkRow = {
  id?: string;
  icon: string;
  label_en: string;
  label_vi: string;
  description_en: string;
  description_vi: string;
  sort_order: number;
  active: boolean;
};

const EMOJI_PRESETS = [
  "⚡",
  "📋",
  "🎯",
  "📚",
  "🏆",
  "💬",
  "🌟",
  "🔑",
  "💎",
  "🛡️",
  "📞",
  "🎁",
];

export default function PerkForm({ initial }: { initial?: PerkRow }) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<PerkRow>(
    initial ?? {
      icon: "⭐",
      label_en: "",
      label_vi: "",
      description_en: "",
      description_vi: "",
      sort_order: 0,
      active: true,
    },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof PerkRow, v: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.label_en.trim()) {
      setError("Vui lòng nhập tên quyền lợi tiếng Anh.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      icon: form.icon.trim(),
      label_en: form.label_en.trim(),
      label_vi: form.label_vi.trim(),
      description_en: form.description_en.trim(),
      description_vi: form.description_vi.trim(),
      sort_order: Number(form.sort_order),
      active: form.active,
    };
    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from("priority_perks")
        .update(payload)
        .eq("id", initial!.id!));
    } else {
      ({ error: err } = await supabase.from("priority_perks").insert(payload));
    }
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/customer-care/priority-program");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await supabase.from("priority_perks").delete().eq("id", initial!.id!);
    router.push("/customer-care/priority-program");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/customer-care/priority-program"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa quyền lợi" : "Thêm quyền lợi mới"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Priority Program — quyền lợi dành cho thành viên ưu tiên
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        {/* Icon picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Icon (emoji)
          </label>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {EMOJI_PRESETS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => set("icon", e)}
                className={`w-9 h-9 text-lg rounded-lg border-2 transition-colors ${
                  form.icon === e
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <input
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="hoặc nhập emoji khác..."
            className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Label + Sort order */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                🇺🇸 Tên quyền lợi (English) *
              </label>
              <input
                value={form.label_en}
                onChange={(e) => set("label_en", e.target.value)}
                placeholder="Priority Support"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                🇻🇳 Tên quyền lợi (Tiếng Việt)
              </label>
              <input
                value={form.label_vi}
                onChange={(e) => set("label_vi", e.target.value)}
                placeholder="Hỗ Trợ Ưu Tiên"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Thứ tự
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Mô tả (English)
            </label>
            <textarea
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
              rows={3}
              placeholder="Describe this perk in English..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇻🇳 Mô tả (Tiếng Việt)
            </label>
            <textarea
              value={form.description_vi}
              onChange={(e) => set("description_vi", e.target.value)}
              rows={3}
              placeholder="Mô tả quyền lợi này bằng tiếng Việt..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Preview */}
        {(form.icon || form.label_en) && (
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Xem trước
            </p>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="text-2xl mb-2">{form.icon}</div>
              <p className="text-sm font-bold text-slate-800">
                {form.label_en}
              </p>
              {form.label_vi && (
                <p className="text-xs text-blue-600 font-medium mt-0.5">
                  {form.label_vi}
                </p>
              )}
              {form.description_en && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {form.description_en}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Active toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Hiển thị trên website
            </p>
          </div>
          <button
            type="button"
            onClick={() => set("active", !form.active)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.active ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                form.active ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {isEdit ? "Lưu thay đổi" : "Tạo quyền lợi"}
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
              confirmDelete
                ? "bg-red-600 text-white hover:bg-red-700"
                : "border border-slate-200 text-red-500 hover:bg-red-50"
            }`}
          >
            {deleting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {confirmDelete ? "Xác nhận xoá" : "Xoá"}
          </button>
        )}
      </div>
    </div>
  );
}
