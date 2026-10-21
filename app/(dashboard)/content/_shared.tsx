"use client";
import { useState, useRef, useEffect } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Row = {
  page: string;
  section: string;
  field: string;
  value_en: string;
  value_vi: string;
};

export type Product = {
  title: string;
  tag: string;
  tagColor: string;
  image: string;
  description: string;
  features: string[];
  title_vi?: string;
  tag_vi?: string;
  description_vi?: string;
  features_vi?: string[];
};

export type Step = {
  step: string;
  icon: string;
  text: string;
  text_vi?: string;
};
export type Testimonial = {
  id: number;
  name: string;
  location: string;
  quote: string;
};
export type CoreValue = {
  title: string;
  desc: string;
  title_vi?: string;
  desc_vi?: string;
};
export type WhatWeDoItem = {
  icon: string;
  title: string;
  desc: string;
  title_vi?: string;
  desc_vi?: string;
};
export type WhyUsItem = {
  title: string;
  desc: string;
  title_vi?: string;
  desc_vi?: string;
};
export type Position = {
  title: string;
  type: string;
  location: string;
  desc: string;
  title_vi?: string;
  type_vi?: string;
  location_vi?: string;
  desc_vi?: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const DEFAULT_PRODUCTS: Product[] = [
  {
    title: "IUL For Kids (EBTP)",
    tag: "Children Protection",
    tagColor: "#4CAF50",
    image:
      "https://thinksmartinsurance.com/wp-content/uploads/2025/04/EBTP-1024x683.webp",
    description:
      "Protect your children and build a financial fund for them to enter university, giving them wings to fly far and higher at the age of 18.",
    features: [
      "Education fund",
      "Life protection",
      "Builds cash value",
      "Flexible premiums",
    ],
  },
  {
    title: "Max Funded IUL",
    tag: "Retirement Planning",
    tagColor: "#2196F3",
    image:
      "https://thinksmartinsurance.com/wp-content/uploads/2025/04/Maxfund-1024x683.webp",
    description:
      "Full retirement thanks to the ability to generate 8–15% profit per year, absolute safety thanks to the NO LOSS policy.",
    features: [
      "8–15% profit/year",
      "NO LOSS policy",
      "Illness protection",
      "Death benefit",
    ],
  },
  {
    title: "IUL Secrets",
    tag: "Premium IUL",
    tagColor: "#2F5E9E",
    image:
      "https://thinksmartinsurance.com/wp-content/uploads/2025/04/IUL-1024x683.webp",
    description:
      "Compensation for more than 16 types of diseases and disabilities. Accumulate TAX-FREE retirement funds with high interest rates of 6–12%/year.",
    features: [
      "16+ disease types",
      "TAX-FREE retirement",
      "6–12%/year returns",
      "Death benefit",
    ],
  },
  {
    title: "Term Life",
    tag: "Term Insurance",
    tagColor: "#FF9800",
    image:
      "https://thinksmartinsurance.com/wp-content/uploads/2025/04/Term-Life-1024x683.webp",
    description:
      "CHEAP PRICE, suitable for all participants. Compensation for more than 16 types of diseases, disabilities and death with a contract term of up to 30 years.",
    features: [
      "Affordable premiums",
      "16+ disease types",
      "Up to 30 years",
      "Disability coverage",
    ],
  },
];

export const DEFAULT_PROCESS_STEPS: Step[] = [
  { step: "STEP 1", icon: "👤", text: "Sign up, leave your information" },
  {
    step: "STEP 2",
    icon: "📞",
    text: "Agent will contact you for consultation and free quote within 24 hours.",
  },
  {
    step: "STEP 3",
    icon: "📋",
    text: "Receive the contract proposal, and only agree to enroll in the insurance once you have fully understood the program.",
  },
  {
    step: "STEP 4",
    icon: "🔍",
    text: "Document review, medical examination (if any), wait for results in 5–14 days.",
  },
  {
    step: "STEP 5",
    icon: "📄",
    text: "Get full insurance contract, complete information.",
  },
  {
    step: "STEP 6",
    icon: "✅",
    text: "Issue contract and pay fees. Contract takes effect immediately upon completion of fees.",
  },
  {
    step: "STEP 7",
    icon: "🤝",
    text: "Customer care department receives documents. All questions resolved free of charge 24/7.",
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Mrs. Nhung",
    location: "Chicago",
    quote:
      "If I get sick and can't work anymore, the company will compensate me. This makes me feel more secure because I am responsible for my two children.",
  },
  {
    id: 2,
    name: "Pastor. Joseph",
    location: "Texas",
    quote:
      "If you want to have a comfortable retirement, start saving today. The money you save will not be lost but is an investment in your future.",
  },
  {
    id: 3,
    name: "Mrs. Tuyet",
    location: "Hawaii",
    quote:
      "I feel secure knowing that I have prepared enough for the future without bothering my children. That is the gift I want to give to my family.",
  },
  {
    id: 4,
    name: "Mrs. Michelle",
    location: "Georgia",
    quote:
      "I decided to cancel my two old insurance contracts and switch to IUL Secrets for my family because the previous programs only provided benefits upon death.",
  },
  {
    id: 5,
    name: "Mrs. Thao",
    location: "Virginia",
    quote:
      "Working nails in the U.S, I cannot leave a large fortune, but at least I can ensure my children have some money when I am no longer here.",
  },
  {
    id: 6,
    name: "Mr. Chau",
    location: "Virginia",
    quote:
      "I don't know how long or short my life will be, I don't want to be a burden to my children when I am old. It's great to prepare now.",
  },
];

export const DEFAULT_CORE_VALUES: CoreValue[] = [
  { title: "Conscientious", desc: "Always put customer interests first." },
  { title: "Responsibility", desc: "Committed to doing what was promised." },
  { title: "Transparent", desc: "Provide clear and honest information." },
  { title: "Reputation", desc: "Building trust through quality service." },
  { title: "Follow", desc: "Ensure all activities comply with the law." },
];

export const DEFAULT_WHAT_WE_DO: WhatWeDoItem[] = [
  {
    icon: "🛡️",
    title: "Death benefits",
    desc: "Protect your loved ones financially in case the unfortunate happens.",
  },
  {
    icon: "🏥",
    title: "Right to life",
    desc: "Financial support when you face serious health risks.",
  },
  {
    icon: "💰",
    title: "Retirement savings",
    desc: "Provides a stable and secure source of income with attractive interest rates (from 6–15%), tax-deferred and tax-free withdrawal at retirement age.",
  },
];

export const DEFAULT_WHY_US: WhyUsItem[] = [
  {
    title: "Trusted Partner",
    desc: "We represent leading insurance companies in the US, ensuring the highest quality and most reliable products.",
  },
  {
    title: "Excellent Customer Service",
    desc: "We are committed to providing the best service experience, with a knowledgeable, reliable, and responsive support team available online or in person, in both English and Vietnamese.",
  },
  {
    title: "Experienced Consulting Team",
    desc: 'Our consultants are experienced, well-trained Vietnamese experts with extensive knowledge of insurance products and always put "heart" first.',
  },
  {
    title: "Reliable & Quality Products",
    desc: "We partner with leading US insurance companies to provide the most trusted life insurance products, using cutting-edge technology to make the process quick and easy.",
  },
  {
    title: "Personalized Solutions",
    desc: "We understand that each customer has a unique situation and needs. Therefore, we always strive to provide insurance solutions tailored to each individual's financial goals.",
  },
  {
    title: "Modern Technology",
    desc: "We apply the latest technological advances to provide a fast, convenient and easy service experience.",
  },
];

export const DEFAULT_POSITIONS: Position[] = [
  {
    title: "Licensed Insurance Agent",
    type: "Full-time / Part-time",
    location: "Remote (Georgia preferred)",
    desc: "Join our team of elite agents serving the Vietnamese-American community. We provide full training, licensing support, and an established client pipeline.",
  },
  {
    title: "Insurance Consultant (Vietnamese Speaker)",
    type: "Full-time",
    location: "Lawrenceville, GA",
    desc: "Work directly with Vietnamese clients to assess their insurance needs, present suitable policies, and build long-term financial relationships.",
  },
  {
    title: "Client Success Associate",
    type: "Part-time",
    location: "Remote",
    desc: "Support existing policyholders with claims, policy questions, renewals, and ongoing communication. Bilingual (Vietnamese/English) required.",
  },
];

export const DEFAULT_BENEFITS: string[] = [
  "Uncapped commission income",
  "Flexible work schedule",
  "Full training & licensing sponsorship",
  "Supportive team environment",
  "Leadership advancement opportunities",
  "Serving a meaningful mission for our community",
];

export const DEFAULT_VERIFY_TIPS: string[] = [
  "Always verify your agent through this official tool before providing personal information",
  "Official VietPoint agents will never ask for Social Security Numbers via text or unencrypted email",
  'All official consultants have a VietPoint-issued license ID starting with "TS-"',
  "If in doubt, call our office directly: (678) 825-3737",
];

export const DEFAULT_VERIFY_TIPS_VI: string[] = [
  "Luôn xác minh đại lý của bạn qua công cụ chính thức này trước khi cung cấp thông tin cá nhân",
  "Đại lý VietPoint chính thức sẽ không bao giờ yêu cầu số An Sinh Xã Hội qua tin nhắn hoặc email không mã hóa",
  'Tất cả tư vấn viên chính thức đều có mã giấy phép do VietPoint cấp bắt đầu bằng "TS-"',
  "Nếu nghi ngờ, hãy gọi trực tiếp văn phòng chúng tôi: (678) 825-3737",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function buildState(rows: Row[]) {
  const state: Record<string, Record<string, Record<string, string>>> = {};
  for (const r of rows) {
    if (!state[r.page]) state[r.page] = {};
    if (!state[r.page][r.section]) state[r.page][r.section] = {};
    state[r.page][r.section][r.field] = r.value_en;
  }
  return state;
}

export function buildStateVi(rows: Row[]) {
  const state: Record<string, Record<string, Record<string, string>>> = {};
  for (const r of rows) {
    if (!state[r.page]) state[r.page] = {};
    if (!state[r.page][r.section]) state[r.page][r.section] = {};
    state[r.page][r.section][r.field] = r.value_vi ?? "";
  }
  return state;
}

// ─── Auto-resize Textarea ─────────────────────────────────────────────────────
function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className} resize-none overflow-hidden`}
      style={{ minHeight: "80px" }}
    />
  );
}

// ─── Field Component ──────────────────────────────────────────────────────────
export function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  const cls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white";
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <AutoTextarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Bilingual Field Component ────────────────────────────────────────────────
export function BiField({
  label,
  valueEn,
  valueVi,
  onChangeEn,
  onChangeVi,
  placeholder,
  textarea,
  hint,
}: {
  label: string;
  valueEn: string;
  valueVi: string;
  onChangeEn: (v: string) => void;
  onChangeVi: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  hint?: string;
}) {
  const [lang, setLang] = useState<"en" | "vi">("en");
  const cls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white";

  const renderInput = (
    val: string,
    onChange: (v: string) => void,
    ph?: string,
  ) =>
    textarea ? (
      <AutoTextarea value={val} onChange={onChange} placeholder={ph} className={cls} />
    ) : (
      <input
        type="text"
        value={val}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        className={cls}
      />
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === "en"
                ? "bg-white text-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            🇺🇸 EN
          </button>
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === "vi"
                ? "bg-white text-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            🇻🇳 VI
          </button>
        </div>
      </div>
      {lang === "en"
        ? renderInput(valueEn, onChangeEn, placeholder)
        : renderInput(valueVi, onChangeVi)}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Save Feedback ─────────────────────────────────────────────────────────────
export function SaveBar({
  saving,
  success,
  error,
  onSave,
}: {
  saving: boolean;
  success: boolean;
  error: string;
  onSave: () => void;
}) {
  return (
    <div className="space-y-3">
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} />
          Đã lưu thành công! Trang web sẽ cập nhật ngay.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          Lỗi: {error}
        </div>
      )}
      <div className="flex justify-end pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
