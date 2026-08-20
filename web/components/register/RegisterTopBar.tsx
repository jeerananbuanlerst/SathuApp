// วางไฟล์นี้ที่: components/admin/register/RegisterTopBar.tsx  (ไฟล์ใหม่)
"use client";

import Image from "next/image";

export default function RegisterTopBar() {
  return (
    <header className="border-b border-emerald-900/5 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
        <div className="relative h-10 w-10">
          <Image src="/Logo.png" alt="Sathu" fill className="object-contain" />
        </div>
        <div>
          <p className="text-lg font-bold text-emerald-900">Sathu Admin</p>
          <p className="text-xs text-slate-500">
            สมัครเป็นผู้ดูแลระบบของวัด
          </p>
        </div>
      </div>
    </header>
  );
}