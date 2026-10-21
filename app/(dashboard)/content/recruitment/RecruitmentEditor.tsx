"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Row,
  Position,
  DEFAULT_POSITIONS,
  DEFAULT_BENEFITS,
  Field,
  BiField,
  SaveBar,
} from "../_shared";
import { Plus, Trash2 } from "lucide-react";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "positions", label: "Vị trí tuyển dụng" },
  { id: "benefits", label: "Phúc lợi" },
  { id: "cta", label: "CTA" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function RecruitmentEditor({
  initialRows,
}: {
  initialRows: Row[];
}) {
  const g = (section: string, field: string, fallback = "") =>
    initialRows.find((r) => r.section === section && r.field === field)
      ?.value_en ?? fallback;
  const gVi = (section: string, field: string, fallback = "") =>
    initialRows.find((r) => r.section === section && r.field === field)
      ?.value_vi ?? fallback;

  // ── hero
  const [heroTitle, setHeroTitle] = useState(
    g("hero", "title", "Join Our Team"),
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    g(
      "hero",
      "subtitle",
      "Build a meaningful career helping Vietnamese-American families protect their health and financial future.",
    ),
  );
  const [heroTitleVi, setHeroTitleVi] = useState(gVi("hero", "title", ""));
  const [heroSubtitleVi, setHeroSubtitleVi] = useState(
    gVi("hero", "subtitle", ""),
  );

  // ── positions
  const [positions, setPositions] = useState<Position[]>(() => {
    const raw = g("positions", "data", "");
    const rawVi = gVi("positions", "data", "");
    if (raw) {
      try {
        const enList: Position[] = JSON.parse(raw);
        let viList: Position[] = [];
        if (rawVi) {
          try {
            viList = JSON.parse(rawVi);
          } catch {}
        }
        return enList.map((item, idx) => ({
          ...item,
          title_vi: item.title_vi || viList[idx]?.title || "",
          type_vi: item.type_vi || viList[idx]?.type || "",
          location_vi: item.location_vi || viList[idx]?.location || "",
          desc_vi: item.desc_vi || viList[idx]?.desc || "",
        }));
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_POSITIONS;
  });

  const updatePosition = (i: number, key: keyof Position, value: string) => {
    setPositions((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: value };
      return next;
    });
  };

  const addPosition = () =>
    setPositions((prev) => [
      ...prev,
      { title: "", type: "", location: "", desc: "" },
    ]);

  const removePosition = (i: number) =>
    setPositions((prev) => prev.filter((_, idx) => idx !== i));

  // ── benefits
  const [benefits, setBenefits] = useState<string[]>(() => {
    const raw = g("benefits", "data", "");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_BENEFITS;
  });
  const [benefitsVi, setBenefitsVi] = useState<string[]>(() => {
    const raw = gVi("benefits", "data", "");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_BENEFITS.map(() => "");
  });

  const updateBenefit = (i: number, value: string) =>
    setBenefits((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  const updateBenefitVi = (i: number, value: string) =>
    setBenefitsVi((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

  const addBenefit = () => {
    setBenefits((prev) => [...prev, ""]);
    setBenefitsVi((prev) => [...prev, ""]);
  };
  const removeBenefit = (i: number) => {
    setBenefits((prev) => prev.filter((_, idx) => idx !== i));
    setBenefitsVi((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ── cta
  const [ctaTitle, setCtaTitle] = useState(
    g("cta", "title", "Ready to Make a Difference?"),
  );
  const [ctaSubtitle, setCtaSubtitle] = useState(
    g(
      "cta",
      "subtitle",
      "Send your resume and a brief message about why you want to join our team.",
    ),
  );
  const [ctaTitleVi, setCtaTitleVi] = useState(gVi("cta", "title", ""));
  const [ctaSubtitleVi, setCtaSubtitleVi] = useState(
    gVi("cta", "subtitle", ""),
  );

  // ── save state
  const [tab, setTab] = useState<TabId>("hero");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");
    const supabase = createClient();

    const rows: Omit<Row, "updated_at">[] = [
      {
        page: "recruitment",
        section: "hero",
        field: "title",
        value_en: heroTitle,
        value_vi: heroTitleVi,
      },
      {
        page: "recruitment",
        section: "hero",
        field: "subtitle",
        value_en: heroSubtitle,
        value_vi: heroSubtitleVi,
      },
      {
        page: "recruitment",
        section: "positions",
        field: "data",
        value_en: JSON.stringify(positions),
        value_vi: JSON.stringify(
          positions.map((p) => ({
            ...p,
            title: p.title_vi || p.title,
            type: p.type_vi || p.type,
            location: p.location_vi || p.location,
            desc: p.desc_vi || p.desc,
          })),
        ),
      },
      {
        page: "recruitment",
        section: "benefits",
        field: "data",
        value_en: JSON.stringify(benefits),
        value_vi: JSON.stringify(benefitsVi),
      },
      {
        page: "recruitment",
        section: "cta",
        field: "title",
        value_en: ctaTitle,
        value_vi: ctaTitleVi,
      },
      {
        page: "recruitment",
        section: "cta",
        field: "subtitle",
        value_en: ctaSubtitle,
        value_vi: ctaSubtitleVi,
      },
    ];

    const { error: err } = await supabase
      .from("page_content")
      .upsert(rows, { onConflict: "page,section,field" });

    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Hero ── */}
      {tab === "hero" && (
        <div className="space-y-4 bg-white border border-slate-100 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800">Phần Hero</h3>
          <BiField
            label="Tiêu đề"
            valueEn={heroTitle}
            valueVi={heroTitleVi}
            onChangeEn={setHeroTitle}
            onChangeVi={setHeroTitleVi}
            placeholder="Join Our Team"
          />
          <BiField
            label="Mô tả"
            valueEn={heroSubtitle}
            valueVi={heroSubtitleVi}
            onChangeEn={setHeroSubtitle}
            onChangeVi={setHeroSubtitleVi}
            textarea
            placeholder="Build a meaningful career..."
          />
        </div>
      )}

      {/* ── Positions ── */}
      {tab === "positions" && (
        <div className="space-y-4">
          {positions.map((p, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-600">
                  Vị trí #{i + 1}
                </span>
                <button
                  onClick={() => removePosition(i)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <BiField
                label="Tên vị trí"
                valueEn={p.title}
                valueVi={p.title_vi ?? ""}
                onChangeEn={(v) => updatePosition(i, "title", v)}
                onChangeVi={(v) => updatePosition(i, "title_vi", v)}
                placeholder="Licensed Insurance Agent"
              />
              <BiField
                label="Loại hình"
                valueEn={p.type}
                valueVi={p.type_vi ?? ""}
                onChangeEn={(v) => updatePosition(i, "type", v)}
                onChangeVi={(v) => updatePosition(i, "type_vi", v)}
                placeholder="Full-time / Part-time"
              />
              <BiField
                label="Địa điểm"
                valueEn={p.location}
                valueVi={p.location_vi ?? ""}
                onChangeEn={(v) => updatePosition(i, "location", v)}
                onChangeVi={(v) => updatePosition(i, "location_vi", v)}
                placeholder="Remote (Georgia preferred)"
              />
              <BiField
                label="Mô tả"
                valueEn={p.desc}
                valueVi={p.desc_vi ?? ""}
                onChangeEn={(v) => updatePosition(i, "desc", v)}
                onChangeVi={(v) => updatePosition(i, "desc_vi", v)}
                textarea
                placeholder="Describe this role..."
              />
            </div>
          ))}
          <button
            onClick={addPosition}
            className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            <Plus size={16} /> Thêm vị trí
          </button>
        </div>
      )}

      {/* ── Benefits ── */}
      {tab === "benefits" && (
        <div className="space-y-3 bg-white border border-slate-100 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 mb-2">
            Phúc lợi khi gia nhập
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              EN
            </p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              VI
            </p>
          </div>
          {benefits.map((b, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 items-center">
              <input
                type="text"
                value={b}
                onChange={(e) => updateBenefit(i, e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white"
                placeholder="Benefit description..."
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={benefitsVi[i] ?? ""}
                  onChange={(e) => updateBenefitVi(i, e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white"
                  placeholder="Bản dịch tiếng Việt..."
                />
                <button
                  onClick={() => removeBenefit(i)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addBenefit}
            className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors mt-1"
          >
            <Plus size={16} /> Thêm phúc lợi
          </button>
        </div>
      )}

      {/* ── CTA ── */}
      {tab === "cta" && (
        <div className="space-y-4 bg-white border border-slate-100 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800">
            Phần CTA (kêu gọi hành động)
          </h3>
          <BiField
            label="Tiêu đề CTA"
            valueEn={ctaTitle}
            valueVi={ctaTitleVi}
            onChangeEn={setCtaTitle}
            onChangeVi={setCtaTitleVi}
            placeholder="Ready to Make a Difference?"
          />
          <BiField
            label="Mô tả CTA"
            valueEn={ctaSubtitle}
            valueVi={ctaSubtitleVi}
            onChangeEn={setCtaSubtitle}
            onChangeVi={setCtaSubtitleVi}
            textarea
            placeholder="Send your resume..."
          />
        </div>
      )}

      <SaveBar
        saving={saving}
        success={success}
        error={error}
        onSave={handleSave}
      />
    </div>
  );
}
