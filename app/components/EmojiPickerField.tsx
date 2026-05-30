"use client";
import { useState, useRef, useEffect } from "react";

const EMOJI_GROUPS = [
  {
    label: "Bảo vệ & Lợi ích",
    emojis: ["✅", "⭐", "🌟", "💫", "✨", "🔥", "⚡", "💡", "🎯", "🏆", "🥇", "🎖️", "🏅", "👍", "🙌", "🤝"],
  },
  {
    label: "Tài chính",
    emojis: ["💰", "💵", "💸", "💳", "💎", "🤑", "📈", "💹", "🏦", "💼", "🏧", "📊", "🪙", "💲"],
  },
  {
    label: "Gia đình & Sức khỏe",
    emojis: ["👨‍👩‍👧‍👦", "👪", "👶", "🧒", "❤️", "💪", "🏥", "💊", "🩺", "🩹", "🧠", "🫀", "😊", "🤗"],
  },
  {
    label: "Nhà & Tài sản",
    emojis: ["🏠", "🏡", "🏢", "🚗", "✈️", "🛡️", "🔒", "🔐", "🔑", "🗝️", "⚖️", "🧲"],
  },
  {
    label: "Giáo dục & Tương lai",
    emojis: ["🎓", "📚", "📖", "🎒", "🏫", "✏️", "🖊️", "📝", "🌱", "🌿", "🍀", "🌳", "🌻", "🌈", "☀️"],
  },
  {
    label: "Hành chính & Hợp đồng",
    emojis: ["📋", "📄", "📑", "🗂️", "📌", "📎", "🖨️", "💻", "📱", "🖥️", "🎁", "🎀", "🌍", "🌐"],
  },
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export default function EmojiPickerField({ value, onChange, label = "Icon (emoji)" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
          open
            ? "border-blue-400 ring-2 ring-blue-500/20"
            : "border-slate-200 hover:border-slate-300"
        } bg-white`}
      >
        <span className="text-2xl leading-none">{value || "✅"}</span>
        <span className="text-slate-400 text-xs">Nhấn để chọn</span>
        <svg
          className={`ml-auto w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="max-h-72 overflow-y-auto p-3 space-y-3">
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 px-1">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => { onChange(emoji); setOpen(false); }}
                      className={`w-9 h-9 flex items-center justify-center text-xl rounded-lg transition-colors hover:bg-blue-50 hover:scale-110 ${
                        value === emoji ? "bg-blue-100 ring-2 ring-blue-400" : ""
                      }`}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">Hoặc nhập thủ công:</span>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-center"
              placeholder="✅"
              maxLength={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}
