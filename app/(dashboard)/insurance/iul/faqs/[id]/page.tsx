import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import FaqForm from "../FaqForm";

export default async function EditIULFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: faq } = await supabase
    .from("iul_faqs")
    .select("*")
    .eq("id", id)
    .single();
  if (!faq) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-6">
        Chỉnh sửa câu hỏi
      </h1>
      <FaqForm faq={faq} />
    </div>
  );
}
