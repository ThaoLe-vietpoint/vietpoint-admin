"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Phone, Mail, MapPin, Clock, Loader2, Check } from "lucide-react";

type Row = { key: string; label: string; value: string };

const FIELD_META: Record<string, { icon: React.ReactNode; type?: string }> = {
  phone: { icon: <Phone size={14} /> },
  phone_e164: { icon: <Phone size={14} /> },
  email: { icon: <Mail size={14} />, type: "email" },
  address: { icon: <MapPin size={14} /> },
  hours_weekday: { icon: <Clock size={14} /> },
  hours_closed: { icon: <Clock size={14} /> },
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
      .order("key")
      .then(({ data }) => {
        if (data) setRows(data as Row[]);
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

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {rows.map((row) => {
        const meta = FIELD_META[row.key];
        return (
          <div key={row.key}>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
              {meta?.icon}
              {row.label || row.key}
            </label>
            <input
              type={meta?.type ?? "text"}
              value={row.value}
              onChange={(e) => handleChange(row.key, e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      })}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ background: "#2F5E9E" }}
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : success ? (
          <Check size={14} />
        ) : null}
        {success ? "Đã lưu!" : saving ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
