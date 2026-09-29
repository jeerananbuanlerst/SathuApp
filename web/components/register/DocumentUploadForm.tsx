"use client";

import { useState } from "react";
import { FileCheck2, Images, ShieldCheck, ArrowLeft, Upload, X, Loader2 } from "lucide-react";

export type DocumentUploadData = {
  verifyDoc: string[];
  templePhotos: string[];
};

export default function DocumentUploadForm({
  onBack,
  onSubmit,
}: {
  onBack?: () => void;
  onSubmit?: (data: DocumentUploadData) => void;
}) {
  const [verifyDoc, setVerifyDoc] = useState<string[]>([]);
  const [templePhotos, setTemplePhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const canSubmit = verifyDoc.length > 0 && templePhotos.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onSubmit?.({ verifyDoc, templePhotos });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur-xl text-slate-800">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h2 className="flex items-center gap-2.5 text-xl font-black text-slate-900 tracking-tight">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 shadow-sm">
              <FileCheck2 size={20} />
            </div>
            เอกสารยืนยันตัวตน
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            อัปโหลดเอกสารแต่งตั้งหรือบัตรประชาชน และรูปภาพวัดเพื่อยืนยันตัวตน
          </p>
        </div>

        <div className="space-y-6">
          {/* อัปโหลดเอกสารยืนยัน */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <FileCheck2 size={14} className="text-pink-500" />
              <span>หนังสือแต่งตั้งเจ้าอาวาส หรือ บัตรประชาชน</span>
              <span className="text-pink-500">*</span>
            </label>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-pink-400">
              {verifyDoc.length === 0 ? (
                <label className="cursor-pointer flex flex-col items-center justify-center py-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                    <Upload size={22} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">คลิกเพื่ออัปโหลดไฟล์เอกสาร</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">รองรับไฟล์รูปภาพหรือ PDF</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setVerifyDoc([URL.createObjectURL(e.target.files[0])]);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={verifyDoc[0]} alt="Verify Doc" className="h-28 w-auto rounded-xl object-cover shadow-md border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => setVerifyDoc([])}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow hover:bg-red-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* อัปโหลดรูปวัด */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Images size={14} className="text-pink-500" />
              <span>รูปภาพวัด (1-3 รูป)</span>
              <span className="text-pink-500">*</span>
            </label>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition hover:border-pink-400">
              <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
                {templePhotos.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt={`Temple ${i}`} className="h-24 w-24 rounded-2xl object-cover shadow-md border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => setTemplePhotos(templePhotos.filter((_, idx) => idx !== i))}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow hover:bg-red-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {templePhotos.length < 3 && (
                  <label className="cursor-pointer flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-slate-400 hover:border-pink-400 hover:text-pink-500 transition shadow-sm">
                    <Upload size={20} />
                    <span className="text-[11px] mt-1 font-bold">เพิ่มรูป</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newImgs = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
                          setTemplePhotos((prev) => [...prev, ...newImgs].slice(0, 3));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
            <ShieldCheck className="shrink-0 text-pink-500" size={20} />
            <p className="text-xs font-medium text-pink-900">
              ทีมงาน Sathu จะตรวจสอบเอกสารและอนุมัติสิทธิ์ภายใน 1-3 วันทำการ
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl items-center gap-4 pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 cursor-pointer"
          >
            <ArrowLeft size={18} />
            ย้อนกลับ
          </button>
        )}

        <div className="flex-1">
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pink-400 text-sm font-bold text-white shadow-xl shadow-pink-400/20 transition-all hover:bg-pink-500 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            <span>{canSubmit ? "ส่งคำขอสมัคร Admin" : "กรุณาอัปโหลดเอกสารให้ครบ"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}