"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  HelpCircle,
  ExternalLink,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  FolderPlus,
  Folder,
  X,
  Edit2,
  Check,
} from "lucide-react";

export type Faq = {
  id: string;
  category: string;
  category_en: string;
  q_vi: string;
  q_en: string;
  a_vi: string;
  a_en: string;
};

export type Category = {
  id: string;
  vi: string;
  en: string;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "aca", vi: "Bảo hiểm sức khỏe (ACA)", en: "Health Insurance (ACA)" },
  { id: "medicare", vi: "Medicare & Medicaid", en: "Medicare & Medicaid" },
  { id: "auto", vi: "Bảo hiểm xe hơi", en: "Auto Insurance" },
  { id: "process", vi: "Quy trình hồ sơ", en: "Application Process" },
];

export default function FaqsEditor({
  initialFaqs,
  initialCategories,
}: {
  initialFaqs: Faq[];
  initialCategories?: Category[];
}) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories && initialCategories.length > 0
      ? initialCategories
      : DEFAULT_CATEGORIES
  );

  const [expandedId, setExpandedId] = useState<string | null>(initialFaqs[0]?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");
  const [langTab, setLangTab] = useState<Record<string, "vi" | "en">>({});

  // Category Manager Modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatVi, setNewCatVi] = useState("");
  const [newCatEn, setNewCatEn] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatVi, setEditCatVi] = useState("");
  const [editCatEn, setEditCatEn] = useState("");

  const getLang = (id: string) => langTab[id] || "vi";
  const setLang = (id: string, l: "vi" | "en") =>
    setLangTab((prev) => ({ ...prev, [id]: l }));

  // --- Category Actions ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatVi.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      vi: newCatVi.trim(),
      en: newCatEn.trim() || newCatVi.trim(),
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatVi("");
    setNewCatEn("");
  };

  const handleStartEditCat = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatVi(cat.vi);
    setEditCatEn(cat.en);
  };

  const handleSaveEditCat = (catId: string) => {
    if (!editCatVi.trim()) return;
    const oldCat = categories.find((c) => c.id === catId);
    if (!oldCat) return;

    // Update categories list
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, vi: editCatVi.trim(), en: editCatEn.trim() || editCatVi.trim() }
          : c
      )
    );

    // Also update all FAQs that used the old category names
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.category === oldCat.vi) {
          return {
            ...f,
            category: editCatVi.trim(),
            category_en: editCatEn.trim() || editCatVi.trim(),
          };
        }
        return f;
      })
    );

    setEditingCatId(null);
  };

  const handleDeleteCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;

    const count = faqs.filter((f) => f.category === cat.vi).length;
    let msg = `Bạn có chắc muốn xoá danh mục "${cat.vi}"?`;
    if (count > 0) {
      msg = `Danh mục "${cat.vi}" hiện đang có ${count} câu hỏi. Nếu xoá, các câu hỏi này sẽ được chuyển về danh mục đầu tiên. Bạn có muốn tiếp tục?`;
    }

    if (!confirm(msg)) return;

    const remainingCats = categories.filter((c) => c.id !== catId);
    setCategories(remainingCats);

    if (count > 0 && remainingCats.length > 0) {
      const fallback = remainingCats[0];
      setFaqs((prev) =>
        prev.map((f) =>
          f.category === cat.vi
            ? { ...f, category: fallback.vi, category_en: fallback.en }
            : f
        )
      );
    }
  };

  // --- FAQ Actions ---
  const handleAddFaq = () => {
    const newId = Date.now().toString();
    const defaultCat = categories[0] || {
      vi: "Chung",
      en: "General",
    };

    const newFaq: Faq = {
      id: newId,
      category: defaultCat.vi,
      category_en: defaultCat.en,
      q_vi: "Câu hỏi mới cần giải đáp?",
      q_en: "New frequently asked question?",
      a_vi: "Nội dung câu trả lời chi tiết bằng tiếng Việt...",
      a_en: "Detailed answer in English...",
    };
    setFaqs((prev) => [newFaq, ...prev]);
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, field: keyof Faq, value: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSelectCategory = (faqId: string, catVi: string) => {
    const found = categories.find((c) => c.vi === catVi);
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === faqId
          ? {
              ...f,
              category: catVi,
              category_en: found ? found.en : catVi,
            }
          : f
      )
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá câu hỏi này?")) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;
    const newArr = [...faqs];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setFaqs(newArr);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const supabase = createClient();
      const payload = JSON.stringify({
        faqs,
        categories,
      });

      const { error: upsertErr } = await supabase.from("page_content").upsert(
        {
          page: "customer_care",
          section: "faqs",
          field: "data",
          value_en: payload,
          value_vi: payload,
        },
        { onConflict: "page,section,field" }
      );

      if (upsertErr) {
        setError(upsertErr.message);
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (e: any) {
      setError(e.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (selectedCatFilter !== "all" && f.category !== selectedCatFilter) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        f.q_vi.toLowerCase().includes(q) ||
        f.a_vi.toLowerCase().includes(q) ||
        f.q_en.toLowerCase().includes(q) ||
        f.a_en.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    });
  }, [faqs, selectedCatFilter, search]);

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/customer-care"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              Chăm sóc khách hàng
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Chỉnh sửa Câu hỏi thường gặp (FAQs)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý danh mục và danh sách câu hỏi hiển thị trên trang /customer-care/faqs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCatModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
          >
            <Folder size={14} className="text-amber-500" />
            Quản lý danh mục ({categories.length})
          </button>
          <button
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus size={14} />
            Thêm câu hỏi
          </button>
          <a
            href="http://localhost:3000/customer-care/faqs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <ExternalLink size={13} />
            Xem Web
          </a>
        </div>
      </div>

      {/* Category Pills & Quick Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Folder size={13} className="text-blue-600" />
            Danh mục hiện có ({categories.length})
          </span>
          <button
            onClick={() => setShowCatModal(true)}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Plus size={12} />
            Thêm / Xoá danh mục
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCatFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCatFilter === "all"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({faqs.length})
          </button>
          {categories.map((cat) => {
            const count = faqs.filter((f) => f.category === cat.vi).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatFilter(cat.vi)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCatFilter === cat.vi
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{cat.vi}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCatFilter === cat.vi
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-50 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium animate-fadeIn">
          <CheckCircle2 size={16} />
          Đã lưu thành công! Dữ liệu câu hỏi và danh mục trên trang Web đã cập nhật ngay.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
          Lỗi: {error}
        </div>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {filtered.map((faq, idx) => {
          const isExpanded = expandedId === faq.id;
          const curLang = getLang(faq.id);

          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              {/* Header card row */}
              <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                >
                  <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-700">
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {faq.q_vi || faq.q_en || "Chưa có tiêu đề câu hỏi"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    title="Di chuyển lên"
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === faqs.length - 1}
                    title="Di chuyển xuống"
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    title="Xoá câu hỏi"
                    className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors ml-1"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Form editing body */}
              {isExpanded && (
                <div className="p-6 space-y-5">
                  {/* Category Selection for this FAQ */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      Chọn danh mục cho câu hỏi này
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={faq.category}
                        onChange={(e) => handleSelectCategory(faq.id, e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.vi}>
                            {c.vi} ({c.en})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCatModal(true)}
                        className="px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shrink-0"
                      >
                        + Quản lý danh mục
                      </button>
                    </div>
                  </div>

                  {/* Language Toggle for Question & Answer */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nội dung Câu hỏi & Câu trả lời
                      </span>
                      <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                        <button
                          type="button"
                          onClick={() => setLang(faq.id, "vi")}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                            curLang === "vi"
                              ? "bg-white text-slate-800 shadow-xs"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          🇻🇳 Tiếng Việt
                        </button>
                        <button
                          type="button"
                          onClick={() => setLang(faq.id, "en")}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                            curLang === "en"
                              ? "bg-white text-slate-800 shadow-xs"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          🇺🇸 English
                        </button>
                      </div>
                    </div>

                    {curLang === "vi" ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            🇻🇳 Câu hỏi (Tiếng Việt)
                          </label>
                          <input
                            type="text"
                            value={faq.q_vi}
                            onChange={(e) => handleUpdate(faq.id, "q_vi", e.target.value)}
                            placeholder="Nhập câu hỏi tiếng Việt..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            🇻🇳 Câu trả lời (Tiếng Việt)
                          </label>
                          <textarea
                            rows={4}
                            value={faq.a_vi}
                            onChange={(e) => handleUpdate(faq.id, "a_vi", e.target.value)}
                            placeholder="Nhập nội dung giải đáp chi tiết..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            🇺🇸 Question (English)
                          </label>
                          <input
                            type="text"
                            value={faq.q_en}
                            onChange={(e) => handleUpdate(faq.id, "q_en", e.target.value)}
                            placeholder="Enter question in English..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            🇺🇸 Answer (English)
                          </label>
                          <textarea
                            rows={4}
                            value={faq.a_en}
                            onChange={(e) => handleUpdate(faq.id, "a_en", e.target.value)}
                            placeholder="Enter detailed answer in English..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Plus size={14} />
            Thêm câu hỏi
          </button>
          <span className="text-xs text-slate-400">
            {faqs.length} câu hỏi · {categories.length} danh mục
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-60 transition-all"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save size={16} />
              Lưu thay đổi FAQs & Danh mục
            </>
          )}
        </button>
      </div>

      {/* ================= MODAL QUẢN LÝ DANH MỤC ================= */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Folder size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Quản lý danh mục FAQs
                  </h3>
                  <p className="text-xs text-slate-400">
                    Thêm danh mục mới hoặc chỉnh sửa, xoá danh mục cũ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCatModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Thêm danh mục mới */}
            <form
              onSubmit={handleAddCategory}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3"
            >
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                + Thêm danh mục mới
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Tên tiếng Việt *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Bảo hiểm nhân thọ"
                    value={newCatVi}
                    onChange={(e) => setNewCatVi(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    English Name
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Life Insurance"
                    value={newCatEn}
                    onChange={(e) => setNewCatEn(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                Thêm vào danh sách
              </button>
            </form>

            {/* Danh sách danh mục hiện có */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Danh sách danh mục ({categories.length})
              </span>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {categories.map((cat) => {
                  const isEditing = editingCatId === cat.id;
                  const faqCount = faqs.filter((f) => f.category === cat.vi).length;

                  if (isEditing) {
                    return (
                      <div
                        key={cat.id}
                        className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editCatVi}
                            onChange={(e) => setEditCatVi(e.target.value)}
                            placeholder="Tên tiếng Việt"
                            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editCatEn}
                            onChange={(e) => setEditCatEn(e.target.value)}
                            placeholder="English Name"
                            className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditCat(cat.id)}
                            className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1"
                          >
                            <Check size={12} />
                            Xong
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {cat.vi}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600 font-bold shrink-0">
                            {faqCount} câu
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {cat.en}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditCat(cat)}
                          title="Sửa tên danh mục"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={categories.length <= 1}
                          title={
                            categories.length <= 1
                              ? "Phải có ít nhất 1 danh mục"
                              : "Xoá danh mục"
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
