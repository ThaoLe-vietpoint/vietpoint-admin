"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Row, DEFAULT_VERIFY_TIPS, Field, BiField, SaveBar } from "../_shared";
import { Plus, Trash2 } from "lucide-react";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "tips", label: "Mẹo an toàn" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function VerifyEditor({ initialRows }: { initialRows: Row[] }) {
  const g = (section: string, field: string, fallback = "") =>
    initialRows.find((r) => r.section === section && r.field === field)
      ?.value_en ?? fallback;
  const gVi = (section: string, field: string, fallback = "") =>
    initialRows.find((r) => r.section === section && r.field === field)
      ?.value_vi ?? fallback;

  // ── hero
  const [heroTitle, setHeroTitle] = useState(
    g("hero", "title", "Verify Official Consultant"),
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    g(
      "hero",
      "subtitle",
      "Protect yourself from fraud. Verify that your agent is an officially licensed VietPoint Insurance & Tax consultant before sharing any personal information.",
    ),
  );
  const [formLabel, setFormLabel] = useState(
    g("hero", "form_label", "Agent License ID or Full Name"),
  );
  const [formPlaceholder, setFormPlaceholder] = useState(
    g("hero", "form_placeholder", "e.g. TS-12345 or Hung Huynh"),
  );
  const [heroTitleVi, setHeroTitleVi] = useState(gVi("hero", "title", ""));
  const [heroSubtitleVi, setHeroSubtitleVi] = useState(
    gVi("hero", "subtitle", ""),
  );
  const [formLabelVi, setFormLabelVi] = useState(gVi("hero", "form_label", ""));
  const [formPlaceholderVi, setFormPlaceholderVi] = useState(
    gVi("hero", "form_placeholder", ""),
  );

  // ── tips
  const [tips, setTips] = useState<string[]>(() => {
    const raw = g("tips", "data", "");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_VERIFY_TIPS;
  });

  const updateTip = (i: number, value: string) =>
    setTips((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  const addTip = () => setTips((prev) => [...prev, ""]);
  const removeTip = (i: number) =>
    setTips((prev) => prev.filter((_, idx) => idx !== i));

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
        page: "verify_consultant",
        section: "hero",
        field: "title",
        value_en: heroTitle,
        value_vi: heroTitleVi,
      },
      {
        page: "verify_consultant",
        section: "hero",
        field: "subtitle",
        value_en: heroSubtitle,
        value_vi: heroSubtitleVi,
      },
      {
        page: "verify_consultant",
        section: "hero",
        field: "form_label",
        value_en: formLabel,
        value_vi: formLabelVi,
      },
      {
        page: "verify_consultant",
        section: "hero",
        field: "form_placeholder",
        value_en: formPlaceholder,
        value_vi: formPlaceholderVi,
      },
      {
        page: "verify_consultant",
        section: "tips",
        field: "data",
        value_en: JSON.stringify(tips),
        value_vi: JSON.stringify(tips),
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
            placeholder="Verify Official Consultant"
          />
          <BiField
            label="Mô tả"
            valueEn={heroSubtitle}
            valueVi={heroSubtitleVi}
            onChangeEn={setHeroSubtitle}
            onChangeVi={setHeroSubtitleVi}
            textarea
            placeholder="Protect yourself from fraud..."
          />
          <hr className="border-slate-100" />
          <h3 className="font-semibold text-slate-800">Form xác minh</h3>
          <BiField
            label="Nhãn trường nhập"
            valueEn={formLabel}
            valueVi={formLabelVi}
            onChangeEn={setFormLabel}
            onChangeVi={setFormLabelVi}
            placeholder="Agent License ID or Full Name"
          />
          <BiField
            label="Placeholder"
            valueEn={formPlaceholder}
            valueVi={formPlaceholderVi}
            onChangeEn={setFormPlaceholder}
            onChangeVi={setFormPlaceholderVi}
            placeholder="e.g. TS-12345 or Hung Huynh"
          />
        </div>
      )}

      {/* ── Tips ── */}
      {tab === "tips" && (
        <div className="space-y-3 bg-white border border-slate-100 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 mb-2">Mẹo để an toàn</h3>
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                rows={2}
                value={tip}
                onChange={(e) => updateTip(i, e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white resize-none"
                placeholder="Safety tip..."
              />
              <button
                onClick={() => removeTip(i)}
                className="mt-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button
            onClick={addTip}
            className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors mt-1"
          >
            <Plus size={16} /> Thêm mẹo
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
  );
}
