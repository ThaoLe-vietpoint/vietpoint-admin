import { createClient } from "@/utils/supabase/server";
import GlobalEditor from "./GlobalEditor";

export default async function ContentGlobalPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("page_content")
    .select("page, section, field, value_en, value_vi")
    .eq("page", "global");

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">
          📞 Liên hệ & Footer
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Chỉnh sửa thông tin liên hệ, giờ làm việc, mạng xã hội
        </p>
      </div>
      <GlobalEditor initialRows={rows ?? []} />
    </div>
  );
}
