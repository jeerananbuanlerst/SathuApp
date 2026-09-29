"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Stepper from "@/components/register/Stepper";
import { supabase } from "@/lib/supabase/client";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterDocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [templeFile, setTempleFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docFile || !templeFile) {
      alert("กรุณาเลือกไฟล์เอกสารและรูปถ่ายวัดให้ครบถ้วน");
      return;
    }

    setLoading(true);

    try {
      const safeDocName = `${Date.now()}_doc_${docFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
      const safeTempleName = `${Date.now()}_temple_${templeFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;

      const { error: docError } = await supabase.storage
        .from("temple-documents")
        .upload(safeDocName, docFile, { upsert: true });

      if (docError) throw docError;

      const { data: docPublicUrlData } = supabase.storage
        .from("temple-documents")
        .getPublicUrl(safeDocName);

      const { error: templeError } = await supabase.storage
        .from("temple-documents")
        .upload(safeTempleName, templeFile, { upsert: true });

      if (templeError) throw templeError;

      const { data: templePublicUrlData } = supabase.storage
        .from("temple-documents")
        .getPublicUrl(safeTempleName);

      const { data: latestRecord } = await supabase
        .from("temple_registrations")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latestRecord) {
        const { error: updateError } = await supabase
          .from("temple_registrations")
          .update({
            document_url: docPublicUrlData.publicUrl,
            temple_photo_url: templePublicUrlData.publicUrl,
          })
          .eq("id", latestRecord.id);

        if (updateError) throw updateError;
      }

      setLoading(false);
      router.push("/admin/register/status");
    } catch (error: any) {
      setLoading(false);
      alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans pb-16">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-purple-900 to-[#241A72] p-2 shadow-xs flex items-center justify-center">
              <Image
                src="/sathu-logo.png"
                alt="Sathu Logo"
                fill
                className="object-contain p-1"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 tracking-tight">Sathu Admin</p>
              <p className="text-[11px] text-purple-700 font-medium">ระบบบริหารจัดการศาสนสถาน</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
            ขั้นตอนที่ 2 จาก 3
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            อัปโหลดเอกสารยืนยัน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            แนบเอกสารหรือรูปภาพเพื่อยืนยันตัวตนและข้อมูลวัด
          </p>
        </div>

        <Stepper current={2} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/70 shadow-sm">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              เอกสารยืนยันและรูปภาพ *
            </label>
            
            {/* ช่องอัปโหลดที่ 1 */}
            <div className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition bg-slate-50/60 relative group cursor-pointer ${docFile ? 'border-purple-600 bg-purple-50/20' : 'border-slate-200 hover:border-purple-600'}`}>
              <input 
                type="file" 
                required 
                accept="*/*"
                onChange={(e) => e.target.files && setDocFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${docFile ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 group-hover:scale-105'}`}>
                  {docFile ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {docFile ? `เลือกไฟล์แล้ว: ${docFile.name}` : "อัปโหลดหนังสือแต่งตั้ง, บัตรประชาชน หรือเอกสารอื่นๆ"}
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1 underline">
                    {docFile ? "คลิกเพื่อเปลี่ยนไฟล์" : "กดเพื่อเลือกไฟล์ (รองรับทุกนามสกุล)"}
                  </p>
                </div>
              </div>
            </div>

            {/* ช่องอัปโหลดที่ 2 */}
            <div className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition bg-slate-50/60 relative group cursor-pointer ${templeFile ? 'border-purple-600 bg-purple-50/20' : 'border-slate-200 hover:border-purple-600'}`}>
              <input 
                type="file" 
                required 
                accept="*/*"
                onChange={(e) => e.target.files && setTempleFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${templeFile ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 group-hover:scale-105'}`}>
                  {templeFile ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {templeFile ? `เลือกไฟล์แล้ว: ${templeFile.name}` : "อัปโหลดรูปถ่ายวัดหรือรูปภาพอื่นๆ"}
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1 underline">
                    {templeFile ? "คลิกเพื่อเปลี่ยนไฟล์" : "กดเพื่อเลือกไฟล์ (รองรับทุกนามสกุล)"}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
              ทีม Sathu จะตรวจสอบข้อมูลและแจ้งผลภายใน 1-3 วันทำการ
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5b3894] to-[#a25192] hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "กำลังอัปโหลดไฟล์..." : "ส่งคำขอสมัคร Admin →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}