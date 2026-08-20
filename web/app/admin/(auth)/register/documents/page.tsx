// วางไฟล์นี้ที่: app/admin/(auth)/register/documents/page.tsx  (ไฟล์ใหม่ — เพิ่มโฟลเดอร์ documents/)
"use client";

import { useRouter } from "next/navigation";
import RegisterTopBar from "@/components/register/RegisterTopBar";
import Stepper from "@/components/register/Stepper";
import DocumentUploadForm, {
  DocumentUploadData,
} from "@/components/register/DocumentUploadForm";

export default function RegisterDocumentsPage() {
  const router = useRouter();

  function handleSubmit(data: DocumentUploadData) {
    // TODO: ต่อ API ส่งคำขอสมัคร Admin จริงตอน backend พร้อม
    console.log("documents", data);
    router.push("/admin/register/status");
  }

  return (
    <div className="min-h-screen bg-[#F7F7F3]">
      <RegisterTopBar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-2 text-center">
          <h1 className="text-2xl font-bold text-emerald-900">
            อัปโหลดเอกสารยืนยัน
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            แนบเอกสารเพื่อยืนยันตัวตนและข้อมูลวัด
          </p>
        </div>

        <Stepper current={2} />

        <DocumentUploadForm onBack={() => router.back()} onSubmit={handleSubmit} />
      </main>
    </div>
  );
}