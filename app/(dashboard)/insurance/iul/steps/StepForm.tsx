"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type StepRow = {
  id?: string;
  step_label: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  sort_order: number;
  active: boolean;
};

export default function StepForm({ step }: { step?: StepRow }) {
  const isEdit = !!step?.id;
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<StepRow>(
    step
      ? {
          ...step,
          title_en: step.title_en || (step as any).title || "",
          description_en: step.description_en || (step as any).description || "",
        }
      : {
          step_label: "STEP 1",
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

  const set = (k: keyof StepRow, v: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.title_en.trim()) {
      setError("Vui lòng nhập tiêu đề tiếng Anh.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      step_label: form.step_label,
      title_en: form.title_en,
      title_vi: form.title_vi,
      description_en: form.description_en,
      description_vi: form.description_vi,
      sort_order: form.sort_order,
      active: form.active,
    };
    const { error: err } = isEdit
      ? await supabase.from("iul_steps").update(payload).eq("id", step!.id!)
      : await supabase.from("iul_steps").insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/insurance/iul/steps");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await supabase.from("iul_steps").delete().eq("id", step!.id!);
    router.push("/insurance/iul/steps");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/insurance/iul/steps" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa bước" : "Thêm bước mới"}
          </h1>
          <p className="text-sm text-slate-500">IUL — How It Works</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nhãn bước (vd: STEP 1)
            </label>
            <input
              value={form.step_label}
              onChange={(e) => set("step_label", e.target.value)}
              placeholder="STEP 1"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Tiêu đề (English) *
            </label>
            <input
              value={form.title_en}
              onChange={(e) => set("title_en", e.target.value)}
              placeholder="Schedule a consultation"
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
              placeholder="Đặt lịch tư vấn"
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
              placeholder="Describe this step in English..."
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
              placeholder="Mô tả chi tiết bước này..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
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
          {isEdit ? "Lưu thay đổi" : "Tạo bước"}
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
