import Link from "next/link";

const CONTENT_PAGES = [
  {
    href: "/content/home",
    icon: "🏠",
    label: "Trang chủ",
    desc: "Hero, Sản phẩm, Quy trình, Thống kê, Đánh giá khách hàng",
    color: "bg-blue-50 border-blue-100",
    badge: "5 sections",
  },
  {
    href: "/content/about",
    icon: "ℹ️",
    label: "Về chúng tôi",
    desc: "Câu chuyện, Sứ mệnh & Tầm nhìn, Giá trị, Đội ngũ, Lợi ích, CTA",
    color: "bg-purple-50 border-purple-100",
    badge: "7 sections",
  },
  {
    href: "/content/global",
    icon: "📞",
    label: "Liên hệ & Footer",
    desc: "Thông tin liên hệ, Giờ làm việc, Mạng xã hội",
    color: "bg-emerald-50 border-emerald-100",
    badge: "3 sections",
  },
];

export default function ContentPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Nội dung trang web</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Chọn trang để chỉnh sửa nội dung
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {CONTENT_PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className={`block rounded-2xl border p-6 hover:shadow-md transition-shadow ${p.color}`}
          >
            <div className="text-3xl mb-3">{p.icon}</div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-base font-bold text-slate-800">{p.label}</h2>
              <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                {p.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
