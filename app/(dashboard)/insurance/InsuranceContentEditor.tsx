"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { BiField, SaveBar, Row } from "@/app/(dashboard)/content/_shared";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";

export type FieldDef = {
  section: string;
  field: string;
  label: string;
  defaultEn: string;
  defaultVi: string;
  multiline?: boolean;
  rows?: number;
};

export default function InsuranceContentEditor({
  pageKey,
  title,
  fields,
  initialRows,
}: {
  pageKey: string;
  title: string;
  fields: FieldDef[];
  initialRows: Row[];
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const getInitial = (sec: string, fld: string, lang: "en" | "vi", def: string) => {
    const r = initialRows.find((x) => x.section === sec && x.field === fld);
    if (!r) return def;
    return (lang === "en" ? r.value_en : r.value_vi) || def;
  };

  const [valuesEn, setValuesEn] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        `${f.section}.${f.field}`,
        getInitial(f.section, f.field, "en", f.defaultEn),
      ]),
    ),
  );

  const [valuesVi, setValuesVi] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        `${f.section}.${f.field}`,
        getInitial(f.section, f.field, "vi", f.defaultVi),
      ]),
    ),
  );

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    const supabase = createClient();

    const rows: Row[] = fields.map((f) => ({
      page: pageKey,
      section: f.section,
      field: f.field,
      value_en: valuesEn[`${f.section}.${f.field}`] ?? "",
      value_vi: valuesVi[`${f.section}.${f.field}`] ?? "",
    }));

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
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Settings2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Tuỳ chỉnh tiêu đề Hero, mô tả, các mục tĩnh và nút CTA (Song ngữ EN / VI)
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp size={18} className="text-slate-400" />
        ) : (
          <ChevronDown size={18} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div className="p-5 pt-2 border-t border-slate-100 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((f) => {
              const k = `${f.section}.${f.field}`;
              return (
                <div
                  key={k}
                  className={f.multiline ? "md:col-span-2" : ""}
                >
                  <BiField
                    label={f.label}
                    valueEn={valuesEn[k] ?? ""}
                    onChangeEn={(v) =>
                      setValuesEn((prev) => ({ ...prev, [k]: v }))
                    }
                    valueVi={valuesVi[k] ?? ""}
                    onChangeVi={(v) =>
                      setValuesVi((prev) => ({ ...prev, [k]: v }))
                    }
                    textarea={f.multiline}
                  />
                </div>
              );
            })}
          </div>
          <SaveBar
            saving={saving}
            success={success}
            error={error}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
}
