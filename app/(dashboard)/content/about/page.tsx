import { createClient } from "@/utils/supabase/server";
import AboutEditor from "./AboutEditor";

export default async function ContentAboutPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("page_content")
    .select("page, section, field, value_en, value_vi")
    .eq("page", "about");

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">ℹ️ Về chúng tôi</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Chỉnh sửa nội dung trang Về chúng tôi (/about): câu chuyện, sứ mệnh, giá trị, đội ngũ, lợi ích, CTA
        </p>
      </div>
      <AboutEditor initialRows={rows ?? []} />
    </div>
  );
}
