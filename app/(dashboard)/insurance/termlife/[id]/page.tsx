import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BenefitForm from "../../kid-iul/BenefitForm";

export default async function EditTermLifeBenefitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: benefit } = await supabase
    .from("termlife_benefits")
    .select("*")
    .eq("id", id)
    .single();
  if (!benefit) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-6">
        Chỉnh sửa quyền lợi
      </h1>
      <BenefitForm benefit={benefit} backHref="/insurance/termlife" />
    </div>
  );
}
