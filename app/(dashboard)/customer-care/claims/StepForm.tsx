"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type StepRow = {
  id?: string;
  num: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi: string;
  sort_order: number;
  active: boolean;
};

export default function StepForm({ initial }: { initial?: StepRow }) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<StepRow>(
    initial ?? {
      num: "",
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
      num: form.num.trim(),
      title_en: form.title_en.trim(),
      title_vi: form.title_vi.trim(),
      description_en: form.description_en.trim(),
      description_vi: form.description_vi.trim(),
      sort_order: Number(form.sort_order),
      active: form.active,
    };
    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from("claims_steps")
        .update(payload)
        .eq("id", initial!.id!));
    } else {
      ({ error: err } = await supabase.from("claims_steps").insert(payload));
    }
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/customer-care/claims");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await supabase.from("claims_steps").delete().eq("id", initial!.id!);
    router.push("/customer-care/claims");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/customer-care/claims"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa bước" : "Thêm bước mới"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Claims Process — các bước hướng dẫn giải quyết quyền lợi
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Số bước
            </label>
            <input
              value={form.num}
              onChange={(e) => set("num", e.target.value)}
              placeholder="01"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
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
              placeholder="Contact Us & Report Your Claim"
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
              placeholder="Liên Hệ & Báo Cáo Khiếu Nại"
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
              placeholder="Mô tả chi tiết bước này bằng tiếng Việt..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
          </div>
        </div>

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
          {isEdit ? "Lưu thay đổi" : "Tạo bước"}
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
