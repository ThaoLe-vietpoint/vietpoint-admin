import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PerkForm from "../PerkForm";

export default async function EditPerkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: perk } = await supabase
    .from("priority_perks")
    .select("*")
    .eq("id", id)
    .single();

  if (!perk) notFound();

  return <PerkForm initial={perk} />;
}
