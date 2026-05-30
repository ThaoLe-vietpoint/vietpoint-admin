"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff } from "lucide-react";

export default function FaqActions({
  faq,
}: {
  faq: { id: string; active: boolean };
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    await supabase
      .from("iul_faqs")
      .update({ active: !faq.active })
      .eq("id", faq.id);
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Xóa câu hỏi này?")) return;
    setLoading(true);
    await supabase.from("iul_faqs").delete().eq("id", faq.id);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggle}
        disabled={loading}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        title={faq.active ? "Ẩn" : "Hiện"}
      >
        {faq.active ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <button
        onClick={remove}
        disabled={loading}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        title="Xóa"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
