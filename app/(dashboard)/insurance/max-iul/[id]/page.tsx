import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import MaxReasonForm from "../MaxReasonForm";

export default async function EditMaxIULReasonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: reason } = await supabase
    .from("max_iul_reasons")
    .select("*")
    .eq("id", id)
    .single();
  if (!reason) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-100 mb-6">Chỉnh sửa lý do</h1>
      <MaxReasonForm reason={reason} />
    </div>
  );
}
