import { createClient } from "@/utils/supabase/server";
import DocumentsEditor, {
  DEFAULT_DOC_SECTIONS,
  DocSection,
} from "./DocumentsEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DocumentsPage() {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("page_content")
    .select("value_vi, value_en")
    .eq("page", "customer_care")
    .eq("section", "documents")
    .eq("field", "data")
    .maybeSingle();

  let initialSections: DocSection[] = DEFAULT_DOC_SECTIONS;

  if (row?.value_vi) {
    try {
      const parsed = JSON.parse(row.value_vi);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialSections = parsed;
      }
    } catch (e) {
      console.warn("Could not parse customer_care/documents/data:", e);
    }
  }

  return <DocumentsEditor initialSections={initialSections} />;
}
