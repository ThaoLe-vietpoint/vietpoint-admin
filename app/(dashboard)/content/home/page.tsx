import { createClient } from "@/utils/supabase/server";
import HomeEditor from "./HomeEditor";

export default async function ContentHomePage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("page_content")
    .select("page, section, field, value_en, value_vi")
    .eq("page", "home");

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">🏠 Trang chủ</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Chỉnh sửa nội dung Hero, Sản phẩm, Quy trình, Thống kê, Đánh giá
        </p>
      </div>
      <HomeEditor initialRows={rows ?? []} />
    </div>
  );
}
