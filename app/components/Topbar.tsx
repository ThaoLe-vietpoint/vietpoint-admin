"use client";
import { usePathname } from "next/navigation";
import { Home, Bell } from "lucide-react";
import Link from "next/link";

const routeLabels: Record<string, string> = {
  "/": "Tổng quan",
  "/blog": "Bài viết Blog",
  "/blog/new": "Tạo bài viết",
  "/leads": "Liên hệ",
  "/testimonials": "Đánh giá",
  "/media": "Thư viện ảnh",
  "/settings": "Cài đặt",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [
    { label: "Tổng quan", href: "/" },
  ];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = routeLabels[path];
    if (label && path !== "/") crumbs.push({ label, href: path });
  }
  return crumbs;
}

export default function Topbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const currentTitle = routeLabels[pathname] ?? "Quản trị";
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "AD";

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-slate-800">{currentTitle}</h1>
        <nav className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1">
              {i === 0 && <Home size={10} />}
              {i > 0 && <span>/</span>}
              {i < crumbs.length - 1 ? (
                <Link
                  href={c.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-slate-600 font-medium">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative">
          <Bell size={15} />
        </button>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-slate-700 leading-tight">
              {userEmail ?? ""}
            </p>
            <p className="text-[11px] text-slate-400">Đổi mật khẩu</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
