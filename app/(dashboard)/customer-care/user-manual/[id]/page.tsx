import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import GuideForm from "../GuideForm";

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: guide } = await supabase
    .from("manual_guides")
    .select("*")
    .eq("id", id)
    .single();

  if (!guide) notFound();

  return <GuideForm initial={guide} />;
}
