"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  Headphones,
  ExternalLink,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export type SupportTopic = {
  id: string;
  icon: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

export type SupportData = {
  consultingPhone: string;
  supportPhone: string;
  email: string;
  hours_vi: string;
  hours_en: string;
  topics: SupportTopic[];
};

export const DEFAULT_SUPPORT_DATA: SupportData = {
  consultingPhone: "(+1) (407)-421-1531",
  supportPhone: "(407)-576-6689 | (407)-714-4691 | (689)-307-7129",
  email: "servicing@vietpointservices.com",
  hours_vi: "Thứ Hai – Thứ Sáu: 9 SA – 6 CH | Thứ Bảy & Chủ Nhật: Đóng cửa",
  hours_en: "Monday – Friday: 9 AM – 6 PM | Saturday & Sunday: Closed",
  topics: [
    {
      id: "1",
      icon: "🩺",
      title_vi: "Tư vấn chương trình Sức khỏe & Medicare",
      title_en: "Health & Medicare Consultation",
      desc_vi: "Tư vấn chi tiết và hỗ trợ chọn chương trình bảo hiểm sức khỏe, Medicare Advantage hoặc Medigap phù hợp hoàn cảnh.",
      desc_en: "Personalized advice to select the right health insurance plan, Medicare Advantage, or Supplement coverage.",
    },
    {
      id: "2",
      icon: "🏥",
      title_vi: "Tìm bác sĩ & Bệnh viện trong mạng lưới",
      title_en: "Find Doctors & In-Network Facilities",
      desc_vi: "Hướng dẫn tra cứu bác sĩ gia đình, bác sĩ chuyên khoa và bệnh viện thuộc mạng lưới liên kết của hãng bảo hiểm.",
      desc_en: "Assistance with finding primary care physicians, specialists, and hospitals within your insurer network.",
    },
    {
      id: "3",
      icon: "💳",
      title_vi: "Đóng phí & Giải thích quyền lợi bảo hiểm",
      title_en: "Premium Payments & Benefits Explanation",
      desc_vi: "Giải thích các khoản Deductible, Copay, Out-of-pocket maximum và hỗ trợ thiết lập thanh toán phí bảo hiểm tự động.",
      desc_en: "Clear explanations of deductibles, copays, out-of-pocket maximums, and setting up automatic payments.",
    },
    {
      id: "4",
      icon: "📝",
      title_vi: "Cập nhật hồ sơ & Gia hạn hàng năm",
      title_en: "Policy Updates & Renewal",
      desc_vi: "Hỗ trợ thay đổi thông tin hộ gia đình, cập nhật thu nhập, đổi địa chỉ và rà soát gia hạn bảo hiểm vào kỳ Open Enrollment.",
      desc_en: "Support for updating household information, income changes, address updates, and annual policy renewal.",
    },
  ],
};

export default function SupportEditor({
  initialData,
}: {
  initialData?: SupportData;
}) {
  const router = useRouter();
  const [data, setData] = useState<SupportData>(initialData || DEFAULT_SUPPORT_DATA);
  const [expandedId, setExpandedId] = useState<string | null>(
    data.topics[0]?.id || null
  );
  const [langTab, setLangTab] = useState<Record<string, "vi" | "en">>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const getLang = (id: string) => langTab[id] || "vi";
  const setLang = (id: string, l: "vi" | "en") =>
    setLangTab((p) => ({ ...p, [id]: l }));

  // Topic CRUD
  const handleAddTopic = () => {
    const newId = Date.now().toString();
    const newTopic: SupportTopic = {
      id: newId,
      icon: "💡",
      title_vi: "Chủ đề hỗ trợ mới",
      title_en: "New Support Topic",
      desc_vi: "Mô tả nội dung hỗ trợ khách hàng bằng tiếng Việt...",
      desc_en: "Description of customer support in English...",
    };
    setData((prev) => ({
      ...prev,
      topics: [...prev.topics, newTopic],
    }));
    setExpandedId(newId);
  };

  const handleUpdateTopic = (id: string, field: keyof SupportTopic, val: string) => {
    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) => (t.id === id ? { ...t, [field]: val } : t)),
    }));
  };

  const handleDeleteTopic = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá chủ đề hỗ trợ này?")) return;
    setData((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t.id !== id),
    }));
    if (expandedId === id) setExpandedId(null);
  };

  const handleMoveTopic = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= data.topics.length) return;
    const arr = [...data.topics];
    const temp = arr[index];
    arr[index] = arr[target];
    arr[target] = temp;
    setData((prev) => ({ ...prev, topics: arr }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const supabase = createClient();
      const payload = JSON.stringify(data);

      // 1. Save customer care support data
      const { error: err } = await supabase.from("page_content").upsert(
        {
          page: "customer_care",
          section: "support",
          field: "data",
          value_en: payload,
          value_vi: payload,
        },
        { onConflict: "page,section,field" }
      );

      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }

      // 2. Also keep global hours in sync for Footer and Contact page
      try {
        const viParts = (data.hours_vi || "").split("|").map((s) => s.trim());
        const enParts = (data.hours_en || "").split("|").map((s) => s.trim());
        const weekdaysVi = viParts[0] || "";
        const weekendVi = viParts[1] || "";
        const weekdaysEn = enParts[0] || "";
        const weekendEn = enParts[1] || "";

        if (weekdaysVi || weekdaysEn) {
          await supabase.from("page_content").upsert(
            [
              {
                page: "global",
                section: "hours",
                field: "weekdays",
                value_en: weekdaysEn,
                value_vi: weekdaysVi,
              },
              {
                page: "global",
                section: "hours",
                field: "weekend",
                value_en: weekendEn,
                value_vi: weekendVi,
              },
            ],
            { onConflict: "page,section,field" }
          );
        }
      } catch (syncErr) {
        console.warn("Could not sync global hours:", syncErr);
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch (e: any) {
      setError(e.message || "Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
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
            Hỗ trợ khách hàng (Customer Support)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Chỉnh sửa thông tin kênh liên hệ & các chủ đề hỗ trợ hiển thị trên trang /customer-care/support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:3000/customer-care/support"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <ExternalLink size={13} />
            Xem trên Web
          </a>
          <button
            onClick={handleAddTopic}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus size={14} />
            Thêm chủ đề mới
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
          <CheckCircle2 size={16} />
          Đã lưu thành công! Trang Hỗ trợ khách hàng trên Web đã được cập nhật.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
          Lỗi: {error}
        </div>
      )}

      {/* Part 1: Contact Channels */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">
              1. Thông tin các kênh hỗ trợ trực tiếp
            </h2>
            <p className="text-xs text-slate-400">
              Chỉnh sửa hotline, email và giờ làm việc hiển thị trên trang Hỗ trợ KH
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Hotline Tư Vấn
            </label>
            <input
              type="text"
              value={data.consultingPhone}
              onChange={(e) => setData({ ...data, consultingPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Hotline CSKH & Khiếu Nại
            </label>
            <input
              type="text"
              value={data.supportPhone}
              onChange={(e) => setData({ ...data, supportPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Email Hỗ Trợ
            </label>
            <input
              type="text"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Thời Gian Hỗ Trợ (Tiếng Việt)
            </label>
            <input
              type="text"
              value={data.hours_vi}
              onChange={(e) => setData({ ...data, hours_vi: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Support Hours (English)
            </label>
            <input
              type="text"
              value={data.hours_en}
              onChange={(e) => setData({ ...data, hours_en: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Part 2: Support Topics CRUD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">
              2. Các chủ đề hỗ trợ trọng tâm ({data.topics.length} chủ đề)
            </h2>
            <p className="text-xs text-slate-400">
              Có thể thêm, sửa, xoá và đổi thứ tự các chủ đề hiển thị trên Web
            </p>
          </div>
          <button
            onClick={handleAddTopic}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
          >
            <Plus size={13} />
            + Thêm chủ đề mới
          </button>
        </div>

        <div className="space-y-3">
          {data.topics.map((topic, idx) => {
            const isExpanded = expandedId === topic.id;
            const curLang = getLang(topic.id);

            return (
              <div
                key={topic.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                {/* Header card */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                    className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                  >
                    <span className="text-xl shrink-0">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-slate-800 truncate">
                        {topic.title_vi || topic.title_en || "Chưa có tiêu đề"}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {topic.title_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleMoveTopic(idx, "up")}
                      disabled={idx === 0}
                      title="Di chuyển lên"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveTopic(idx, "down")}
                      disabled={idx === data.topics.length - 1}
                      title="Di chuyển xuống"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      title="Xoá chủ đề này"
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors ml-1"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Body Form */}
                {isExpanded && (
                  <div className="p-5 space-y-4">
                    {/* Icon picker */}
                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Biểu tượng (Icon / Emoji)
                        </label>
                        <input
                          type="text"
                          value={topic.icon}
                          onChange={(e) => handleUpdateTopic(topic.id, "icon", e.target.value)}
                          className="w-20 px-3 py-1.5 text-center text-lg rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div className="text-xs text-slate-400 pt-4">
                        (Nhập ký tự biểu tượng như: 🩺, 🏥, 💳, 📝, 🛡️, 📞)
                      </div>
                    </div>

                    {/* Bilingual toggle */}
                    <div className="border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Nội dung tiêu đề & mô tả
                        </span>
                        <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                          <button
                            type="button"
                            onClick={() => setLang(topic.id, "vi")}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                              curLang === "vi"
                                ? "bg-white text-slate-800 shadow-xs"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            🇻🇳 Tiếng Việt
                          </button>
                          <button
                            type="button"
                            onClick={() => setLang(topic.id, "en")}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
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
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Tiêu đề chủ đề (Tiếng Việt)
                            </label>
                            <input
                              type="text"
                              value={topic.title_vi}
                              onChange={(e) =>
                                handleUpdateTopic(topic.id, "title_vi", e.target.value)
                              }
                              placeholder="Tiêu đề tiếng Việt..."
                              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Mô tả hỗ trợ (Tiếng Việt)
                            </label>
                            <textarea
                              rows={3}
                              value={topic.desc_vi}
                              onChange={(e) =>
                                handleUpdateTopic(topic.id, "desc_vi", e.target.value)
                              }
                              placeholder="Mô tả nội dung hỗ trợ..."
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Topic Title (English)
                            </label>
                            <input
                              type="text"
                              value={topic.title_en}
                              onChange={(e) =>
                                handleUpdateTopic(topic.id, "title_en", e.target.value)
                              }
                              placeholder="Title in English..."
                              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Topic Description (English)
                            </label>
                            <textarea
                              rows={3}
                              value={topic.desc_en}
                              onChange={(e) =>
                                handleUpdateTopic(topic.id, "desc_en", e.target.value)
                              }
                              placeholder="Description in English..."
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
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
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-lg flex items-center justify-between gap-4">
        <button
          onClick={handleAddTopic}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <Plus size={14} />
          Thêm chủ đề
        </button>

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
              Lưu thay đổi Hỗ trợ KH
            </>
          )}
        </button>
      </div>
    </div>
  );
}
