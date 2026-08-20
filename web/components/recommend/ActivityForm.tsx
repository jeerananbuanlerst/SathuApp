"use client";

import { useState } from "react";
import {
  Landmark,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Phone,
  Link as LinkIcon,
  ShieldCheck,
  Flower2,
} from "lucide-react";
import Field from "./Field";
import UploadBox from "./UploadBox";
import SubmitButton from "./SubmitButton";
import { provinceList } from "@/lib/data/thaiAddress";
import { districts } from "thai-address-database";

// สมมติฐานข้อมูล
const PROVINCES = provinceList;
6
type FormState = {
  name: string;
  place: string;
  province: string;
  district: string;
  date: string;
  time: string;
  details: string;
  phone: string;
  source: string;
};

const initialForm: FormState = {
  name: "", place: "", province: "", district: "",
  date: "", time: "", details: "", phone: "", source: "",
};

export default function ActivityForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
//เพิ่ม

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    // ปรับ Background ให้ดูนุ่มนวลแบบมินิมอล
   <div className="rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-green-50/30 p-6">
      <div className="mx-auto max-w-7xl">


        {/* ปรับ Layout ให้ยืดหยุ่น: Tablet จะวางซ้อนกัน Desktop จะวางข้างกัน */}
        <form
          onSubmit={async (e) => { e.preventDefault(); setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); }}
         className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8"
        >
          {/* ส่วนฟอร์มหลัก */}
          <div className="space-y-6">
            

            {/* Card หลักพร้อม Depth */}
            <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-md md:p-8">
              <h2 className="mb-6 text-xl font-bold text-emerald-900">ข้อมูลกิจกรรม</h2>
              
              <div className="space-y-5">
                <Field label="ชื่อกิจกรรม" required icon={<FileText size={16} />}>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200" placeholder="เช่น ทำบุญตักบาตรวันขึ้นปีใหม่" />
                </Field>

                <Field label="วัด/สถานที่จัด" required icon={<Landmark size={16} />}>
                  <div className="flex gap-2">
                    <input value={form.place} onChange={(e) => update("place", e.target.value)} className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200" placeholder="ชื่อวัดหรือสถานที่จัด" />
                  </div>
                </Field>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="จังหวัด" required icon={<MapPin size={16} />}>
                    <select value={form.province} onChange={(e) => update("province", e.target.value)} className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200">
                      <option value="">เลือกจังหวัด</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="อำเภอ/เขต" icon={<MapPin size={16} />}>
                    <select value={form.district} onChange={(e) => update("district", e.target.value)} className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200">
                      <option value="">เลือกอำเภอ</option>
                    </select>
                  </Field>
                </div>

                <Field label="รายละเอียด" required icon={<FileText size={16} />}>
                  <textarea value={form.details} onChange={(e) => update("details", e.target.value)} rows={4} className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200" placeholder="รายละเอียดกิจกรรม..." />
                </Field>

                <Field label="รูปภาพกิจกรรม">
                   <UploadBox images={images} onAdd={(files) => setImages(files.map(f => URL.createObjectURL(f)))} onRemove={(i) => setImages(images.filter((_, idx) => idx !== i))} />
                </Field>
              </div>
            </section>

            <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <ShieldCheck className="shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-800">ข้อมูลจะถูกตรวจสอบโดยผู้ดูแลระบบก่อนเผยแพร่</p>
            </div>

            <SubmitButton loading={loading} />
          </div>

          {/* ส่วน Preview: จะ sticky บน desktop และสวยงามบน tablet */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">ตัวอย่างการ์ด</p>
            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-100/50">
              <div className="flex h-40 items-center justify-center bg-emerald-100/50">
                {images[0] ? <img src={images[0]} className="h-full w-full object-cover" /> : <Flower2 size={40} className="text-emerald-400" />}
              </div>
              <div className="space-y-3 p-6">
                <h3 className="font-bold text-emerald-900">{form.name || "ชื่อกิจกรรม"}</h3>
                <div className="space-y-1 text-sm text-emerald-700">
                  <p className="flex items-center gap-2"><Landmark size={14} /> {form.place || "สถานที่"}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} /> {form.province || "จังหวัด"}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}