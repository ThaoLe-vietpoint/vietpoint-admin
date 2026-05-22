"use client";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { uploadImage, MAX_IMAGE_MB } from "@/utils/imageUpload";
import ImagePickerModal from "@/app/components/ImagePickerModal";
import {
  Row,
  Product,
  Step,
  Testimonial,
  buildState,
  buildStateVi,
  Field,
  BiField,
  SaveBar,
  DEFAULT_PRODUCTS,
  DEFAULT_PROCESS_STEPS,
  DEFAULT_TESTIMONIALS,
} from "../_shared";

const TABS = [
  { id: "hero", label: "Hero Banner" },
  { id: "products", label: "Sản phẩm" },
  { id: "stats", label: "Thống kê" },
  { id: "process", label: "Quy trình" },
  { id: "testimonials", label: "Đánh giá" },
];

export default function HomeEditor({ initialRows }: { initialRows: Row[] }) {
  const [tab, setTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();
  const heroImgRef = useRef<HTMLInputElement | null>(null);
  const [heroImgUploading, setHeroImgUploading] = useState(false);
  const productImgRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [productImgUploading, setProductImgUploading] = useState<boolean[]>([]);
  const [libraryTarget, setLibraryTarget] = useState<{
    target: "hero" | "product";
    index?: number;
  } | null>(null);

  const handleHeroImageUpload = async (file: File) => {
    setHeroImgUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, supabase);
      setHero((p) => ({ ...p, image: url }));
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : `Ảnh vượt quá ${MAX_IMAGE_MB}MB hoặc lỗi upload.`,
      );
    } finally {
      setHeroImgUploading(false);
    }
  };

  const handleProductImageUpload = async (file: File, i: number) => {
    setProductImgUploading((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    setError("");
    try {
      const url = await uploadImage(file, supabase);
      setProducts((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], image: url };
        return next;
      });
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : `Ảnh vượt quá ${MAX_IMAGE_MB}MB hoặc lỗi upload.`,
      );
    } finally {
      setProductImgUploading((prev) => {
        const next = [...prev];
        next[i] = false;
        return next;
      });
    }
  };

  const initial = buildState(initialRows);
  const initialVi = buildStateVi(initialRows);

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

  // ─── VI state (text-only fields) ─────────────────────────────────────────
  const [heroVi, setHeroVi] = useState({
    tagline: initialVi.home?.hero?.tagline ?? "",
    title: initialVi.home?.hero?.title ?? "",
    description: initialVi.home?.hero?.description ?? "",
    stat1_label: initialVi.home?.hero?.stat1_label ?? "",
    stat2_label: initialVi.home?.hero?.stat2_label ?? "",
    stat3_label: initialVi.home?.hero?.stat3_label ?? "",
  });
  const [statsTitleVi, setStatsTitleVi] = useState(
    initialVi.home?.stats?.title ?? "",
  );
  const [statsLabelsVi, setStatsLabelsVi] = useState({
    stat1_label: initialVi.home?.stats?.stat1_label ?? "",
    stat2_label: initialVi.home?.stats?.stat2_label ?? "",
    stat3_label: initialVi.home?.stats?.stat3_label ?? "",
    stat4_label: initialVi.home?.stats?.stat4_label ?? "",
  });
  const [processTitleVi, setProcessTitleVi] = useState(
    initialVi.home?.process?.title ?? "",
  );
  const [processCtaTextVi, setProcessCtaTextVi] = useState(
    initialVi.home?.process?.cta_text ?? "",
  );
  const [testimonialsTitleVi, setTestimonialsTitleVi] = useState(
    initialVi.home?.testimonials?.title ?? "",
  );

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    const supabase = createClient();
    let upsertRows: Row[] = [];

    if (tab === "hero") {
      const textFields = [
        "tagline",
        "title",
        "description",
        "stat1_label",
        "stat2_label",
        "stat3_label",
      ];
      upsertRows = Object.entries(hero).map(([field, value]) => ({
        page: "home",
        section: "hero",
        field,
        value_en: value,
        value_vi: textFields.includes(field)
          ? (heroVi[field as keyof typeof heroVi] ?? "")
          : "",
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
      const labelFields = [
        "stat1_label",
        "stat2_label",
        "stat3_label",
        "stat4_label",
      ];
      upsertRows = Object.entries(stats).map(([field, value]) => ({
        page: "home",
        section: "stats",
        field,
        value_en: value,
        value_vi:
          field === "title"
            ? statsTitleVi
            : labelFields.includes(field)
              ? (statsLabelsVi[field as keyof typeof statsLabelsVi] ?? "")
              : "",
      }));
    } else if (tab === "process") {
      upsertRows = [
        {
          page: "home",
          section: "process",
          field: "title",
          value_en: processTitle,
          value_vi: processTitleVi,
        },
        {
          page: "home",
          section: "process",
          field: "cta_text",
          value_en: processCtaText,
          value_vi: processCtaTextVi,
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
          value_vi: testimonialsTitleVi,
        },
        {
          page: "home",
          section: "testimonials",
          field: "data",
          value_en: JSON.stringify(testimonialItems),
          value_vi: "",
        },
      ];
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
    <>
      {libraryTarget && (
        <ImagePickerModal
          onSelect={(url) => {
            if (libraryTarget.target === "hero") {
              setHero((p) => ({ ...p, image: url }));
            } else if (
              libraryTarget.target === "product" &&
              libraryTarget.index !== undefined
            ) {
              setProducts((prev) => {
                const next = [...prev];
                next[libraryTarget.index!] = {
                  ...next[libraryTarget.index!],
                  image: url,
                };
                return next;
              });
            }
          }}
          onClose={() => setLibraryTarget(null)}
        />
      )}
      <div className="space-y-5">
        {/* Section tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 p-1 flex-wrap">
          {TABS.map((s) => (
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

        {/* ─── HERO ─── */}
        {tab === "hero" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Văn bản
              </p>
              <BiField
                label="Tagline (chữ nghiêng phía trên)"
                valueEn={hero.tagline}
                valueVi={heroVi.tagline}
                onChangeEn={(v) => setHero((p) => ({ ...p, tagline: v }))}
                onChangeVi={(v) => setHeroVi((p) => ({ ...p, tagline: v }))}
                placeholder="A Decade of Support"
              />
              <BiField
                label="Tiêu đề chính"
                valueEn={hero.title}
                valueVi={heroVi.title}
                onChangeEn={(v) => setHero((p) => ({ ...p, title: v }))}
                onChangeVi={(v) => setHeroVi((p) => ({ ...p, title: v }))}
                placeholder="Building value for living fully"
              />
              <BiField
                label="Mô tả"
                valueEn={hero.description}
                valueVi={heroVi.description}
                onChangeEn={(v) => setHero((p) => ({ ...p, description: v }))}
                onChangeVi={(v) => setHeroVi((p) => ({ ...p, description: v }))}
                textarea
              />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Hình ảnh &amp; Video
              </p>
              {/* Hero Image Upload */}
              <input
                ref={heroImgRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleHeroImageUpload(f);
                  e.target.value = "";
                }}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  URL Hình ảnh Banner
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hero.image}
                    onChange={(e) =>
                      setHero((p) => ({ ...p, image: e.target.value }))
                    }
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => heroImgRef.current?.click()}
                    disabled={heroImgUploading}
                    title="Tải ảnh từ thiết bị"
                    className="shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                  >
                    {heroImgUploading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Upload size={15} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryTarget({ target: "hero" })}
                    title="Chọn từ thư viện"
                    className="shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <ImageIcon size={15} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tải từ thiết bị hoặc dán link ảnh trực tiếp
                </p>
              </div>
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
                    <BiField
                      label="Nhãn"
                      valueEn={
                        (hero as Record<string, string>)[`stat${n}_label`]
                      }
                      valueVi={
                        (heroVi as Record<string, string>)[`stat${n}_label`]
                      }
                      onChangeEn={(v) =>
                        setHero((p) => ({ ...p, [`stat${n}_label`]: v }))
                      }
                      onChangeVi={(v) =>
                        setHeroVi((p) => ({ ...p, [`stat${n}_label`]: v }))
                      }
                      placeholder="Families Protected"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── PRODUCTS ─── */}
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
                  <BiField
                    label="Tên sản phẩm"
                    valueEn={p.title}
                    valueVi={p.title_vi ?? ""}
                    onChangeEn={(v) => {
                      const next = [...products];
                      next[i] = { ...next[i], title: v };
                      setProducts(next);
                    }}
                    onChangeVi={(v) => {
                      const next = [...products];
                      next[i] = { ...next[i], title_vi: v };
                      setProducts(next);
                    }}
                  />
                  <BiField
                    label="Tag hiển thị"
                    valueEn={p.tag}
                    valueVi={p.tag_vi ?? ""}
                    onChangeEn={(v) => {
                      const next = [...products];
                      next[i] = { ...next[i], tag: v };
                      setProducts(next);
                    }}
                    onChangeVi={(v) => {
                      const next = [...products];
                      next[i] = { ...next[i], tag_vi: v };
                      setProducts(next);
                    }}
                  />
                </div>
                {/* Product Image Upload */}
                <input
                  ref={(el) => {
                    productImgRefs.current[i] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleProductImageUpload(f, i);
                    e.target.value = "";
                  }}
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    URL Hình ảnh
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={p.image}
                      onChange={(e) => {
                        const next = [...products];
                        next[i] = { ...next[i], image: e.target.value };
                        setProducts(next);
                      }}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => productImgRefs.current[i]?.click()}
                      disabled={!!productImgUploading[i]}
                      title="Tải ảnh từ thiết bị"
                      className="shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      {productImgUploading[i] ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Upload size={15} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLibraryTarget({ target: "product", index: i })
                      }
                      title="Chọn từ thư viện"
                      className="shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <ImageIcon size={15} />
                    </button>
                  </div>
                </div>
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
                <BiField
                  label="Mô tả sản phẩm"
                  valueEn={p.description}
                  valueVi={p.description_vi ?? ""}
                  onChangeEn={(v) => {
                    const next = [...products];
                    next[i] = { ...next[i], description: v };
                    setProducts(next);
                  }}
                  onChangeVi={(v) => {
                    const next = [...products];
                    next[i] = { ...next[i], description_vi: v };
                    setProducts(next);
                  }}
                  textarea
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Tính năng EN (mỗi dòng 1 tính năng)
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Tính năng VI (mỗi dòng 1 tính năng)
                    </label>
                    <textarea
                      rows={4}
                      value={(p.features_vi ?? []).join("\n")}
                      onChange={(e) => {
                        const next = [...products];
                        next[i] = {
                          ...next[i],
                          features_vi: e.target.value
                            .split("\n")
                            .filter((x) => x.trim()),
                        };
                        setProducts(next);
                      }}
                      placeholder="Bản dịch tiếng Việt..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── STATS ─── */}
        {tab === "stats" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <BiField
              label="Tiêu đề section"
              valueEn={stats.title}
              valueVi={statsTitleVi}
              onChangeEn={(v) => setStats((p) => ({ ...p, title: v }))}
              onChangeVi={setStatsTitleVi}
            />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100"
                >
                  <p className="text-xs font-bold text-slate-500">
                    Thống kê {n}
                  </p>
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
                  <BiField
                    label="Nhãn"
                    valueEn={
                      (stats as Record<string, string>)[`stat${n}_label`]
                    }
                    valueVi={
                      (statsLabelsVi as Record<string, string>)[
                        `stat${n}_label`
                      ]
                    }
                    onChangeEn={(v) =>
                      setStats((p) => ({ ...p, [`stat${n}_label`]: v }))
                    }
                    onChangeVi={(v) =>
                      setStatsLabelsVi((p) => ({ ...p, [`stat${n}_label`]: v }))
                    }
                    placeholder="ESTABLISH"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PROCESS ─── */}
        {tab === "process" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <BiField
                label="Tiêu đề section"
                valueEn={processTitle}
                valueVi={processTitleVi}
                onChangeEn={setProcessTitle}
                onChangeVi={setProcessTitleVi}
              />
              <BiField
                label="Nút CTA"
                valueEn={processCtaText}
                valueVi={processCtaTextVi}
                onChangeEn={setProcessCtaText}
                onChangeVi={setProcessCtaTextVi}
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
                <BiField
                  label="Nội dung"
                  valueEn={s.text}
                  valueVi={s.text_vi ?? ""}
                  onChangeEn={(v) => {
                    const next = [...processSteps];
                    next[i] = { ...next[i], text: v };
                    setProcessSteps(next);
                  }}
                  onChangeVi={(v) => {
                    const next = [...processSteps];
                    next[i] = { ...next[i], text_vi: v };
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

        {/* ─── TESTIMONIALS ─── */}
        {tab === "testimonials" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <BiField
                label="Tiêu đề section"
                valueEn={testimonialsTitle}
                valueVi={testimonialsTitleVi}
                onChangeEn={setTestimonialsTitle}
                onChangeVi={setTestimonialsTitleVi}
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

        <SaveBar
          saving={saving}
          success={success}
          error={error}
          onSave={handleSave}
        />
      </div>
    </>
  );
}
