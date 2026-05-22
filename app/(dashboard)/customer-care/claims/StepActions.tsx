"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

export default function StepActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [confirm, setConfirm] = useState(false);

  const toggle = async () => {
    await supabase
      .from("claims_steps")
      .update({ active: !active })
      .eq("id", id);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    await supabase.from("claims_steps").delete().eq("id", id);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
      <button
        onClick={toggle}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
          active
            ? "text-slate-500 hover:bg-slate-100"
            : "text-emerald-600 hover:bg-emerald-50"
        }`}
      >
        {active ? <EyeOff size={13} /> : <Eye size={13} />}
        {active ? "Ẩn" : "Hiện"}
      </button>
      <button
        onClick={remove}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ml-auto ${
          confirm ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-50"
        }`}
      >
        <Trash2 size={13} />
        {confirm ? "Xoá?" : "Xoá"}
      </button>
    </div>
  );
}
