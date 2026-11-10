"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Row,
  buildState,
  buildStateVi,
  Field,
  BiField,
  SaveBar,
} from "../_shared";

const TABS = [
  { id: "contact", label: "Thông tin liên hệ" },
  { id: "hours", label: "Giờ làm việc" },
  { id: "social", label: "Mạng xã hội" },
];

function translateHoursToVi(field: string, enVal: string, currentVi?: string) {
  if (!enVal) return currentVi || "";
  if (field === "weekdays") {
    return enVal
      .replace(/Monday\s*[-–]\s*Friday/i, "Thứ Hai – Thứ Sáu")
      .replace(/Sunday\s*[-–]\s*Thursday/i, "Chủ Nhật – Thứ Năm")
      .replace(/(\d+)\s*AM/gi, "$1 SA")
      .replace(/(\d+)\s*PM/gi, "$1 CH")
      .replace(/(\d+\s*SA)\s*[-–]?\s*(\d+\s*CH)/i, "$1 – $2")
      .replace(/CLOSED/gi, "Đóng cửa")
      .replace(/Closed/gi, "Đóng cửa")
      .trim();
  }
  if (field === "weekend") {
    return enVal
      .replace(/Saturday\s*&\s*Sunday/i, "Thứ Bảy & Chủ Nhật")
      .replace(/Friday\s*&\s*Saturday/i, "Thứ Sáu & Thứ Bảy")
      .replace(/CLOSED/gi, "Đóng cửa")
      .replace(/Closed/gi, "Đóng cửa")
      .replace(/(\d+)\s*AM/gi, "$1 SA")
      .replace(/(\d+)\s*PM/gi, "$1 CH")
      .replace(/:\s*/, ": ")
      .replace(/[-–]/, "–")
      .trim();
  }
  return currentVi || enVal;
}

export default function GlobalEditor({ initialRows }: { initialRows: Row[] }) {
  const [tab, setTab] = useState("contact");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const initial = buildState(initialRows);
  const initialVi = buildStateVi(initialRows);

  const [contact, setContact] = useState({
    phone: initial.global?.contact?.phone ?? "(678) 825 3737",
    fax: initial.global?.contact?.fax ?? "(678) 825 3737",
    address:
      initial.global?.contact?.address ??
      "1424 N Brown Rd #450, Lawrenceville, GA 30043",
    email: initial.global?.contact?.email ?? "info@vietpointinsurance.com",
  });

  const [hours, setHours] = useState({
    weekdays:
      initial.global?.hours?.weekdays ??
      "Sunday \u2013 Thursday: 9 AM \u2013 7 PM",
    weekend: initial.global?.hours?.weekend ?? "Friday & Saturday: Closed",
  });
  const [contactAddressVi, setContactAddressVi] = useState(
    initialVi.global?.contact?.address ?? "",
  );
  const [hoursVi, setHoursVi] = useState({
    weekdays: initialVi.global?.hours?.weekdays ?? "",
    weekend: initialVi.global?.hours?.weekend ?? "",
  });

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

    if (tab === "contact") {
      upsertRows = Object.entries(contact).map(([field, value]) => ({
        page: "global",
        section: "contact",
        field,
        value_en: value,
        value_vi: field === "address" ? (contactAddressVi.trim() || value) : value,
      }));
    } else if (tab === "hours") {
      upsertRows = Object.entries(hours).map(([field, value]) => {
        let viVal = (hoursVi as Record<string, string>)[field]?.trim();
        const autoTranslated = translateHoursToVi(field, value, viVal);
        if (!viVal || viVal.includes("Chủ Nhật") || viVal.includes("Thứ Sáu & Thứ Bảy") || viVal.includes("5 CH")) {
          viVal = autoTranslated;
        }
        return {
          page: "global",
          section: "hours",
          field,
          value_en: value,
          value_vi: viVal || autoTranslated || value,
        };
      });
    } else if (tab === "social") {
      upsertRows = Object.entries(social).map(([field, value]) => ({
        page: "global",
        section: "social",
        field,
        value_en: value,
        value_vi: value,
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

      {/* ─── CONTACT ─── */}
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
          <BiField
            label="Địa chỉ"
            valueEn={contact.address}
            valueVi={contactAddressVi}
            onChangeEn={(v) => setContact((p) => ({ ...p, address: v }))}
            onChangeVi={setContactAddressVi}
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

      {/* ─── HOURS ─── */}
      {tab === "hours" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Giờ làm việc
          </p>
          <BiField
            label="Ngày thường"
            valueEn={hours.weekdays}
            valueVi={hoursVi.weekdays}
            onChangeEn={(v) => {
              setHours((p) => ({ ...p, weekdays: v }));
              setHoursVi((p) => ({
                ...p,
                weekdays: translateHoursToVi("weekdays", v, p.weekdays),
              }));
            }}
            onChangeVi={(v) => setHoursVi((p) => ({ ...p, weekdays: v }))}
            placeholder="Monday - Friday: 9AM-6PM"
          />
          <BiField
            label="Cuối tuần"
            valueEn={hours.weekend}
            valueVi={hoursVi.weekend}
            onChangeEn={(v) => {
              setHours((p) => ({ ...p, weekend: v }));
              setHoursVi((p) => ({
                ...p,
                weekend: translateHoursToVi("weekend", v, p.weekend),
              }));
            }}
            onChangeVi={(v) => setHoursVi((p) => ({ ...p, weekend: v }))}
            placeholder="Saturday & Sunday: CLOSED"
          />
        </div>
      )}

      {/* ─── SOCIAL ─── */}
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

      <SaveBar
        saving={saving}
        success={success}
        error={error}
        onSave={handleSave}
      />
    </div>
  );
}
