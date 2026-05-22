import { createClient } from "@/utils/supabase/server";
import { Shield, Mail, Key, Globe, Bell, User } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";
import SiteSettingsForm from "./SiteSettingsForm";
import EmailSettingsForm from "./EmailSettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Cài đặt</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Quản lý thông tin tài khoản và cấu hình hệ thống
        </p>
      </div>

      {/* ── Thông tin tài khoản ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
          <User size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Thông tin tài khoản</h2>
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: "#2F5E9E" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800">Quản trị viên</p>
            <p className="text-sm text-slate-500 truncate mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <Shield size={10} /> Admin
              </span>
              <span className="text-[11px] text-slate-400">Tham gia: {joined}</span>
            </div>
          </div>
        </div>
        <div className="px-6 pb-4 grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">User ID</p>
            <p className="text-xs text-slate-600 font-mono truncate">{user?.id}</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-4 py-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Provider</p>
            <p className="text-xs text-slate-600">{user?.app_metadata?.provider ?? "email"}</p>
          </div>
        </div>
      </div>

      {/* ── Thông tin website ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
          <Globe size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Thông tin website</h2>
        </div>
        <div className="p-6">
          <SiteSettingsForm />
        </div>
      </div>

      {/* ── Email thông báo ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Email thông báo</h2>
          </div>
          <span className="text-[11px] text-slate-400">Nhận email khi có liên hệ mới</span>
        </div>
        <div className="p-6">
          <EmailSettingsForm />
        </div>
      </div>

      {/* ── Bảo mật ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
          <Key size={15} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-700">Bảo mật</h2>
        </div>
        <div className="p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
