import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import StepForm from "../StepForm";

export default async function EditStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: step } = await supabase
    .from("claims_steps")
    .select("*")
    .eq("id", id)
    .single();

  if (!step) notFound();

  return <StepForm initial={step} />;
}
