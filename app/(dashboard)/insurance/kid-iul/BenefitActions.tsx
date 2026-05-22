"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Eye, EyeOff } from "lucide-react";

export default function BenefitActions({
  benefit,
  table,
}: {
  benefit: { id: string; active: boolean };
  table: string;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    await supabase
      .from(table)
      .update({ active: !benefit.active })
      .eq("id", benefit.id);
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Xóa quyền lợi này?")) return;
    setLoading(true);
    await supabase.from(table).delete().eq("id", benefit.id);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggle}
        disabled={loading}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        title={benefit.active ? "Ẩn" : "Hiện"}
      >
        {benefit.active ? <Eye size={15} /> : <EyeOff size={15} />}
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
