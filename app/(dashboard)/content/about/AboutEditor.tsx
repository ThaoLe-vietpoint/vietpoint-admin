"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Row,
  CoreValue,
  WhatWeDoItem,
  WhyUsItem,
  buildState,
  buildStateVi,
  Field,
  BiField,
  SaveBar,
  DEFAULT_CORE_VALUES,
  DEFAULT_WHAT_WE_DO,
  DEFAULT_WHY_US,
} from "../_shared";

const TABS = [
  { id: "story", label: "Câu chuyện" },
  { id: "mission", label: "Sứ mệnh & Tầm nhìn" },
  { id: "core_values", label: "Giá trị cốt lõi" },
  { id: "team", label: "Đội ngũ" },
  { id: "what_we_do", label: "Lợi ích" },
  { id: "why_us", label: "Tại sao chọn VP" },
  { id: "cta", label: "CTA" },
];

export default function AboutEditor({ initialRows }: { initialRows: Row[] }) {
  const [tab, setTab] = useState("story");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const initial = buildState(initialRows);
  const initialVi = buildStateVi(initialRows);

  const [aboutStory, setAboutStory] = useState({
    intro_text:
      initial.about?.story?.intro_text ??
      "Welcome to VietPoint Insurance & Tax, a trusted financial partner dedicated to serving the Vietnamese community in the United States.",
    brand_title: initial.about?.story?.brand_title ?? "Brand Story",
    brand_text:
      initial.about?.story?.brand_text ??
      "VietPoint Insurance & Tax was founded in 2013 with a clear mission: to become the most trusted Financial Doctor for every Vietnamese family in the US.",
  });

  const [aboutMission, setAboutMission] = useState({
    mission:
      initial.about?.mission?.mission ??
      "Providing comprehensive financial protection, ensuring stable income during retirement and bringing peace of mind to households in the United States.",
    vision:
      initial.about?.mission?.vision ??
      "Become the leading financial-insurance company in the US, the first choice of Vietnamese people when looking for the best insurance programs.",
  });

  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    const raw = initial.about?.core_values?.data;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return DEFAULT_CORE_VALUES;
  });

  const [agentsText, setAgentsText] = useState(
    initial.about?.team?.agents ??
      "HUNG HUYNH\nCELINE NGUYEN\nGINA DANG\nVICKY TRIEU\nTY TRIEU\nHA NGUYEN",
  );
  const [ambassadorsText, setAmbassadorsText] = useState(
    initial.about?.team?.ambassadors ??
      "KHANH THI LE LA\nCHIEU ANH NU TRAN\nTHU THI NGUYEN",
  );

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

  const [whyUsItems, setWhyUsItems] = useState<WhyUsItem[]>(() => {
    const raw = initial.about?.why_us?.data;
    const rawVi = initialVi.about?.why_us?.data;
    if (raw) {
      try {
        const enList: WhyUsItem[] = JSON.parse(raw);
        let viList: WhyUsItem[] = [];
        if (rawVi) {
          try {
            viList = JSON.parse(rawVi);
          } catch {}
        }
        return enList.map((item, idx) => ({
          ...item,
          title_vi: item.title_vi || viList[idx]?.title || "",
          desc_vi: item.desc_vi || viList[idx]?.desc || "",
        }));
      } catch {}
    }
    return DEFAULT_WHY_US;
  });

  const [aboutCta, setAboutCta] = useState({
    title:
      initial.about?.cta?.title ?? "Ready to secure your family\u2019s future?",
    description:
      initial.about?.cta?.description ??
      "Contact us today for a free consultation.",
    button_text: initial.about?.cta?.button_text ?? "Contact Us Now",
  });

  // ─── VI state (text-only fields) ─────────────────────────────────────────
  const [aboutStoryVi, setAboutStoryVi] = useState({
    intro_text: initialVi.about?.story?.intro_text ?? "",
    brand_title: initialVi.about?.story?.brand_title ?? "",
    brand_text: initialVi.about?.story?.brand_text ?? "",
  });
  const [aboutMissionVi, setAboutMissionVi] = useState({
    mission: initialVi.about?.mission?.mission ?? "",
    vision: initialVi.about?.mission?.vision ?? "",
  });
  const [whatWeDoSubtitleVi, setWhatWeDoSubtitleVi] = useState(
    initialVi.about?.what_we_do?.subtitle ?? "",
  );
  const [aboutCtaVi, setAboutCtaVi] = useState({
    title: initialVi.about?.cta?.title ?? "",
    description: initialVi.about?.cta?.description ?? "",
    button_text: initialVi.about?.cta?.button_text ?? "",
  });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    const supabase = createClient();
    let upsertRows: Row[] = [];

    if (tab === "story") {
      upsertRows = Object.entries(aboutStory).map(([field, value]) => ({
        page: "about",
        section: "story",
        field,
        value_en: value,
        value_vi: (aboutStoryVi as Record<string, string>)[field] ?? "",
      }));
    } else if (tab === "mission") {
      upsertRows = Object.entries(aboutMission).map(([field, value]) => ({
        page: "about",
        section: "mission",
        field,
        value_en: value,
        value_vi: (aboutMissionVi as Record<string, string>)[field] ?? "",
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
          value_vi: whatWeDoSubtitleVi,
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
          value_vi: JSON.stringify(
            whyUsItems.map((x) => ({
              ...x,
              title: x.title_vi || x.title,
              desc: x.desc_vi || x.desc,
            })),
          ),
        },
      ];
    } else if (tab === "cta") {
      upsertRows = Object.entries(aboutCta).map(([field, value]) => ({
        page: "about",
        section: "cta",
        field,
        value_en: value,
        value_vi: (aboutCtaVi as Record<string, string>)[field] ?? "",
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

      {/* ─── STORY ─── */}
      {tab === "story" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Giới thiệu công ty
          </p>
          <BiField
            label="Đoạn giới thiệu"
            valueEn={aboutStory.intro_text}
            valueVi={aboutStoryVi.intro_text}
            onChangeEn={(v) => setAboutStory((p) => ({ ...p, intro_text: v }))}
            onChangeVi={(v) =>
              setAboutStoryVi((p) => ({ ...p, intro_text: v }))
            }
            textarea
          />
          <BiField
            label="Tiêu đề câu chuyện thương hiệu"
            valueEn={aboutStory.brand_title}
            valueVi={aboutStoryVi.brand_title}
            onChangeEn={(v) => setAboutStory((p) => ({ ...p, brand_title: v }))}
            onChangeVi={(v) =>
              setAboutStoryVi((p) => ({ ...p, brand_title: v }))
            }
          />
          <BiField
            label="Câu chuyện thương hiệu"
            valueEn={aboutStory.brand_text}
            valueVi={aboutStoryVi.brand_text}
            onChangeEn={(v) => setAboutStory((p) => ({ ...p, brand_text: v }))}
            onChangeVi={(v) =>
              setAboutStoryVi((p) => ({ ...p, brand_text: v }))
            }
            textarea
          />
        </div>
      )}

      {/* ─── MISSION ─── */}
      {tab === "mission" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Sứ mệnh & Tầm nhìn
          </p>
          <BiField
            label="Sứ mệnh (Mission)"
            valueEn={aboutMission.mission}
            valueVi={aboutMissionVi.mission}
            onChangeEn={(v) => setAboutMission((p) => ({ ...p, mission: v }))}
            onChangeVi={(v) => setAboutMissionVi((p) => ({ ...p, mission: v }))}
            textarea
          />
          <BiField
            label="Tầm nhìn (Vision)"
            valueEn={aboutMission.vision}
            valueVi={aboutMissionVi.vision}
            onChangeEn={(v) => setAboutMission((p) => ({ ...p, vision: v }))}
            onChangeVi={(v) => setAboutMissionVi((p) => ({ ...p, vision: v }))}
            textarea
          />
        </div>
      )}

      {/* ─── CORE VALUES ─── */}
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
              <BiField
                label="Tên giá trị"
                valueEn={cv.title}
                valueVi={cv.title_vi ?? ""}
                onChangeEn={(v) => {
                  const next = [...coreValues];
                  next[i] = { ...next[i], title: v };
                  setCoreValues(next);
                }}
                onChangeVi={(v) => {
                  const next = [...coreValues];
                  next[i] = { ...next[i], title_vi: v };
                  setCoreValues(next);
                }}
              />
              <BiField
                label="Mô tả"
                valueEn={cv.desc}
                valueVi={cv.desc_vi ?? ""}
                onChangeEn={(v) => {
                  const next = [...coreValues];
                  next[i] = { ...next[i], desc: v };
                  setCoreValues(next);
                }}
                onChangeVi={(v) => {
                  const next = [...coreValues];
                  next[i] = { ...next[i], desc_vi: v };
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

      {/* ─── TEAM ─── */}
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

      {/* ─── WHAT WE DO ─── */}
      {tab === "what_we_do" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <BiField
              label="Đoạn mô tả phụ đề"
              valueEn={whatWeDoSubtitle}
              valueVi={whatWeDoSubtitleVi}
              onChangeEn={setWhatWeDoSubtitle}
              onChangeVi={setWhatWeDoSubtitleVi}
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
                  <BiField
                    label="Tiêu đề"
                    valueEn={item.title}
                    valueVi={item.title_vi ?? ""}
                    onChangeEn={(v) => {
                      const n = [...whatWeDoItems];
                      n[i] = { ...n[i], title: v };
                      setWhatWeDoItems(n);
                    }}
                    onChangeVi={(v) => {
                      const n = [...whatWeDoItems];
                      n[i] = { ...n[i], title_vi: v };
                      setWhatWeDoItems(n);
                    }}
                  />
                </div>
              </div>
              <BiField
                label="Mô tả"
                valueEn={item.desc}
                valueVi={item.desc_vi ?? ""}
                onChangeEn={(v) => {
                  const n = [...whatWeDoItems];
                  n[i] = { ...n[i], desc: v };
                  setWhatWeDoItems(n);
                }}
                onChangeVi={(v) => {
                  const n = [...whatWeDoItems];
                  n[i] = { ...n[i], desc_vi: v };
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

      {/* ─── WHY US ─── */}
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
              <BiField
                label="Tiêu đề"
                valueEn={item.title}
                valueVi={item.title_vi ?? ""}
                onChangeEn={(v) => {
                  const n = [...whyUsItems];
                  n[i] = { ...n[i], title: v };
                  setWhyUsItems(n);
                }}
                onChangeVi={(v) => {
                  const n = [...whyUsItems];
                  n[i] = { ...n[i], title_vi: v };
                  setWhyUsItems(n);
                }}
              />
              <BiField
                label="Mô tả"
                valueEn={item.desc}
                valueVi={item.desc_vi ?? ""}
                onChangeEn={(v) => {
                  const n = [...whyUsItems];
                  n[i] = { ...n[i], desc: v };
                  setWhyUsItems(n);
                }}
                onChangeVi={(v) => {
                  const n = [...whyUsItems];
                  n[i] = { ...n[i], desc_vi: v };
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

      {/* ─── CTA ─── */}
      {tab === "cta" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Kêu gọi hành động (cuối trang About)
          </p>
          <BiField
            label="Tiêu đề"
            valueEn={aboutCta.title}
            valueVi={aboutCtaVi.title}
            onChangeEn={(v) => setAboutCta((p) => ({ ...p, title: v }))}
            onChangeVi={(v) => setAboutCtaVi((p) => ({ ...p, title: v }))}
          />
          <BiField
            label="Mô tả"
            valueEn={aboutCta.description}
            valueVi={aboutCtaVi.description}
            onChangeEn={(v) => setAboutCta((p) => ({ ...p, description: v }))}
            onChangeVi={(v) => setAboutCtaVi((p) => ({ ...p, description: v }))}
            textarea
          />
          <BiField
            label="Nội dung nút"
            valueEn={aboutCta.button_text}
            valueVi={aboutCtaVi.button_text}
            onChangeEn={(v) => setAboutCta((p) => ({ ...p, button_text: v }))}
            onChangeVi={(v) => setAboutCtaVi((p) => ({ ...p, button_text: v }))}
            placeholder="Contact Us Now"
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
