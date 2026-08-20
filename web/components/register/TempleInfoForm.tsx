// วางไฟล์นี้ที่: components/admin/register/TempleInfoForm.tsx  (ไฟล์ใหม่)
"use client";

import { useState } from "react";
import {
  Landmark,
  MapPin,
  Clock,
  Hash,
  Phone,
  User,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Field from "@/components/recommend/Field";
import SubmitButton from "@/components/recommend/SubmitButton";
import { provinceList } from "@/lib/data/thaiAddress";

export type TempleInfoFormState = {
  templeName: string;
  address: string;
  province: string;
  openTime: string;
  closeTime: string;
  registrationNo: string;
  templePhone: string;
  caretakerName: string;
  position: string;
  caretakerPhone: string;
};

const initialForm: TempleInfoFormState = {
  templeName: "",
  address: "",
  province: "",
  openTime: "",
  closeTime: "",
  registrationNo: "",
  templePhone: "",
  caretakerName: "",
  position: "",
  caretakerPhone: "",
};

function isValidPhone(phone: string) {
  return /^0[0-9]{8,9}$/.test(phone.replace(/-/g, ""));
}

export default function TempleInfoForm({
  onNext,
}: {
  onNext?: (data: TempleInfoFormState) => void;
}) {
  const [form, setForm] = useState<TempleInfoFormState>(initialForm);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof TempleInfoFormState>(
    key: K,
    value: TempleInfoFormState[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: ต่อ API จริงตอน backend พร้อม (ตอนนี้เป็นม็อกอัพ)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onNext?.(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ข้อมูลวัด */}
        <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-md md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-emerald-900">
            <Landmark size={20} className="text-emerald-600" />
            ข้อมูลวัด
          </h2>

          <div className="space-y-5">
            <Field label="ชื่อวัด" required icon={<Landmark size={16} />}>
              <input
                value={form.templeName}
                onChange={(e) => update("templeName", e.target.value)}
                placeholder="เช่น วัดพระธาตุดอยคำ"
                className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="ที่อยู่วัด" required icon={<MapPin size={16} />}>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                rows={3}
                placeholder="บ้านเลขที่ / หมู่ / ตำบล / อำเภอ"
                className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="จังหวัด" required icon={<MapPin size={16} />}>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">เลือกจังหวัด</option>
                {provinceList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="เวลาเปิด - ปิดวัด" required icon={<Clock size={16} />}>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={form.openTime}
                  onChange={(e) => update("openTime", e.target.value)}
                  className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <span className="shrink-0 text-slate-400">ถึง</span>
                <input
                  type="time"
                  value={form.closeTime}
                  onChange={(e) => update("closeTime", e.target.value)}
                  className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </Field>

            <Field label="เลขทะเบียนวัด" required icon={<Hash size={16} />}>
              <input
                value={form.registrationNo}
                onChange={(e) => update("registrationNo", e.target.value)}
                placeholder="เลข 00-0000"
                className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="เบอร์ติดต่อวัด" required icon={<Phone size={16} />}>
              <div className="relative">
                <input
                  value={form.templePhone}
                  onChange={(e) => update("templePhone", e.target.value)}
                  placeholder="0XX-XXX-XXXX"
                  className="w-full rounded-xl border border-emerald-100 bg-white p-3 pr-10 outline-none focus:ring-2 focus:ring-emerald-200"
                />
                {isValidPhone(form.templePhone) && (
                  <CheckCircle2
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                )}
              </div>
            </Field>
          </div>
        </section>

        {/* ข้อมูลผู้ดูแลวัด */}
        <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur-md md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-emerald-900">
            <User size={20} className="text-emerald-600" />
            ข้อมูลผู้ดูแลวัด
          </h2>

          <div className="space-y-5">
            <Field
              label="ชื่อ - ฉายา ผู้ดูแลวัด"
              required
              icon={<User size={16} />}
            >
              <input
                value={form.caretakerName}
                onChange={(e) => update("caretakerName", e.target.value)}
                placeholder="เช่น พระอาจารย์สมชาย ฐิตธมฺโม"
                className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field
              label="ตำแหน่ง / สถานะในวัด"
              required
              icon={<Briefcase size={16} />}
            >
              <input
                value={form.position}
                onChange={(e) => update("position", e.target.value)}
                placeholder="เช่น เจ้าอาวาส, ไวยาวัจกร"
                className="w-full rounded-xl border border-emerald-100 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </Field>

            <Field label="เบอร์ติดต่อ" required icon={<Phone size={16} />}>
              <div className="relative">
                <input
                  value={form.caretakerPhone}
                  onChange={(e) => update("caretakerPhone", e.target.value)}
                  placeholder="0XX-XXX-XXXX"
                  className="w-full rounded-xl border border-emerald-100 bg-white p-3 pr-10 outline-none focus:ring-2 focus:ring-emerald-200"
                />
                {isValidPhone(form.caretakerPhone) && (
                  <CheckCircle2
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                )}
              </div>
            </Field>

            <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <ShieldCheck className="shrink-0 text-emerald-600" size={20} />
              <p className="text-sm text-emerald-800">
                ข้อมูลผู้ดูแลวัดจะใช้สำหรับติดต่อกลับในขั้นตอนตรวจสอบสิทธิ์
                Admin
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-md">
        <SubmitButton loading={loading} label="ถัดไป: อัปโหลดเอกสารยืนยัน →" />
      </div>
    </form>
  );
}