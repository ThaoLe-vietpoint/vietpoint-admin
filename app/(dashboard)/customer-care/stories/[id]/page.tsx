import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import StoryForm from "../StoryForm";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: story } = await supabase
    .from("customer_stories")
    .select("*")
    .eq("id", id)
    .single();

  if (!story) notFound();

  return <StoryForm initial={story} />;
}
