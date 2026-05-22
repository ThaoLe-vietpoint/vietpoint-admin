"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Phone, Mail, MapPin, Clock, Loader2, Check } from "lucide-react";

type Row = { key: string; label: string; value: string };

// Keys managed here (exclude email-notification keys handled by EmailSettingsForm)
const CONTACT_KEYS = ["phone", "phone_e164", "email", "address"];
const HOURS_KEYS = ["hours_weekday", "hours_closed"];
const MANAGED_KEYS = [...CONTACT_KEYS, ...HOURS_KEYS];

const FIELD_META: Record<string, { icon: React.ReactNode; type?: string; placeholder?: string }> = {
  phone:         { icon: <Phone size={13} />,  placeholder: "(678) 825 3737" },
  phone_e164:    { icon: <Phone size={13} />,  placeholder: "+16788253737" },
  email:         { icon: <Mail size={13} />,   type: "email", placeholder: "support@example.com" },
  address:       { icon: <MapPin size={13} />, placeholder: "123 Main St, City, GA 30000" },
  hours_weekday: { icon: <Clock size={13} />,  placeholder: "9 AM – 7 PM" },
  hours_closed:  { icon: <Clock size={13} />,  placeholder: "Closed" },
};

export default function SiteSettingsForm() {
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("key, label, value")
      .in("key", MANAGED_KEYS)
      .then(({ data }) => {
        if (data) {
          // Keep sorted by MANAGED_KEYS order
          const map = Object.fromEntries(data.map((r) => [r.key, r]));
          setRows(MANAGED_KEYS.map((k) => map[k]).filter(Boolean) as Row[]);
        }
      });
  }, []);

  function handleChange(key: string, value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, value } : r)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const supabase = createClient();
    const updates = rows.map((r) =>
      supabase
        .from("site_settings")
        .update({ value: r.value, updated_at: new Date().toISOString() })
        .eq("key", r.key),
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setError(failed.error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
        <Loader2 size={14} className="animate-spin" />
        Đang tải...
      </div>
    );
  }

  const contactRows = rows.filter((r) => CONTACT_KEYS.includes(r.key));
  const hoursRows = rows.filter((r) => HOURS_KEYS.includes(r.key));

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Contact info group */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Liên hệ</p>
        <div className="space-y-3">
          {contactRows.map((row) => {
            const meta = FIELD_META[row.key];
            return (
              <div key={row.key} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  {meta?.icon}
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    {row.label || row.key}
                  </label>
                  <input
                    type={meta?.type ?? "text"}
                    value={row.value}
                    placeholder={meta?.placeholder}
                    onChange={(e) => handleChange(row.key, e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hours group */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Giờ làm việc</p>
        <div className="grid grid-cols-2 gap-3">
          {hoursRows.map((row) => {
            const meta = FIELD_META[row.key];
            return (
              <div key={row.key}>
                <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  {meta?.icon}
                  {row.label || row.key}
                </label>
                <input
                  type="text"
                  value={row.value}
                  placeholder={meta?.placeholder}
                  onChange={(e) => handleChange(row.key, e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ background: "#2F5E9E" }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : success ? <Check size={14} /> : null}
        {success ? "Đã lưu!" : saving ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
