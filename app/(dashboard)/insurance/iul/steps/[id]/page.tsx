import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import StepForm from "../StepForm";

export default async function EditIULStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: step } = await supabase
    .from("iul_steps")
    .select("*")
    .eq("id", id)
    .single();
  if (!step) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-100 mb-6">Chỉnh sửa bước</h1>
      <StepForm step={step} />
    </div>
  );
}
