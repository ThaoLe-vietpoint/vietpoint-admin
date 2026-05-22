import { createClient } from "@/utils/supabase/server";
import VerifyEditor from "./VerifyEditor";

export default async function VerifyContentPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("page, section, field, value_en, value_vi")
    .eq("page", "verify_consultant");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Xác minh Tư vấn viên
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý nội dung trang Xác minh Tư vấn viên — tiêu đề và mẹo an toàn.
        </p>
      </div>
      <VerifyEditor initialRows={data ?? []} />
    </div>
  );
}
