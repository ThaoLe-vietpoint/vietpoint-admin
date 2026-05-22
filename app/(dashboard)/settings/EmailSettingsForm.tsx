"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Eye, EyeOff, Loader2, Check, Info } from "lucide-react";

type Field = { key: string; label: string; value: string };

const FIELDS: Omit<Field, "value">[] = [
  { key: "notify_email", label: "Email nhận thông báo" },
  { key: "gmail_user", label: "Gmail gửi thông báo (địa chỉ Gmail)" },
  { key: "gmail_app_password", label: "Gmail App Password" },
];

export default function EmailSettingsForm() {
  const [fields, setFields] = useState<Field[]>(
    FIELDS.map((f) => ({ ...f, value: "" })),
  );
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("key, value")
      .in(
        "key",
        FIELDS.map((f) => f.key),
      )
      .then(({ data }) => {
        if (!data) return;
        const map = Object.fromEntries(data.map((r) => [r.key, r.value ?? ""]));
        setFields((prev) =>
          prev.map((f) => ({ ...f, value: map[f.key] ?? "" })),
        );
      });
  }, []);

  function handleChange(key: string, value: string) {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const supabase = createClient();
    const upserts = fields.map((f) =>
      supabase.from("site_settings").upsert(
        {
          key: f.key,
          label: f.label,
          value: f.value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      ),
    );
    const results = await Promise.all(upserts);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setError(failed.error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {fields.map((f) => {
        const isPass = f.key === "gmail_app_password";
        return (
          <div key={f.key}>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
              <Mail size={14} />
              {f.label}
            </label>
            <div className="relative">
              <input
                type={isPass && !showPass ? "password" : "text"}
                value={f.value}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={
                  f.key === "notify_email"
                    ? "your@email.com"
                    : f.key === "gmail_user"
                      ? "sender@gmail.com"
                      : "xxxx xxxx xxxx xxxx"
                }
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isPass && (
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Hint */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          <strong>Gmail App Password</strong> là mật khẩu 16 ký tự tạo riêng cho
          ứng dụng, không phải mật khẩu Gmail thường. Vào{" "}
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            myaccount.google.com/apppasswords
          </a>{" "}
          để tạo.
        </span>
      </div>

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
        {success ? "Đã lưu!" : saving ? "Đang lưu..." : "Lưu cài đặt"}
      </button>
    </form>
  );
}
