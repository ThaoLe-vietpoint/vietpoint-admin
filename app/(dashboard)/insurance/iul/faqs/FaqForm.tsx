"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Faq {
  id?: string;
  question?: string;
  answer?: string;
  sort_order?: number;
  active?: boolean;
}

export default function FaqForm({ faq }: { faq?: Faq }) {
  const isEdit = !!faq?.id;
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [sortOrder, setSortOrder] = useState(faq?.sort_order ?? 0);
  const [active, setActive] = useState(faq?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = { question, answer, sort_order: sortOrder, active };
    const { error: err } = isEdit
      ? await supabase.from("iul_faqs").update(payload).eq("id", faq!.id!)
      : await supabase.from("iul_faqs").insert(payload);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/insurance/iul/faqs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Câu hỏi *
        </label>
        <input
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
          placeholder="What is IUL?"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Trả lời
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Câu trả lời..."
        />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Thứ tự
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-sm text-slate-300">Hiển thị</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/insurance/iul/faqs")}
          className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
