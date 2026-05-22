import { createClient } from "@/utils/supabase/server";
import { Shield, Mail, Key } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";

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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Cài đặt tài khoản</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Quản lý thông tin và bảo mật tài khoản
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Hồ sơ</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-800">Quản trị viên</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-slate-400" />
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield size={12} className="text-slate-400" />
              <p className="text-xs text-slate-400">Tham gia: {joined}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Key size={15} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-700">Đổi mật khẩu</h2>
        </div>
        <ChangePasswordForm />
      </div>

      {/* Account info */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Thông tin tài khoản
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">User ID</span>
            <span className="text-slate-600 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded truncate max-w-48">
              {user?.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Provider</span>
            <span className="text-slate-600 text-xs">
              {user?.app_metadata?.provider ?? "email"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
