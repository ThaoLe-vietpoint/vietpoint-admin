"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import EmojiPickerField from "@/app/components/EmojiPickerField";

type ReasonRow = {
  id?: string;
  icon: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  sort_order: number;
  active: boolean;
};

export default function ReasonForm({ reason }: { reason?: ReasonRow }) {
  const isEdit = !!reason?.id;
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<ReasonRow>(
    reason
      ? {
          ...reason,
          title_en: reason.title_en || (reason as any).title || "",
          description_en: reason.description_en || (reason as any).description || "",
        }
      : {
          icon: "✅",
          title_en: "",
          title_vi: "",
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

  const set = (k: keyof ReasonRow, v: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.title_en.trim()) {
      setError("Vui lòng nhập tiêu đề tiếng Anh.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      icon: form.icon,
      title_en: form.title_en,
      title_vi: form.title_vi,
      description_en: form.description_en,
      description_vi: form.description_vi,
      sort_order: form.sort_order,
      active: form.active,
    };
    const { error: err } = isEdit
      ? await supabase.from("iul_reasons").update(payload).eq("id", reason!.id!)
      : await supabase.from("iul_reasons").insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/insurance/iul/reasons");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const { error: err } = await supabase.from("iul_reasons").delete().eq("id", reason!.id!);
    if (err) {
      setDeleting(false);
      setError("Lỗi khi xóa: " + err.message);
      return;
    }
    router.push("/insurance/iul/reasons");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/insurance/iul/reasons" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa lý do" : "Thêm lý do mới"}
          </h1>
          <p className="text-sm text-slate-500">IUL — Lý do nên chọn IUL</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <EmojiPickerField value={form.icon} onChange={(v) => set("icon", v)} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Tiêu đề (English) *
            </label>
            <input
              value={form.title_en}
              onChange={(e) => set("title_en", e.target.value)}
              placeholder="Living Benefit"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇻🇳 Tiêu đề (Tiếng Việt)
            </label>
            <input
              value={form.title_vi}
              onChange={(e) => set("title_vi", e.target.value)}
              placeholder="Quyền lợi sống"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Mô tả (English)
            </label>
            <textarea
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
              rows={4}
              placeholder="Describe this reason in English..."
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
              rows={4}
              placeholder="Mô tả lý do bằng tiếng Việt..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <p className="text-sm font-medium text-slate-700">Hiển thị trên website</p>
          <button
            type="button"
            onClick={() => set("active", !form.active)}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? "bg-blue-600" : "bg-slate-200"}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? "left-6" : "left-1"}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isEdit ? "Lưu thay đổi" : "Tạo lý do"}
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${confirmDelete ? "bg-red-600 text-white hover:bg-red-700" : "border border-slate-200 text-red-500 hover:bg-red-50"}`}
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            {confirmDelete ? "Xác nhận xoá" : "Xoá"}
          </button>
        )}
      </div>
    </div>
  );
}
