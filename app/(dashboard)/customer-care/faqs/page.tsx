import { createClient } from "@/utils/supabase/server";
import FaqsEditor, { Faq, Category, DEFAULT_CATEGORIES } from "./FaqsEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_FAQS: Faq[] = [
  {
    id: "1",
    category: "Bảo hiểm sức khỏe (ACA)",
    category_en: "Health Insurance (ACA)",
    q_vi: "Bảo hiểm sức khỏe ACA Marketplace là gì và ai đủ điều kiện tham gia?",
    q_en: "What is ACA Marketplace insurance and who is eligible?",
    a_vi: "ACA Marketplace (Obamacare) là chương trình bảo hiểm sức khỏe được chính phủ Hoa Kỳ trợ cấp dựa trên thu nhập và quy mô hộ gia đình. Bất kỳ công dân Mỹ, thường trú nhân (thẻ xanh), hoặc người có tình trạng cư trú hợp pháp tại Mỹ đều có thể nộp đơn tham gia trong kỳ Open Enrollment hoặc khi có biến cố đặc biệt (Special Enrollment Period).",
    a_en: "The ACA Marketplace is a U.S. government-subsidized health insurance program based on household income and family size. U.S. citizens, permanent residents (Green Card holders), and individuals with qualified lawful presence are eligible to apply.",
  },
  {
    id: "2",
    category: "Bảo hiểm sức khỏe (ACA)",
    category_en: "Health Insurance (ACA)",
    q_vi: "Tôi có thể nhận được mức hỗ trợ phí bảo hiểm $0/tháng không?",
    q_en: "Can I qualify for a $0/month health insurance plan?",
    a_vi: "Có! Rất nhiều khách hàng của VietPoint được hưởng mức phí bảo hiểm $0/tháng hoặc phí rất thấp nhờ vào các khoản trợ cấp thuế (Premium Tax Credit) khi thu nhập nằm trong khung quy định của bang.",
    a_en: "Yes! Many VietPoint clients qualify for $0/month or very low premium plans through advance premium tax credits (subsidies) based on state income brackets.",
  },
  {
    id: "3",
    category: "Medicare & Medicaid",
    category_en: "Medicare & Medicaid",
    q_vi: "Khi nào tôi nên bắt đầu đăng ký Medicare Phần A & B?",
    q_en: "When should I enroll in Medicare Part A & Part B?",
    a_vi: "Thời điểm đăng ký ban đầu (Initial Enrollment Period) là khoảng thời gian 7 tháng: 3 tháng trước tháng bạn tròn 65 tuổi, tháng sinh nhật 65, và 3 tháng sau đó. Đăng ký đúng hạn giúp bạn tránh bị phạt trễ hạn trọn đời đối với Part B và Part D.",
    a_en: "Your Initial Enrollment Period is a 7-month window: 3 months before your 65th birthday month, your birthday month, and 3 months after. Enrolling on time prevents lifetime late enrollment penalties for Part B and Part D.",
  },
  {
    id: "4",
    category: "Medicare & Medicaid",
    category_en: "Medicare & Medicaid",
    q_vi: "Sự khác biệt giữa Medicare Advantage (Part C) và Medicare Supplement (Medigap) là gì?",
    q_en: "What is the difference between Medicare Advantage (Part C) and Medigap?",
    a_vi: "Medicare Advantage (Part C) thay thế Medicare nguyên thủy, thường kết hợp quyền lợi thuốc theo toa (Part D) cùng nha khoa, mắt, tai với chi phí thấp hoặc $0 phí hàng tháng. Medicare Supplement bù đắp các chi phí tự trả (Copay, Deductible) của Part A & B nhưng thường có phí tháng riêng biệt.",
    a_en: "Medicare Advantage (Part C) bundles hospital, medical, and usually drug coverage with low or $0 monthly premiums. Medicare Supplement (Medigap) covers out-of-pocket gaps from Original Medicare (copays, deductibles) with a separate monthly premium.",
  },
  {
    id: "5",
    category: "Bảo hiểm xe hơi",
    category_en: "Auto Insurance",
    q_vi: "Bảo hiểm xe hơi bao gồm những loại quyền lợi cơ bản nào?",
    q_en: "What are the core coverages in an Auto Insurance policy?",
    a_vi: "Bảo hiểm xe hơi thường bao gồm: Liability (Trách nhiệm pháp lý đối với thương tật và tài sản người khác), Comprehensive (Mất cắp, cháy nổ, thời tiết), Collision (Va chạm khi lái xe), và Uninsured Motorist (Va chạm với xe không có bảo hiểm hoặc bỏ trốn).",
    a_en: "Auto insurance typically includes Liability (bodily injury and property damage to others), Comprehensive (theft, vandalism, weather), Collision (vehicle crash damage), and Uninsured/Underinsured Motorist coverage.",
  },
  {
    id: "6",
    category: "Quy trình hồ sơ",
    category_en: "Application Process",
    q_vi: "Tôi cần chuẩn bị những giấy tờ gì khi nộp hồ sơ bảo hiểm?",
    q_en: "What documents do I need to prepare when applying?",
    a_vi: "Các giấy tờ cơ bản gồm: ID/Bằng lái xe, Số an sinh xã hội (SSN), Thẻ xanh hoặc Quốc tịch, Giấy tờ chứng minh thu nhập gần nhất (W-2, Form 1040, hoặc Paystubs), và thông tin của các thành viên gia đình nộp cùng hồ sơ.",
    a_en: "Basic documents include: Driver's License or State ID, Social Security Number (SSN), Green Card or U.S. Passport, recent proof of income (W-2, Form 1040, or paystubs), and household member info.",
  },
  {
    id: "7",
    category: "Quy trình hồ sơ",
    category_en: "Application Process",
    q_vi: "Nếu tôi bị yêu cầu bổ sung giấy tờ (Verification Notice) thì phải làm sao?",
    q_en: "What should I do if I receive a Verification Notice?",
    a_vi: "Bạn đừng quá lo lắng! Marketplace thường cho bạn thời hạn 90 ngày để nộp giấy tờ xác minh thu nhập hoặc tình trạng cư trú. Hãy liên hệ ngay cho chuyên viên VietPoint, chúng tôi sẽ hỗ trợ bạn kiểm tra và tải giấy tờ lên hệ thống chính thức.",
    a_en: "Don't panic! The Marketplace typically gives you 90 days to submit verification documents. Contact our VietPoint team immediately so we can verify and upload them safely to the official system.",
  },
];

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("page_content")
    .select("value_en, value_vi")
    .eq("page", "customer_care")
    .eq("section", "faqs")
    .eq("field", "data")
    .single();

  let initialFaqs = DEFAULT_FAQS;
  let initialCategories: Category[] = DEFAULT_CATEGORIES;

  if (row?.value_en) {
    try {
      const parsed = JSON.parse(row.value_en);
      if (Array.isArray(parsed)) {
        initialFaqs = parsed;
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.faqs)) initialFaqs = parsed.faqs;
        if (Array.isArray(parsed.categories)) initialCategories = parsed.categories;
      }
    } catch {
      // Fallback
    }
  }

  return (
    <FaqsEditor
      initialFaqs={initialFaqs}
      initialCategories={initialCategories}
    />
  );
}
