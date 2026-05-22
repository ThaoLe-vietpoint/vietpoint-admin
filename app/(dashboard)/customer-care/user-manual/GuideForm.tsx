"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type GuideRow = {
  id?: string;
  title_en: string;
  title_vi: string;
  date_label: string;
  description_en: string;
  description_vi: string;
  tag_en: string;
  tag_vi: string;
  active: boolean;
};

const TAGS = [
  "IUL",
  "Policy",
  "Account",
  "Payment",
  "Emergency",
  "Tax",
  "Retirement",
  "General",
];

export default function GuideForm({ initial }: { initial?: GuideRow }) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<GuideRow>(
    initial ?? {
      title_en: "",
      title_vi: "",
      date_label: "",
      description_en: "",
      description_vi: "",
      tag_en: "",
      tag_vi: "",
      active: true,
    },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof GuideRow, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.title_en.trim()) {
      setError("Vui lòng nhập tiêu đề tiếng Anh.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title_en: form.title_en.trim(),
      title_vi: form.title_vi.trim(),
      date_label: form.date_label.trim(),
      description_en: form.description_en.trim(),
      description_vi: form.description_vi.trim(),
      tag_en: form.tag_en.trim(),
      tag_vi: form.tag_vi.trim(),
      active: form.active,
    };
    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from("manual_guides")
        .update(payload)
        .eq("id", initial!.id!));
    } else {
      ({ error: err } = await supabase.from("manual_guides").insert(payload));
    }
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/customer-care/user-manual");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await supabase.from("manual_guides").delete().eq("id", initial!.id!);
    router.push("/customer-care/user-manual");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/customer-care/user-manual"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa bài hướng dẫn" : "Thêm bài hướng dẫn mới"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            User Manual — hướng dẫn quản lý hợp đồng bảo hiểm
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        {/* Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Tiêu đề (English) *
            </label>
            <input
              value={form.title_en}
              onChange={(e) => set("title_en", e.target.value)}
              placeholder="How to Make a Policy Change"
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
              placeholder="Cách Thay Đổi Hợp Đồng Bảo Hiểm"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Date + Tag */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Ngày / Thời gian
            </label>
            <input
              value={form.date_label}
              onChange={(e) => set("date_label", e.target.value)}
              placeholder="May 1, 2025"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nhãn 🇺🇸 (tag EN)
            </label>
            <div className="flex items-center gap-2">
              <input
                value={form.tag_en}
                onChange={(e) => set("tag_en", e.target.value)}
                placeholder="IUL"
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            {/* Quick tag chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tag_en", t)}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                    form.tag_en === t
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-200 text-slate-500 hover:border-blue-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nhãn 🇻🇳 (tag VI)
            </label>
            <input
              value={form.tag_vi}
              onChange={(e) => set("tag_vi", e.target.value)}
              placeholder="Quản Lý Hợp Đồng"
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
              rows={5}
              placeholder="Short description of this guide in English..."
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
              rows={5}
              placeholder="Mô tả ngắn về nội dung bài hướng dẫn..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Hiển thị trên website
            </p>
            <p className="text-xs text-slate-400">
              Bài viết sẽ xuất hiện trong mục User Manual
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

      {/* Actions */}
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
          {isEdit ? "Lưu thay đổi" : "Tạo bài hướng dẫn"}
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
