// วางไฟล์นี้ที่: components/admin/register/DocumentUploadForm.tsx  (ไฟล์ใหม่)
"use client";

import { useState } from "react";
import { FileCheck2, Images, ShieldCheck, ArrowLeft } from "lucide-react";
import Field from "@/components/recommend/Field";
import UploadBox from "@/components/recommend/UploadBox";
import SubmitButton from "@/components/recommend/SubmitButton";

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
    // TODO: อัปโหลดไฟล์จริงขึ้น storage แล้วยิง API สมัคร Admin ตอน backend พร้อม (ตอนนี้เป็นม็อกอัพ)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onSubmit?.({ verifyDoc, templePhotos });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-md md:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-emerald-900">
          <FileCheck2 size={20} className="text-emerald-600" />
          เอกสารยืนยันตัวตน
        </h2>

        <div className="space-y-6">
          <Field
            label="หนังสือแต่งตั้งเจ้าอาวาส หรือ บัตรประชาชน"
            required
            icon={<FileCheck2 size={16} />}
          >
            <UploadBox
              images={verifyDoc}
              onAdd={(files) =>
                setVerifyDoc(files.map((f) => URL.createObjectURL(f)))
              }
              onRemove={(i) =>
                setVerifyDoc(verifyDoc.filter((_, idx) => idx !== i))
              }
              max={1}
            />
          </Field>

          <Field label="รูปภาพวัด (1-3 รูป)" required icon={<Images size={16} />}>
            <UploadBox
              images={templePhotos}
              onAdd={(files) =>
                setTemplePhotos((prev) =>
                  [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(
                    0,
                    3
                  )
                )
              }
              onRemove={(i) =>
                setTemplePhotos(templePhotos.filter((_, idx) => idx !== i))
              }
              max={3}
            />
          </Field>

          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <ShieldCheck className="shrink-0 text-emerald-600" size={20} />
            <p className="text-sm text-emerald-800">
              ทีมงานจะตรวจสอบเอกสารและติดต่อกลับภายใน 1-3 วันทำการ
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-600 transition-all hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          ย้อนกลับ
        </button>

        <div className="flex-1">
          <SubmitButton
            loading={loading}
            label={
              canSubmit ? "ส่งคำขอสมัคร Admin" : "กรุณาอัปโหลดเอกสารให้ครบ"
            }
          />
        </div>
      </div>
    </form>
  );
}