"use client";

import { CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export type ApplicationStatus = "pending" | "approved";

export default function RegisterStatusView({
  status,
  templeName,
  submittedAt,
}: {
  status: ApplicationStatus;
  templeName?: string;
  submittedAt?: string;
}) {
  const router = useRouter();

  if (status === "approved") {
    return (
      <div className="mx-auto max-w-xl text-center bg-white rounded-[32px] p-10 shadow-2xl border border-slate-100 text-slate-800">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-emerald-400 shadow-xl shadow-pink-500/20">
          <Sparkles size={40} className="text-white animate-pulse" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          ยินดีด้วย! อนุมัติสิทธิ์สำเร็จ
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          วัด <strong className="text-emerald-700 font-bold">"{templeName || "วัดของคุณ"}"</strong> ได้รับการยืนยันสิทธิ์เรียบร้อยแล้ว พร้อมเข้าสู่ระบบจัดการวัดได้เลย
        </p>

        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mx-auto mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-slate-800 cursor-pointer"
        >
          เข้าสู่ระบบ Admin Dashboard
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <section className="rounded-[32px] border border-slate-100 bg-white p-8 text-center shadow-2xl text-slate-800">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 shadow-inner">
          <Clock size={32} className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h1 className="text-xl font-black text-slate-900">
          กำลังตรวจสอบคำขอของวัด
        </h1>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          วัด <strong className="text-slate-800 font-bold">"{templeName || "ของคุณ"}"</strong> ถูกส่งเข้าระบบเรียบร้อยแล้ว ทีมงาน Sathu จะตรวจสอบข้อมูลและเอกสารภายใน 1-3 วันทำการ
        </p>

        <div className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5 text-left border border-slate-100">
          <div className="flex items-center gap-3 text-xs font-semibold text-emerald-600">
            <CheckCircle2 size={16} /> ส่งคำขอและอัปโหลดเอกสารสำเร็จ
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-amber-600">
            <Clock size={16} /> กำลังรอ Super Admin ตรวจสอบอนุมัติสิทธิ์
          </div>
        </div>
      </section>
    </div>
  );
}