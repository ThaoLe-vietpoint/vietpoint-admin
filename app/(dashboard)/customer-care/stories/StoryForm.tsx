"use client";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type StoryRow = {
  id?: string;
  name: string;
  location_en: string;
  location_vi: string;
  amount: string;
  story_en: string;
  story_vi: string;
  tag_en: string;
  tag_vi: string;
  tag_color: string;
  active: boolean;
};

const TAG_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#2F5E9E",
  "#a855f7",
  "#ec4899",
  "#7c3aed",
];

export default function StoryForm({ initial }: { initial?: StoryRow }) {
  const isEdit = !!initial?.id;
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<StoryRow>(
    initial ?? {
      name: "",
      location_en: "",
      location_vi: "",
      amount: "",
      story_en: "",
      story_vi: "",
      tag_en: "",
      tag_vi: "",
      tag_color: "#2F5E9E",
      active: true,
    },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof StoryRow, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên khách hàng.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      location_en: form.location_en.trim(),
      location_vi: form.location_vi.trim(),
      amount: form.amount.trim(),
      story_en: form.story_en.trim(),
      story_vi: form.story_vi.trim(),
      tag_en: form.tag_en.trim(),
      tag_vi: form.tag_vi.trim(),
      tag_color: form.tag_color,
      active: form.active,
    };
    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from("customer_stories")
        .update(payload)
        .eq("id", initial!.id!));
    } else {
      ({ error: err } = await supabase
        .from("customer_stories")
        .insert(payload));
    }
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      router.push("/customer-care/stories");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await supabase.from("customer_stories").delete().eq("id", initial!.id!);
    router.push("/customer-care/stories");
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/customer-care/stories"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isEdit ? "Chỉnh sửa câu chuyện" : "Thêm câu chuyện mới"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            My Story, My Family — câu chuyện thực tế từ khách hàng
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        {/* Name + Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Tên khách hàng *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ha Nguyen"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Địa điểm (English)
            </label>
            <input
              value={form.location_en}
              onChange={(e) => set("location_en", e.target.value)}
              placeholder="Houston, TX"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇻🇳 Địa điểm (Tiếng Việt)
            </label>
            <input
              value={form.location_vi}
              onChange={(e) => set("location_vi", e.target.value)}
              placeholder="Houston, Texas"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Amount + Tag */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Số tiền / quyền lợi
            </label>
            <input
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="$8,500/month"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nhãn 🇺🇸 (tag EN)
            </label>
            <input
              value={form.tag_en}
              onChange={(e) => set("tag_en", e.target.value)}
              placeholder="Living Benefits"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Nhãn 🇻🇳 (tag VI)
            </label>
            <input
              value={form.tag_vi}
              onChange={(e) => set("tag_vi", e.target.value)}
              placeholder="Quyền Lợi Sống"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Tag color */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Màu nhãn
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {TAG_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("tag_color", c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  form.tag_color === c
                    ? "border-slate-800 scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
          {form.tag_en && (
            <div className="mt-2">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ background: form.tag_color }}
              >
                {form.tag_en}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇺🇸 Câu chuyện (English) *
            </label>
            <textarea
              value={form.story_en}
              onChange={(e) => set("story_en", e.target.value)}
              rows={6}
              placeholder="Tell the customer's real story in English..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-1">
              {form.story_en.trim().split(/\s+/).filter(Boolean).length} từ
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              🇻🇳 Câu chuyện (Tiếng Việt)
            </label>
            <textarea
              value={form.story_vi}
              onChange={(e) => set("story_vi", e.target.value)}
              rows={6}
              placeholder="Kể câu chuyện thực tế của khách hàng..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-1">
              {form.story_vi.trim().split(/\s+/).filter(Boolean).length} từ
            </p>
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Hiển thị trên website
            </p>
            <p className="text-xs text-slate-400">
              Câu chuyện sẽ xuất hiện trong mục Stories
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
          {isEdit ? "Lưu thay đổi" : "Tạo câu chuyện"}
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
