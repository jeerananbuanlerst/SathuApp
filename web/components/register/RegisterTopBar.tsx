"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RegisterTopBar() {
  const router = useRouter();

  return (
    <header className="w-full border-b border-white/10 bg-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* โลโก้แบบไอคอนหรือรูปภาพสำรอง ป้องกันรูป 404 */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md">
            <span className="text-xl font-black text-white">🪷</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Sathu Admin</h1>
            <p className="text-xs text-emerald-200">ระบบลงทะเบียนผู้ดูแลวัด</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
          กลับหน้าเข้าสู่ระบบ
        </button>
      </div>
    </header>
  );
}