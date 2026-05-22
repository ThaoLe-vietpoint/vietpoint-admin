import { createClient } from "@/utils/supabase/server";
import RecruitmentEditor from "./RecruitmentEditor";

export default async function RecruitmentContentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("page, section, field, value_en, value_vi")
    .eq("page", "recruitment");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Trang Tuyển dụng</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý nội dung trang Tuyển dụng — vị trí, phúc lợi và CTA.
        </p>
      </div>
      <RecruitmentEditor initialRows={data ?? []} />
    </div>
  );
}
