import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReasonForm from "../ReasonForm";

export default async function EditIULReasonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: reason } = await supabase
    .from("iul_reasons")
    .select("*")
    .eq("id", id)
    .single();
  if (!reason) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-100 mb-6">Chỉnh sửa lý do</h1>
      <ReasonForm reason={reason} />
    </div>
  );
}
