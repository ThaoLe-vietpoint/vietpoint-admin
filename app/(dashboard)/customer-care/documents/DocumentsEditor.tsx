"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  FileText,
  ExternalLink,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ListPlus,
  X,
} from "lucide-react";

export type DocSection = {
  id: string;
  icon: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
  items_vi: string[];
  items_en: string[];
};

export const DEFAULT_DOC_SECTIONS: DocSection[] = [
  {
    id: "1",
    icon: "🪪",
    title_vi: "1. Các loại giấy tờ cần lưu ý khi tham gia bảo hiểm",
    title_en: "1. Key Documents to Prepare for Insurance",
    desc_vi: "Để hồ sơ bảo hiểm được duyệt nhanh chóng và đúng quy định, bạn nên chuẩn bị sẵn sàng:",
    desc_en: "To ensure your application is processed quickly and accurately, please prepare:",
    items_vi: [
      "Giấy tờ tùy thân: Driver's License hoặc State ID còn hạn.",
      "Tình trạng cư trú: Thẻ xanh (Green Card), Hộ chiếu Mỹ, hoặc giấy tờ cư trú hợp pháp.",
      "Số an sinh xã hội (SSN): Cho tất cả thành viên trong gia đình cần bảo hiểm.",
      "Chứng minh thu nhập: Form W-2, 1099, 1040 của năm gần nhất hoặc Paystubs 4 tuần gần nhất.",
      "Giấy khai sinh / Giấy tờ hợp pháp: Đối với trẻ em hoặc người phụ thuộc.",
    ],
    items_en: [
      "Identity verification: Valid Driver's License or State ID.",
      "Immigration status: Green Card, U.S. Passport, or proof of lawful presence.",
      "Social Security Numbers (SSN): For all household applicants.",
      "Proof of income: Most recent W-2, 1099, 1040 tax return, or 4 recent paystubs.",
      "Birth certificates or legal guardianship papers for dependents.",
    ],
  },
  {
    id: "2",
    icon: "✉️",
    title_vi: "2. Cách đọc thư thông báo từ hãng bảo hiểm",
    title_en: "2. Understanding Notices from Your Insurance Carrier",
    desc_vi: "Hãng bảo hiểm thường gửi các loại thư thông báo quan trọng qua đường bưu điện hoặc email:",
    desc_en: "Insurance carriers frequently send important notices via mail or email:",
    items_vi: [
      "Notice of Coverage / Member ID Card: Thẻ bảo hiểm và xác nhận hiệu lực bảo hiểm.",
      "Premium Billing Notice: Thông báo đóng phí hàng tháng, ngày đến hạn và số tiền cần đóng.",
      "Policy Renewal Notice: Thông báo gia hạn vào cuối năm, nêu rõ các thay đổi về quyền lợi và biểu phí năm mới.",
      "Notice of Action: Thư thông báo thay đổi trạng thái hồ sơ hoặc cảnh báo nguy cơ hủy hợp đồng nếu trễ phí.",
    ],
    items_en: [
      "Notice of Coverage / Member ID Card: Official proof of coverage and card details.",
      "Premium Billing Notice: Monthly premium amount, payment due date, and payment methods.",
      "Policy Renewal Notice: Annual renewal details, benefits changes, and updated premiums.",
      "Notice of Action: Important status change warnings or pending policy cancellation notices.",
    ],
  },
  {
    id: "3",
    icon: "🏥",
    title_vi: "3. Giải thích hóa đơn y tế (Medical Bill)",
    title_en: "3. Demystifying Medical Bills",
    desc_vi: "Khi khám bệnh, bệnh viện hoặc phòng khám sẽ gửi hóa đơn về nhà. Hãy lưu ý các nguyên tắc quan trọng:",
    desc_en: "Receiving bills from clinics or hospitals can be confusing. Follow these vital rules:",
    items_vi: [
      "Đừng vội thanh toán ngay: Luôn chờ nhận được giấy EOB từ hãng bảo hiểm trước khi trả tiền hóa đơn bệnh viện.",
      "Đối chiếu mã dịch vụ: Kiểm tra ngày khám, tên bác sĩ và dịch vụ đã làm xem có trùng khớp với buổi khám thực tế hay không.",
      "Phân biệt Bill thật và Statement: Có những tờ giấy chỉ là bản tóm tắt chi phí chưa trừ bảo hiểm.",
      "Nếu nghi ngờ sai sót: Mang giấy tờ đến văn phòng VietPoint để chuyên viên đối chiếu và khiếu nại giúp bạn.",
    ],
    items_en: [
      "Do NOT pay immediately: Always wait for the Explanation of Benefits (EOB) from your insurance before paying any provider bill.",
      "Verify services: Match the date of service, provider name, and procedures with your actual visit.",
      "Recognize bill types: Ensure you are looking at the final patient responsibility balance, not the pre-insurance charge.",
      "Have questions? Bring your bill to VietPoint, and our specialists will verify charges on your behalf.",
    ],
  },
  {
    id: "4",
    icon: "📊",
    title_vi: "4. Giải thích giấy thông báo chi phí (EOB - Explanation of Benefits)",
    title_en: "4. Understanding the EOB (Explanation of Benefits)",
    desc_vi: "EOB không phải là hóa đơn đòi tiền (This is NOT a bill), mà là bảng giải trình quyền lợi bảo hiểm:",
    desc_en: "Remember: The EOB is NOT a bill. It is an explanation of how your insurance processed your claim:",
    items_vi: [
      "Amount Billed: Số tiền cơ sở y tế yêu cầu thanh toán ban đầu.",
      "Allowed Amount / Plan Discount: Mức giá giảm theo hợp đồng giữa hãng bảo hiểm và nhà cung cấp dịch vụ.",
      "Paid by Insurer: Số tiền hãng bảo hiểm đã chi trả cho bệnh viện/phòng khám.",
      "Your Responsibility (You Owe): Số tiền thực tế bạn có nghĩa vụ phải thanh toán (bao gồm Copay, Deductible, Coinsurance).",
    ],
    items_en: [
      "Amount Billed: The total fee the doctor or facility submitted.",
      "Allowed Amount / Network Discount: The contracted discounted rate negotiated by your insurer.",
      "Paid by Insurer: The portion covered and paid directly by your insurance plan.",
      "Your Responsibility: The actual amount you owe the provider (Deductible, Copay, Coinsurance).",
    ],
  },
  {
    id: "5",
    icon: "⏳",
    title_vi: "5. Cách bổ sung giấy tờ khi có yêu cầu (Verification Notice)",
    title_en: "5. Handling Verification Notices (Document Requests)",
    desc_vi: "Thị trường bảo hiểm (Marketplace / HealthCare.gov) có thể gửi yêu cầu xác minh thông tin:",
    desc_en: "Marketplace / HealthCare.gov may request proof to confirm your eligibility:",
    items_vi: [
      "Thời hạn quy định: Thường là 90 ngày kể từ ngày thông báo. Nếu quá hạn, trợ cấp thuế có thể bị cắt hoặc hợp đồng bị hủy.",
      "Loại tài liệu thường yêu cầu: Xác minh thu nhập hàng năm (Proof of Income), Tình trạng cư trú (Immigration Status).",
      "Cách gửi giấy tờ: Tải lên trực tuyến qua tài khoản Marketplace hoặc gửi qua chuyên viên đại diện VietPoint.",
      "Xác nhận hoàn tất: VietPoint luôn theo dõi sát sao đến khi hệ thống chính thức chấp thuận giấy tờ của bạn.",
    ],
    items_en: [
      "Strict Deadline: You usually have 90 days from the notice date. Missing this can result in losing subsidies or coverage.",
      "Common Requested Documents: Proof of income (1040, W-2, paystubs) or immigration documents.",
      "Submission Options: Upload directly through HealthCare.gov portal or send to your VietPoint agent for submission.",
      "Confirmation: VietPoint monitors your Marketplace account until your documents are officially verified and approved.",
    ],
  },
];

export default function DocumentsEditor({
  initialSections,
}: {
  initialSections?: DocSection[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState<DocSection[]>(
    initialSections && initialSections.length > 0
      ? initialSections
      : DEFAULT_DOC_SECTIONS
  );
  const [expandedId, setExpandedId] = useState<string | null>(
    sections[0]?.id || null
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAddSection = () => {
    const newId = Date.now().toString();
    const newSection: DocSection = {
      id: newId,
      icon: "📄",
      title_vi: `${sections.length + 1}. Hướng dẫn mới`,
      title_en: `${sections.length + 1}. New Guide`,
      desc_vi: "Mô tả ngắn gọn về tài liệu này...",
      desc_en: "Brief description of this document...",
      items_vi: ["Lưu ý quan trọng thứ nhất"],
      items_en: ["First key takeaway"],
    };
    setSections((prev) => [...prev, newSection]);
    setExpandedId(newId);
  };

  const handleUpdateSection = (
    id: string,
    field: keyof Omit<DocSection, "items_vi" | "items_en">,
    val: string
  ) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleDeleteSection = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bài hướng dẫn này?")) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleMove = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const arr = [...sections];
    const temp = arr[index];
    arr[index] = arr[target];
    arr[target] = temp;
    setSections(arr);
  };

  // Bullet items management
  const handleAddItem = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            items_vi: [...s.items_vi, "Nội dung mục mới..."],
            items_en: [...s.items_en, "New item detail..."],
          };
        }
        return s;
      })
    );
  };

  const handleUpdateItem = (
    sectionId: string,
    itemIndex: number,
    lang: "vi" | "en",
    val: string
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          const key = lang === "vi" ? "items_vi" : "items_en";
          const newArr = [...s[key]];
          newArr[itemIndex] = val;
          return { ...s, [key]: newArr };
        }
        return s;
      })
    );
  };

  const handleDeleteItem = (sectionId: string, itemIndex: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            items_vi: s.items_vi.filter((_, idx) => idx !== itemIndex),
            items_en: s.items_en.filter((_, idx) => idx !== itemIndex),
          };
        }
        return s;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const supabase = createClient();
      const payload = JSON.stringify(sections);

      const { error: err } = await supabase.from("page_content").upsert(
        {
          page: "customer_care",
          section: "documents",
          field: "data",
          value_en: payload,
          value_vi: payload,
        },
        { onConflict: "page,section,field" }
      );

      if (err) {
        setError(err.message);
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (e: any) {
      setError(e.message || "Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

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
            Hướng dẫn giấy tờ (Document Guides)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý các bài hướng dẫn đọc thư bảo hiểm, EOB, Medical Bill và bổ sung hồ sơ hiển thị trên trang /customer-care/documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:3000/customer-care/documents"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <ExternalLink size={13} />
            Xem trên Web
          </a>
          <button
            onClick={handleAddSection}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus size={14} />
            Thêm bài hướng dẫn
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
          <CheckCircle2 size={16} />
          Đã lưu thành công! Trang Hướng dẫn giấy tờ trên Web đã được cập nhật.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
          Lỗi: {error}
        </div>
      )}

      {/* Guides List */}
      <div className="space-y-4">
        {sections.map((sec, index) => {
          const isExpanded = expandedId === sec.id;
          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Header row */}
              <div className="p-4 flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                >
                  <span className="text-2xl shrink-0 p-1 bg-white rounded-lg border border-slate-100">
                    {sec.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {sec.title_vi || "Chưa có tiêu đề"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {sec.title_en || "No English title"} • {sec.items_vi.length} mục chi tiết
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                    title="Lên trên"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === sections.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                    title="Xuống dưới"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 ml-1"
                    title="Xoá bài này"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : sec.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 ml-1"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 space-y-5 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Icon (Emoji)
                      </label>
                      <input
                        type="text"
                        value={sec.icon}
                        onChange={(e) => handleUpdateSection(sec.id, "icon", e.target.value)}
                        className="w-full px-3 py-2 text-center text-xl rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Tiêu đề (Tiếng Việt)
                      </label>
                      <input
                        type="text"
                        value={sec.title_vi}
                        onChange={(e) => handleUpdateSection(sec.id, "title_vi", e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-slate-800 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      value={sec.title_en}
                      onChange={(e) => handleUpdateSection(sec.id, "title_en", e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-700 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Đoạn mở đầu (Tiếng Việt)
                      </label>
                      <textarea
                        rows={2}
                        value={sec.desc_vi}
                        onChange={(e) => handleUpdateSection(sec.id, "desc_vi", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Introduction (English)
                      </label>
                      <textarea
                        rows={2}
                        value={sec.desc_en}
                        onChange={(e) => handleUpdateSection(sec.id, "desc_en", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Các mục chi tiết ({sec.items_vi.length} mục)
                      </h4>
                      <button
                        onClick={() => handleAddItem(sec.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
                      >
                        <ListPlus size={13} />
                        Thêm dòng chi tiết
                      </button>
                    </div>

                    <div className="space-y-3">
                      {sec.items_vi.map((itVi, idx) => {
                        const itEn = sec.items_en[idx] || "";
                        return (
                          <div
                            key={idx}
                            className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl relative group"
                          >
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/60 text-[11px] text-slate-500 font-semibold">
                              <span>Mục #{idx + 1}</span>
                              <button
                                onClick={() => handleDeleteItem(sec.id, idx)}
                                className="text-red-400 hover:text-red-600 p-0.5 rounded"
                                title="Xoá dòng này"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">Tiếng Việt</label>
                                <textarea
                                  rows={2}
                                  value={itVi}
                                  onChange={(e) =>
                                    handleUpdateItem(sec.id, idx, "vi", e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">English</label>
                                <textarea
                                  rows={2}
                                  value={itEn}
                                  onChange={(e) =>
                                    handleUpdateItem(sec.id, idx, "en", e.target.value)
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-lg flex items-center justify-between gap-4">
        <button
          onClick={handleAddSection}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <Plus size={14} />
          Thêm bài hướng dẫn
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
              Lưu thay đổi Hướng dẫn giấy tờ
            </>
          )}
        </button>
      </div>
    </div>
  );
}
