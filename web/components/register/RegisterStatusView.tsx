// วางไฟล์นี้ที่: components/admin/register/RegisterStatusView.tsx  (ไฟล์ใหม่)
"use client";

import { CheckCircle2, Clock, Circle, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


export type ApplicationStatus = "pending" | "approved";

function TimelineItem({
  label,
  state,
}: {
  label: string;
  state: "done" | "current" | "upcoming";
}) {
  return (
    <div className="flex items-center gap-3">
      {state === "done" && (
        <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
      )}
      {state === "current" && (
        <Clock size={20} className="shrink-0 animate-pulse text-amber-500" />
      )}
      {state === "upcoming" && (
        <Circle size={20} className="shrink-0 text-slate-300" />
      )}
      <span
        className={`text-sm ${
          state === "upcoming"
            ? "text-slate-400"
            : "font-medium text-slate-700"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function RegisterStatusView({
  status,
  submittedAt,
}: {
  status: ApplicationStatus;
  submittedAt?: string;
}) {
  const router = useRouter();

  // ------- สถานะ: อนุมัติแล้ว -------
  if (status === "approved") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-400 to-emerald-400">
          <Sparkles size={40} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-emerald-900">
          สมัคร Admin สำเร็จ!
        </h1>
        <p className="mt-2 text-slate-500">
          ขอบคุณที่ให้ความไว้วางใจกับเรา คุณสามารถเข้าสู่ระบบ Admin
          Dashboard ได้แล้ว
        </p>

        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-8 py-4 font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-900"
        >
          เข้าสู่ระบบ Admin Dashboard
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // ------- สถานะ: รอตรวจสอบ -------
  return (
    <div className="mx-auto max-w-lg">
      <section className="rounded-3xl border border-white bg-white/70 p-8 text-center shadow-xl shadow-emerald-900/5 backdrop-blur-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <Clock size={32} className="text-amber-500" />
        </div>

        <h1 className="text-xl font-bold text-emerald-900">
          กำลังตรวจสอบคำขอของคุณ
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          ทีมงาน Sathu จะตรวจสอบข้อมูลและเอกสารภายในเวลาประมาณ 1-3
          วันทำการ แล้วแจ้งผลผ่านอีเมลที่ลงทะเบียนไว้
        </p>

        <div className="mt-8 space-y-4 rounded-2xl bg-emerald-50/50 p-5 text-left">
          <TimelineItem
            label={`ส่งคำขอสมัครสำเร็จ${submittedAt ? " — " + submittedAt : ""}`}
            state="done"
          />
          <TimelineItem label="กำลังตรวจสอบเอกสาร" state="current" />
          <TimelineItem label="รอ Admin ยืนยันสิทธิ์" state="upcoming" />
        </div>
      </section>
    </div>
  );
}