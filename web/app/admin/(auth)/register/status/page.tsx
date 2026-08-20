// วางไฟล์นี้ที่: app/admin/(auth)/register/status/page.tsx  (ไฟล์ใหม่ — เพิ่มโฟลเดอร์ status/)
"use client";

import { useState } from "react";
import RegisterTopBar from "@/components/register/RegisterTopBar";
import Stepper from "@/components/register/Stepper";
import RegisterStatusView, {
  ApplicationStatus,
} from "@/components/register/RegisterStatusView";

export default function RegisterStatusPage() {
  // TODO: ตอน backend พร้อม ให้ดึงสถานะจริงจาก API เช่น GET /api/admin/register/status
  // แล้วเอา useState นี้ออก ใช้ค่าจาก API แทน
  const [status, setStatus] = useState<ApplicationStatus>("pending");

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <RegisterTopBar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-2 text-center">
          <h1 className="text-2xl font-bold text-emerald-900">
            สถานะการสมัคร
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ตรวจสอบความคืบหน้าคำขอสมัคร Admin ของคุณ
          </p>
        </div>

        <Stepper current={3} />

        <RegisterStatusView status={status} submittedAt="วันนี้ 09:00 น." />

        {/*
          ปุ่มด้านล่างนี้มีไว้ใช้ตอน dev/ทดสอบ UI เท่านั้น เพื่อดูทั้งสองสถานะ
          ลบทิ้งได้เลยเมื่อต่อ API สถานะจริงแล้ว
        */}
        <div className="mx-auto mt-10 max-w-lg text-center">
          <button
            onClick={() =>
              setStatus((s) => (s === "pending" ? "approved" : "pending"))
            }
            className="text-xs text-slate-400 underline"
          >
            [Dev] สลับดูสถานะ:{" "}
            {status === "pending" ? "→ อนุมัติแล้ว" : "→ รอตรวจสอบ"}
          </button>
        </div>
      </main>
    </div>
  );
}