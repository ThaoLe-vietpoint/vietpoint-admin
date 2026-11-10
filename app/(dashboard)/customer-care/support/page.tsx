import { createClient } from "@/utils/supabase/server";
import SupportEditor, {
  DEFAULT_SUPPORT_DATA,
  SupportData,
} from "./SupportEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SupportPage() {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("page_content")
    .select("value_vi, value_en")
    .eq("page", "customer_care")
    .eq("section", "support")
    .eq("field", "data")
    .maybeSingle();

  let initialData: SupportData = DEFAULT_SUPPORT_DATA;

  if (row?.value_vi) {
    try {
      const parsed = JSON.parse(row.value_vi);
      if (parsed && Array.isArray(parsed.topics)) {
        initialData = {
          ...DEFAULT_SUPPORT_DATA,
          ...parsed,
        };
      }
    } catch (e) {
      console.warn("Could not parse customer_care/support/data:", e);
    }
  }

  return <SupportEditor initialData={initialData} />;
}
