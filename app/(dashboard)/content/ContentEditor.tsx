"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

type Row = {
  page: string;
  section: string;
  field: string;
  value_en: string;
  value_vi: string;
};

type Product = {
  title: string;
  tag: string;
  tagColor: string;
  image: string;
  description: string;
  features: string[];
};

type Step = { step: string; icon: string; text: string };
type Testimonial = {
  id: number;
  name: string;
  location: string;
  quote: string;
};
type CoreValue = { title: string; desc: string };
type WhatWeDoItem = { icon: string; title: string; desc: string };
type WhyUsItem = { title: string; desc: string };

const PAGES = [
  {
    id: "home",
    label: "\uD83C\uDFE0 Trang ch\u1EE7",
    sections: [
      { id: "hero", label: "Hero Banner" },
      { id: "products", label: "S\u1EA3n ph\u1EA9m" },
      { id: "process", label: "Quy tr\xECnh" },
      { id: "stats", label: "Th\u1ED1ng k\xEA" },
      { id: "testimonials", label: "\u0110\xE1nh gi\xE1" },
    ],
  },
  {
    id: "about",
    label: "\u2139\uFE0F Gi\u1EDBi thi\u1EC7u",
    sections: [
      { id: "story", label: "C\xE2u chuy\u1EC7n" },
      { id: "mission", label: "S\u1EE9 m\u1EC7nh & T\u1EA7m nh\xECn" },
      { id: "core_values", label: "Gi\xE1 tr\u1ECB c\u1ED1t l\xF5i" },
      { id: "team", label: "\u0110\u1ED9i ng\u0169" },
      { id: "what_we_do", label: "L\u1EE3i \u00EDch" },
      { id: "why_us", label: "T\u1EA1i sao ch\u1ECDn VP" },
      { id: "cta", label: "CTA" },
    ],
  },
  {
    id: "global",
    label: "\uD83D\uDCDE Li\xEAn h\u1EC7 & Footer",
    sections: [
      { id: "contact", label: "Th\xF4ng tin li\xEAn h\u1EC7" },
      { id: "hours", label: "Gi\u1EDD l\xE0m vi\u1EC7c" },
      { id: "social", label: "M\u1EA1ng x\xE3 h\u1ED9i" },
    ],
  },
];

const DEFAULT_PRODUCTS: Product[] = [
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
      "Full retirement thanks to the ability to generate 8–15% profit per year, absolute safety thanks to the NO LOSS policy. Protect you and your family in case of illness, disability and death.",
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
      "Compensation for more than 16 types of diseases and disabilities. Accumulate TAX-FREE retirement funds with high interest rates of 6–12%/year and flexible contract terms.",
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

const DEFAULT_PROCESS_STEPS: Step[] = [
  {
    step: "STEP 1",
    icon: "\uD83D\uDC64",
    text: "Sign up, leave your information",
  },
  {
    step: "STEP 2",
    icon: "\uD83D\uDCDE",
    text: "Agent will contact you for consultation and free quote within 24 hours.",
  },
  {
    step: "STEP 3",
    icon: "\uD83D\uDCCB",
    text: "Receive the contract proposal, and only agree to enroll in the insurance once you have fully understood the program.",
  },
  {
    step: "STEP 4",
    icon: "\uD83D\uDD0D",
    text: "Document review, medical examination (if any), wait for results in 5\u201314 days.",
  },
  {
    step: "STEP 5",
    icon: "\uD83D\uDCC4",
    text: "Get full insurance contract, complete information.",
  },
  {
    step: "STEP 6",
    icon: "\u2705",
    text: "Issue contract and pay fees. Contract takes effect immediately upon completion of fees.",
  },
  {
    step: "STEP 7",
    icon: "\uD83E\uDD1D",
    text: "Customer care department receives documents. All questions resolved free of charge 24/7.",
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
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

const DEFAULT_CORE_VALUES: CoreValue[] = [
  { title: "Conscientious", desc: "Always put customer interests first." },
  { title: "Responsibility", desc: "Committed to doing what was promised." },
  { title: "Transparent", desc: "Provide clear and honest information." },
  { title: "Reputation", desc: "Building trust through quality service." },
  { title: "Follow", desc: "Ensure all activities comply with the law." },
];

const DEFAULT_WHAT_WE_DO: WhatWeDoItem[] = [
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

const DEFAULT_WHY_US: WhyUsItem[] = [
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
    desc: 'Our consultants are experienced, well-trained Vietnamese experts with extensive knowledge of insurance products and always put \"heart\" first.',
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

function buildState(rows: Row[]) {
  const state: Record<string, Record<string, Record<string, string>>> = {};
  for (const r of rows) {
    if (!state[r.page]) state[r.page] = {};
    if (!state[r.page][r.section]) state[r.page][r.section] = {};
    state[r.page][r.section][r.field] = r.value_en;
  }
  return state;
}

function Field({
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
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${cls} resize-none`}
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

export default function ContentEditor({ initialRows }: { initialRows: Row[] }) {
  const [activePage, setActivePage] = useState("home");
  const [tab, setTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const initial = buildState(initialRows);

  const [hero, setHero] = useState({
    tagline: initial.home?.hero?.tagline ?? "A Decade of Support",
    title: initial.home?.hero?.title ?? "Building value for living fully",
    description:
      initial.home?.hero?.description ??
      "The trusted choice of over 20,000 Vietnamese families across 50 U.S. States",
    image:
      initial.home?.hero?.image ??
      "https://thinksmartinsurance.com/wp-content/uploads/2025/04/banner-1.webp",
    video_url:
      initial.home?.hero?.video_url ??
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    stat1_value: initial.home?.hero?.stat1_value ?? "20,000+",
    stat1_label: initial.home?.hero?.stat1_label ?? "Families Protected",
    stat2_value: initial.home?.hero?.stat2_value ?? "50",
    stat2_label: initial.home?.hero?.stat2_label ?? "U.S. States",
    stat3_value: initial.home?.hero?.stat3_value ?? "10+",
    stat3_label: initial.home?.hero?.stat3_label ?? "Years Trusted",
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const raw = initial.home?.products?.data;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_PRODUCTS;
  });

  const [stats, setStats] = useState({
    title:
      initial.home?.stats?.title ?? "Why choose VietPoint Insurance & Tax?",
    stat1_value: initial.home?.stats?.stat1_value ?? "10",
    stat1_suffix: initial.home?.stats?.stat1_suffix ?? "+",
    stat1_label: initial.home?.stats?.stat1_label ?? "ESTABLISH",
    stat2_value: initial.home?.stats?.stat2_value ?? "20",
    stat2_suffix: initial.home?.stats?.stat2_suffix ?? "K+",
    stat2_label: initial.home?.stats?.stat2_label ?? "CLIENT",
    stat3_value: initial.home?.stats?.stat3_value ?? "50",
    stat3_suffix: initial.home?.stats?.stat3_suffix ?? "",
    stat3_label: initial.home?.stats?.stat3_label ?? "STATE LICENSED",
    stat4_value: initial.home?.stats?.stat4_value ?? "24",
    stat4_suffix: initial.home?.stats?.stat4_suffix ?? "/7",
    stat4_label: initial.home?.stats?.stat4_label ?? "SUPPORT",
  });

  // Process
  const [processTitle, setProcessTitle] = useState(
    initial.home?.process?.title ?? "Insurance participation process",
  );
  const [processCtaText, setProcessCtaText] = useState(
    initial.home?.process?.cta_text ?? "Get Free Quote",
  );
  const [processSteps, setProcessSteps] = useState<Step[]>(() => {
    const raw = initial.home?.process?.data;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_PROCESS_STEPS;
  });

  // Testimonials
  const [testimonialsTitle, setTestimonialsTitle] = useState(
    initial.home?.testimonials?.title ?? "What our clients say about us",
  );
  const [testimonialItems, setTestimonialItems] = useState<Testimonial[]>(
    () => {
      const raw = initial.home?.testimonials?.data;
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {}
      }
      return DEFAULT_TESTIMONIALS;
    },
  );

  // About - Story
  const [aboutStory, setAboutStory] = useState({
    intro_text:
      initial.about?.story?.intro_text ??
      "Welcome to VietPoint Insurance & Tax, a trusted financial partner dedicated to serving the Vietnamese community in the United States.",
    brand_title: initial.about?.story?.brand_title ?? "Brand Story",
    brand_text:
      initial.about?.story?.brand_text ??
      "VietPoint Insurance & Tax was founded in 2013 with a clear mission: to become the most trusted Financial Doctor for every Vietnamese family in the US.",
  });

  // About - Mission & Vision
  const [aboutMission, setAboutMission] = useState({
    mission:
      initial.about?.mission?.mission ??
      "Providing comprehensive financial protection, ensuring stable income during retirement and bringing peace of mind to households in the United States.",
    vision:
      initial.about?.mission?.vision ??
      "Become the leading financial-insurance company in the US, the first choice of Vietnamese people when looking for the best insurance programs.",
  });

  // About - Core Values
  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    const raw = initial.about?.core_values?.data;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_CORE_VALUES;
  });

  // About - Team (newline-separated names)
  const [agentsText, setAgentsText] = useState(
    initial.about?.team?.agents ??
      "HUNG HUYNH\nCELINE NGUYEN\nGINA DANG\nVICKY TRIEU\nTY TRIEU\nHA NGUYEN",
  );
  const [ambassadorsText, setAmbassadorsText] = useState(
    initial.about?.team?.ambassadors ??
      "KHANH THI LE LA\nCHIEU ANH NU TRAN\nTHU THI NGUYEN",
  );

  // About - What We Do
  const [whatWeDoSubtitle, setWhatWeDoSubtitle] = useState(
    initial.about?.what_we_do?.subtitle ??
      "VietPoint Insurance & Tax provides diverse life insurance programs designed to meet all your needs. We focus on three main benefits:",
  );
  const [whatWeDoItems, setWhatWeDoItems] = useState<WhatWeDoItem[]>(() => {
    const raw = initial.about?.what_we_do?.data;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_WHAT_WE_DO;
  });

  // About - Why Us
  const [whyUsItems, setWhyUsItems] = useState<WhyUsItem[]>(() => {
    const raw = initial.about?.why_us?.data;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_WHY_US;
  });

  // About - CTA
  const [aboutCta, setAboutCta] = useState({
    title:
      initial.about?.cta?.title ?? "Ready to secure your family\u2019s future?",
    description:
      initial.about?.cta?.description ??
      "Contact us today for a free consultation.",
    button_text: initial.about?.cta?.button_text ?? "Contact Us Now",
  });

  // Global - Contact info
  const [contact, setContact] = useState({
    phone: initial.global?.contact?.phone ?? "(678) 825 3737",
    fax: initial.global?.contact?.fax ?? "(678) 825 3737",
    address:
      initial.global?.contact?.address ??
      "1424 N Brown Rd #450, Lawrenceville, GA 30043",
    email: initial.global?.contact?.email ?? "info@vietpointinsurance.com",
  });

  // Global - Office hours
  const [hours, setHours] = useState({
    weekdays:
      initial.global?.hours?.weekdays ??
      "Sunday \u2013 Thursday: 9 AM \u2013 7 PM",
    weekend: initial.global?.hours?.weekend ?? "Friday & Saturday: Closed",
  });

  // Global - Social media
  const [social, setSocial] = useState({
    facebook: initial.global?.social?.facebook ?? "#",
    instagram: initial.global?.social?.instagram ?? "#",
    twitter: initial.global?.social?.twitter ?? "#",
    youtube: initial.global?.social?.youtube ?? "#",
  });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    const supabase = createClient();
    let upsertRows: Row[] = [];

    if (tab === "hero") {
      upsertRows = Object.entries(hero).map(([field, value]) => ({
        page: "home",
        section: "hero",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "products") {
      upsertRows = [
        {
          page: "home",
          section: "products",
          field: "data",
          value_en: JSON.stringify(products),
          value_vi: "",
        },
      ];
    } else if (tab === "stats") {
      upsertRows = Object.entries(stats).map(([field, value]) => ({
        page: "home",
        section: "stats",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "process") {
      upsertRows = [
        {
          page: "home",
          section: "process",
          field: "title",
          value_en: processTitle,
          value_vi: "",
        },
        {
          page: "home",
          section: "process",
          field: "cta_text",
          value_en: processCtaText,
          value_vi: "",
        },
        {
          page: "home",
          section: "process",
          field: "data",
          value_en: JSON.stringify(processSteps),
          value_vi: "",
        },
      ];
    } else if (tab === "testimonials") {
      upsertRows = [
        {
          page: "home",
          section: "testimonials",
          field: "title",
          value_en: testimonialsTitle,
          value_vi: "",
        },
        {
          page: "home",
          section: "testimonials",
          field: "data",
          value_en: JSON.stringify(testimonialItems),
          value_vi: "",
        },
      ];
    } else if (tab === "story") {
      upsertRows = Object.entries(aboutStory).map(([field, value]) => ({
        page: "about",
        section: "story",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "mission") {
      upsertRows = Object.entries(aboutMission).map(([field, value]) => ({
        page: "about",
        section: "mission",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "core_values") {
      upsertRows = [
        {
          page: "about",
          section: "core_values",
          field: "data",
          value_en: JSON.stringify(coreValues),
          value_vi: "",
        },
      ];
    } else if (tab === "team") {
      upsertRows = [
        {
          page: "about",
          section: "team",
          field: "agents",
          value_en: agentsText,
          value_vi: "",
        },
        {
          page: "about",
          section: "team",
          field: "ambassadors",
          value_en: ambassadorsText,
          value_vi: "",
        },
      ];
    } else if (tab === "what_we_do") {
      upsertRows = [
        {
          page: "about",
          section: "what_we_do",
          field: "subtitle",
          value_en: whatWeDoSubtitle,
          value_vi: "",
        },
        {
          page: "about",
          section: "what_we_do",
          field: "data",
          value_en: JSON.stringify(whatWeDoItems),
          value_vi: "",
        },
      ];
    } else if (tab === "why_us") {
      upsertRows = [
        {
          page: "about",
          section: "why_us",
          field: "data",
          value_en: JSON.stringify(whyUsItems),
          value_vi: "",
        },
      ];
    } else if (tab === "cta") {
      upsertRows = Object.entries(aboutCta).map(([field, value]) => ({
        page: "about",
        section: "cta",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "contact") {
      upsertRows = Object.entries(contact).map(([field, value]) => ({
        page: "global",
        section: "contact",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "hours") {
      upsertRows = Object.entries(hours).map(([field, value]) => ({
        page: "global",
        section: "hours",
        field,
        value_en: value,
        value_vi: "",
      }));
    } else if (tab === "social") {
      upsertRows = Object.entries(social).map(([field, value]) => ({
        page: "global",
        section: "social",
        field,
        value_en: value,
        value_vi: "",
      }));
    }

    const { error: err } = await supabase
      .from("page_content")
      .upsert(upsertRows, { onConflict: "page,section,field" });

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      {/* Page selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePage(p.id);
              setTab(p.sections[0].id);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activePage === p.id
                ? "bg-[#2F5E9E] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Section tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 p-1 flex-wrap">
        {PAGES.find((p) => p.id === activePage)?.sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setTab(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === s.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
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

      {/* ─── HERO TAB ─── */}
      {tab === "hero" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Văn bản
            </p>
            <Field
              label="Tagline (chữ nghiêng phía trên)"
              value={hero.tagline}
              onChange={(v) => setHero((p) => ({ ...p, tagline: v }))}
              placeholder="A Decade of Support"
            />
            <Field
              label="Tiêu đề chính"
              value={hero.title}
              onChange={(v) => setHero((p) => ({ ...p, title: v }))}
              placeholder="Building value for living fully"
            />
            <Field
              label="Mô tả"
              value={hero.description}
              onChange={(v) => setHero((p) => ({ ...p, description: v }))}
              textarea
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Hình ảnh &amp; Video
            </p>
            <Field
              label="URL Hình ảnh Banner"
              value={hero.image}
              onChange={(v) => setHero((p) => ({ ...p, image: v }))}
              placeholder="https://..."
              hint="Dán link ảnh trực tiếp (jpg, webp, png)"
            />
            {hero.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.image}
                alt="preview"
                className="w-full max-w-sm h-40 object-cover rounded-xl border border-slate-100"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
              />
            )}
            <Field
              label="URL Video (YouTube Embed)"
              value={hero.video_url}
              onChange={(v) => setHero((p) => ({ ...p, video_url: v }))}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              hint="Lấy từ YouTube: Share → Embed → copy phần src"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              3 Thẻ thống kê nổi
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100"
                >
                  <p className="text-xs font-bold text-slate-500">Thẻ {n}</p>
                  <Field
                    label="Số / giá trị"
                    value={(hero as Record<string, string>)[`stat${n}_value`]}
                    onChange={(v) =>
                      setHero((p) => ({ ...p, [`stat${n}_value`]: v }))
                    }
                    placeholder="20,000+"
                  />
                  <Field
                    label="Nhãn"
                    value={(hero as Record<string, string>)[`stat${n}_label`]}
                    onChange={(v) =>
                      setHero((p) => ({ ...p, [`stat${n}_label`]: v }))
                    }
                    placeholder="Families Protected"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── PRODUCTS TAB ─── */}
      {tab === "products" && (
        <div className="space-y-4">
          {products.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-blue-600 rounded-lg px-2.5 py-1">
                  SP {i + 1}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {p.title}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Tên sản phẩm"
                  value={p.title}
                  onChange={(v) => {
                    const next = [...products];
                    next[i] = { ...next[i], title: v };
                    setProducts(next);
                  }}
                />
                <Field
                  label="Tag hiển thị"
                  value={p.tag}
                  onChange={(v) => {
                    const next = [...products];
                    next[i] = { ...next[i], tag: v };
                    setProducts(next);
                  }}
                />
              </div>
              <Field
                label="URL Hình ảnh"
                value={p.image}
                onChange={(v) => {
                  const next = [...products];
                  next[i] = { ...next[i], image: v };
                  setProducts(next);
                }}
                placeholder="https://..."
              />
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt="preview"
                  className="w-full max-w-xs h-32 object-cover rounded-xl border border-slate-100"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              )}
              <Field
                label="Mô tả sản phẩm"
                value={p.description}
                onChange={(v) => {
                  const next = [...products];
                  next[i] = { ...next[i], description: v };
                  setProducts(next);
                }}
                textarea
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Tính năng (mỗi dòng 1 tính năng)
                </label>
                <textarea
                  rows={4}
                  value={p.features.join("\n")}
                  onChange={(e) => {
                    const next = [...products];
                    next[i] = {
                      ...next[i],
                      features: e.target.value
                        .split("\n")
                        .filter((x) => x.trim()),
                    };
                    setProducts(next);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── STATS TAB ─── */}
      {tab === "stats" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <Field
            label="Tiêu đề section"
            value={stats.title}
            onChange={(v) => setStats((p) => ({ ...p, title: v }))}
          />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100"
              >
                <p className="text-xs font-bold text-slate-500">Thống kê {n}</p>
                <Field
                  label="Số (chỉ số)"
                  value={(stats as Record<string, string>)[`stat${n}_value`]}
                  onChange={(v) =>
                    setStats((p) => ({ ...p, [`stat${n}_value`]: v }))
                  }
                  placeholder="10"
                />
                <Field
                  label="Hậu tố (vd: +, K+, /7)"
                  value={(stats as Record<string, string>)[`stat${n}_suffix`]}
                  onChange={(v) =>
                    setStats((p) => ({ ...p, [`stat${n}_suffix`]: v }))
                  }
                  placeholder="+"
                />
                <Field
                  label="Nhãn"
                  value={(stats as Record<string, string>)[`stat${n}_label`]}
                  onChange={(v) =>
                    setStats((p) => ({ ...p, [`stat${n}_label`]: v }))
                  }
                  placeholder="ESTABLISH"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PROCESS TAB ─── */}
      {tab === "process" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <Field
              label="Tiêu đề section"
              value={processTitle}
              onChange={setProcessTitle}
            />
            <Field
              label="Nút CTA"
              value={processCtaText}
              onChange={setProcessCtaText}
            />
          </div>
          {processSteps.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-green-600 rounded-lg px-2.5 py-1">
                  {s.step}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setProcessSteps(processSteps.filter((_, j) => j !== i))
                  }
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Xoá
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Nhãn bước"
                  value={s.step}
                  onChange={(v) => {
                    const next = [...processSteps];
                    next[i] = { ...next[i], step: v };
                    setProcessSteps(next);
                  }}
                />
                <Field
                  label="Icon (emoji)"
                  value={s.icon}
                  onChange={(v) => {
                    const next = [...processSteps];
                    next[i] = { ...next[i], icon: v };
                    setProcessSteps(next);
                  }}
                />
              </div>
              <Field
                label="Nội dung"
                value={s.text}
                onChange={(v) => {
                  const next = [...processSteps];
                  next[i] = { ...next[i], text: v };
                  setProcessSteps(next);
                }}
                textarea
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProcessSteps([
                ...processSteps,
                {
                  step: `STEP ${processSteps.length + 1}`,
                  icon: "⭐",
                  text: "",
                },
              ])
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Thêm bước
          </button>
        </div>
      )}

      {/* ─── TESTIMONIALS TAB ─── */}
      {tab === "testimonials" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <Field
              label="Tiêu đề section"
              value={testimonialsTitle}
              onChange={setTestimonialsTitle}
            />
          </div>
          {testimonialItems.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">
                  Đánh giá {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialItems(
                      testimonialItems.filter((_, j) => j !== i),
                    )
                  }
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Xoá
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Tên"
                  value={t.name}
                  onChange={(v) => {
                    const next = [...testimonialItems];
                    next[i] = { ...next[i], name: v };
                    setTestimonialItems(next);
                  }}
                />
                <Field
                  label="Địa điểm"
                  value={t.location}
                  onChange={(v) => {
                    const next = [...testimonialItems];
                    next[i] = { ...next[i], location: v };
                    setTestimonialItems(next);
                  }}
                />
              </div>
              <Field
                label="Nội dung đánh giá"
                value={t.quote}
                onChange={(v) => {
                  const next = [...testimonialItems];
                  next[i] = { ...next[i], quote: v };
                  setTestimonialItems(next);
                }}
                textarea
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setTestimonialItems([
                ...testimonialItems,
                { id: Date.now(), name: "", location: "", quote: "" },
              ])
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Thêm đánh giá
          </button>
        </div>
      )}

      {/* ─── ABOUT STORY TAB ─── */}
      {tab === "story" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Giới thiệu công ty
          </p>
          <Field
            label="Đoạn giới thiệu"
            value={aboutStory.intro_text}
            onChange={(v) => setAboutStory((p) => ({ ...p, intro_text: v }))}
            textarea
          />
          <Field
            label="Tiêu đề câu chuyện thương hiệu"
            value={aboutStory.brand_title}
            onChange={(v) => setAboutStory((p) => ({ ...p, brand_title: v }))}
          />
          <Field
            label="Câu chuyện thương hiệu"
            value={aboutStory.brand_text}
            onChange={(v) => setAboutStory((p) => ({ ...p, brand_text: v }))}
            textarea
          />
        </div>
      )}

      {/* ─── ABOUT MISSION TAB ─── */}
      {tab === "mission" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Sứ mệnh & Tầm nhìn
          </p>
          <Field
            label="Sứ mệnh (Mission)"
            value={aboutMission.mission}
            onChange={(v) => setAboutMission((p) => ({ ...p, mission: v }))}
            textarea
          />
          <Field
            label="Tầm nhìn (Vision)"
            value={aboutMission.vision}
            onChange={(v) => setAboutMission((p) => ({ ...p, vision: v }))}
            textarea
          />
        </div>
      )}

      {/* ─── ABOUT CORE VALUES TAB ─── */}
      {tab === "core_values" && (
        <div className="space-y-4">
          {coreValues.map((cv, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Giá trị {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCoreValues(coreValues.filter((_, j) => j !== i))
                  }
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Xoá
                </button>
              </div>
              <Field
                label="Tên giá trị"
                value={cv.title}
                onChange={(v) => {
                  const next = [...coreValues];
                  next[i] = { ...next[i], title: v };
                  setCoreValues(next);
                }}
              />
              <Field
                label="Mô tả"
                value={cv.desc}
                onChange={(v) => {
                  const next = [...coreValues];
                  next[i] = { ...next[i], desc: v };
                  setCoreValues(next);
                }}
                textarea
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setCoreValues([...coreValues, { title: "", desc: "" }])
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Thêm giá trị
          </button>
        </div>
      )}

      {/* ─── ABOUT TEAM TAB ─── */}
      {tab === "team" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Đội ngũ
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Đại lý (mỗi dòng 1 tên)
            </label>
            <textarea
              rows={6}
              value={agentsText}
              onChange={(e) => setAgentsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Đại sứ thương hiệu (mỗi dòng 1 tên)
            </label>
            <textarea
              rows={4}
              value={ambassadorsText}
              onChange={(e) => setAmbassadorsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none bg-white"
            />
          </div>
        </div>
      )}

      {/* ─── WHAT WE DO TAB ─── */}
      {tab === "what_we_do" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <Field
              label="Đoạn mô tả phụ đề"
              value={whatWeDoSubtitle}
              onChange={setWhatWeDoSubtitle}
              textarea
            />
          </div>
          {whatWeDoItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Lợi ích {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setWhatWeDoItems(whatWeDoItems.filter((_, j) => j !== i))
                  }
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Xoá
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <Field
                  label="Icon (emoji)"
                  value={item.icon}
                  onChange={(v) => {
                    const n = [...whatWeDoItems];
                    n[i] = { ...n[i], icon: v };
                    setWhatWeDoItems(n);
                  }}
                />
                <div className="col-span-3">
                  <Field
                    label="Tiêu đề"
                    value={item.title}
                    onChange={(v) => {
                      const n = [...whatWeDoItems];
                      n[i] = { ...n[i], title: v };
                      setWhatWeDoItems(n);
                    }}
                  />
                </div>
              </div>
              <Field
                label="Mô tả"
                value={item.desc}
                onChange={(v) => {
                  const n = [...whatWeDoItems];
                  n[i] = { ...n[i], desc: v };
                  setWhatWeDoItems(n);
                }}
                textarea
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setWhatWeDoItems([
                ...whatWeDoItems,
                { icon: "⭐", title: "", desc: "" },
              ])
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Thêm lợi ích
          </button>
        </div>
      )}

      {/* ─── WHY US TAB ─── */}
      {tab === "why_us" && (
        <div className="space-y-4">
          {whyUsItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-[#2F5E9E] rounded-lg px-2.5 py-1">
                  Lý do {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setWhyUsItems(whyUsItems.filter((_, j) => j !== i))
                  }
                  className="text-red-400 hover:text-red-600 text-xs font-medium"
                >
                  Xoá
                </button>
              </div>
              <Field
                label="Tiêu đề"
                value={item.title}
                onChange={(v) => {
                  const n = [...whyUsItems];
                  n[i] = { ...n[i], title: v };
                  setWhyUsItems(n);
                }}
              />
              <Field
                label="Mô tả"
                value={item.desc}
                onChange={(v) => {
                  const n = [...whyUsItems];
                  n[i] = { ...n[i], desc: v };
                  setWhyUsItems(n);
                }}
                textarea
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setWhyUsItems([...whyUsItems, { title: "", desc: "" }])
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Thêm lý do
          </button>
        </div>
      )}

      {/* ─── ABOUT CTA TAB ─── */}
      {tab === "cta" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Kêu gọi hành động (cuối trang About)
          </p>
          <Field
            label="Tiêu đề"
            value={aboutCta.title}
            onChange={(v) => setAboutCta((p) => ({ ...p, title: v }))}
          />
          <Field
            label="Mô tả"
            value={aboutCta.description}
            onChange={(v) => setAboutCta((p) => ({ ...p, description: v }))}
            textarea
          />
          <Field
            label="Nội dung nút"
            value={aboutCta.button_text}
            onChange={(v) => setAboutCta((p) => ({ ...p, button_text: v }))}
            placeholder="Contact Us Now"
          />
        </div>
      )}

      {/* ─── CONTACT TAB ─── */}
      {tab === "contact" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Thông tin liên hệ (dùng cho Footer)
          </p>
          <Field
            label="Số điện thoại"
            value={contact.phone}
            onChange={(v) => setContact((p) => ({ ...p, phone: v }))}
            placeholder="(678) 825 3737"
          />
          <Field
            label="Số Fax"
            value={contact.fax}
            onChange={(v) => setContact((p) => ({ ...p, fax: v }))}
            placeholder="(678) 825 3737"
          />
          <Field
            label="Địa chỉ"
            value={contact.address}
            onChange={(v) => setContact((p) => ({ ...p, address: v }))}
            placeholder="1424 N Brown Rd #450, Lawrenceville, GA 30043"
            textarea
          />
          <Field
            label="Email"
            value={contact.email}
            onChange={(v) => setContact((p) => ({ ...p, email: v }))}
            placeholder="info@vietpointinsurance.com"
          />
        </div>
      )}

      {/* ─── HOURS TAB ─── */}
      {tab === "hours" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Giờ làm việc
          </p>
          <Field
            label="Ngày thường"
            value={hours.weekdays}
            onChange={(v) => setHours((p) => ({ ...p, weekdays: v }))}
            placeholder="Sunday – Thursday: 9 AM – 7 PM"
          />
          <Field
            label="Cuối tuần"
            value={hours.weekend}
            onChange={(v) => setHours((p) => ({ ...p, weekend: v }))}
            placeholder="Friday & Saturday: Closed"
          />
        </div>
      )}

      {/* ─── SOCIAL TAB ─── */}
      {tab === "social" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Mạng xã hội
          </p>
          <Field
            label="Facebook URL"
            value={social.facebook}
            onChange={(v) => setSocial((p) => ({ ...p, facebook: v }))}
            placeholder="https://facebook.com/..."
          />
          <Field
            label="Instagram URL"
            value={social.instagram}
            onChange={(v) => setSocial((p) => ({ ...p, instagram: v }))}
            placeholder="https://instagram.com/..."
          />
          <Field
            label="Twitter / X URL"
            value={social.twitter}
            onChange={(v) => setSocial((p) => ({ ...p, twitter: v }))}
            placeholder="https://x.com/..."
          />
          <Field
            label="YouTube URL"
            value={social.youtube}
            onChange={(v) => setSocial((p) => ({ ...p, youtube: v }))}
            placeholder="https://youtube.com/..."
          />
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
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
