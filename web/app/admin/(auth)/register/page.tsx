// วางไฟล์นี้ที่: app/admin/(auth)/register/page.tsx  (ไฟล์ใหม่ — เพิ่มโฟลเดอร์ register/)
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Stepper from "@/components/register/Stepper";import TempleInfoForm, {
  TempleInfoFormState,
} from "@/components/register/TempleInfoForm";

export default function RegisterAdminPage() {
  const router = useRouter();

  function handleNext(data: TempleInfoFormState) {
    // TODO: เก็บข้อมูลไว้ (state/localStorage/บันทึก draft ผ่าน API) ก่อนไปหน้าอัปโหลดเอกสาร
    console.log("temple info", data);
    router.push("/admin/register/documents");
  }

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <header className="border-b border-emerald-900/5 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <div className="relative h-10 w-10">
            <Image
              src="/Logo.png"
              alt="Sathu"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-900">Sathu Admin</p>
            <p className="text-xs text-slate-500">
              สมัครเป็นผู้ดูแลระบบของวัด
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-2 text-center">
          <h1 className="text-2xl font-bold text-emerald-900">
            สมัคร Admin วัด
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            กรอกข้อมูลวัดและผู้ดูแลวัดเพื่อยื่นคำขอสิทธิ์ Admin
          </p>
        </div>

        <Stepper current={1} />

        <TempleInfoForm onNext={handleNext} />
      </main>
    </div>
  );
}