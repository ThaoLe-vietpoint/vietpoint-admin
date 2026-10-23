"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Settings,
  LogOut,
  Users,
  ChevronRight,
  ExternalLink,
  Shield,
  LayoutTemplate,
  Info,
  Phone,
  UserCheck,
  Briefcase,
  Heart,
  BookOpen,
  HeartHandshake,
  FileCheck,
  Trophy,
  Zap,
  Baby,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users2,
  KeyRound,
} from "lucide-react";

const navGroups = [
  {
    label: "Tổng quan",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { href: "/content/home", label: "Trang chủ", icon: LayoutTemplate },
      { href: "/content/about", label: "Giới thiệu", icon: Info },
      {
        href: "/content/recruitment",
        label: "Tuyển dụng",
        icon: Briefcase,
        indent: true,
      },
      {
        href: "/content/verify-consultant",
        label: "Xác minh TV",
        icon: UserCheck,
        indent: true,
      },
      { href: "/content/global", label: "Liên hệ & Footer", icon: Phone },
      { href: "/blog", label: "Bài viết Blog", icon: FileText },
      { href: "/media", label: "Thư viện ảnh", icon: ImageIcon },
    ],
  },
  {
    label: "Chăm sóc KH",
    items: [
      {
        href: "/customer-care",
        label: "Customer Care",
        icon: HeartHandshake,
        exact: true,
      },
      {
        href: "/customer-care/stories",
        label: "Câu chuyện KH",
        icon: Heart,
        indent: true,
      },
      {
        href: "/customer-care/user-manual",
        label: "Hướng dẫn SD",
        icon: BookOpen,
        indent: true,
      },
      {
        href: "/customer-care/claims",
        label: "Quyền lợi BH",
        icon: FileCheck,
        indent: true,
      },
      {
        href: "/customer-care/priority-program",
        label: "Ưu tiên",
        icon: Trophy,
        indent: true,
      },
    ],
  },
  {
    label: "Bảo hiểm",
    items: [
      {
        href: "/insurance",
        label: "Bảo hiểm",
        icon: ShieldCheck,
        exact: true,
      },
      {
        href: "/insurance/iul",
        label: "Medicare",
        icon: Zap,
        indent: true,
      },
      {
        href: "/insurance/kid-iul",
        label: "ACA Marketplace",
        icon: Baby,
        indent: true,
      },
      {
        href: "/insurance/termlife",
        label: "Auto Insurance",
        icon: Clock,
        indent: true,
      },
    ],
  },
  {
    label: "Khách hàng",
    items: [{ href: "/leads", label: "Liên hệ", icon: Users }],
  },
  {
    label: "Nhân sự",
    items: [{ href: "/agents", label: "Nhân viên", icon: Users2 }],
  },
  {
    label: "Tài khoản",
    items: [{ href: "/settings", label: "Đổi mật khẩu", icon: KeyRound }],
  },
];

export default function Sidebar({ isAdmin = true }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const visibleGroups = isAdmin
    ? navGroups
    : navGroups.filter((g) => g.label !== "Nhân sự");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-slate-900 h-full flex flex-col shrink-0 border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              VietPoint
            </p>
            <p className="text-slate-400 text-[11px]">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(
                  item.href,
                  "exact" in item ? item.exact : undefined,
                );
                const Icon = item.icon;
                const isIndented = "indent" in item && item.indent;
                return isIndented ? (
                  <div key={item.href} className="flex items-stretch pl-3">
                    <div className="w-px bg-slate-700 mr-3 shrink-0" />
                    <Link
                      href={item.href}
                      className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? "bg-blue-600/90 text-white shadow-sm"
                          : "text-slate-500 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={14} className="shrink-0" />
                        {item.label}
                      </span>
                      {active && (
                        <ChevronRight size={12} className="opacity-70" />
                      )}
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} className="shrink-0" />
                      {item.label}
                    </span>
                    {active && (
                      <ChevronRight size={14} className="opacity-70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <a
          href="https://vietpoint.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <ExternalLink size={16} />
          Xem website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
