"use client"

import type React from "react"
import { useState } from "react"
import { Building2, MapPin, Phone, ArrowRight } from "lucide-react"
import { provinceList } from "@/lib/data/thaiAddress"

export type TempleInfoData = {
  templeName: string;
  province: string;
  district: string;
  subdistrict: string;
  phone: string;
  description: string;
};

export default function TempleInfoForm({
  initialData,
  onNext,
}: {
  initialData?: Partial<TempleInfoData>;
  onNext: (data: TempleInfoData) => void;
}) {
  const [templeName, setTempleName] = useState(initialData?.templeName || "");
  const [province, setProvince] = useState(initialData?.province || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [subdistrict, setSubdistrict] = useState(initialData?.subdistrict || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const canSubmit = templeName.trim() && province && district && phone.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onNext({ templeName, province, district, subdistrict, phone, description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur-xl text-slate-800">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h2 className="flex items-center gap-2.5 text-xl font-black text-slate-900 tracking-tight">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 shadow-sm">
              <Building2 size={20} />
            </div>
            ข้อมูลวัดและผู้ดูแลระบบ
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            กรุณากรอกข้อมูลรายละเอียดของวัดให้ถูกต้องเพื่อใช้ในการตรวจสอบสิทธิ์
          </p>
        </div>

        <div className="space-y-5">
          {/* ชื่อวัด */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Building2 size={14} className="text-pink-500" />
              <span>ชื่อวัด (Temple Name)</span>
              <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              required
              value={templeName}
              onChange={(e) => setTempleName(e.target.value)}
              placeholder="เช่น วัดพระบาทน้ำพุ"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/10"
            />
          </div>

          {/* ที่อยู่: จังหวัด, อำเภอ, ตำบล */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <MapPin size={14} className="text-pink-500" />
                <span>จังหวัด</span>
                <span className="text-pink-500">*</span>
              </label>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                  setSubdistrict("");
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/10 cursor-pointer"
              >
                <option value="">เลือกจังหวัด</option>
                {provinceList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <MapPin size={14} className="text-pink-500" />
                <span>อำเภอ / เขต</span>
                <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="ระบุอำเภอ"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/10"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <MapPin size={14} className="text-pink-500" />
                <span>ตำบล / แขวง</span>
              </label>
              <input
                type="text"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                placeholder="ระบุตำบล"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/10"
              />
            </div>
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Phone size={14} className="text-pink-500" />
              <span>เบอร์โทรศัพท์ติดต่อวัด / แอดมิน</span>
              <span className="text-pink-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812345678"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/10"
            />
          </div>

          {/* รายละเอียดเพิ่มเติม */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>รายละเอียดเพิ่มเติมเกี่ยวกับวัด (ถ้ามี)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ประวัติวัด หรือข้อมูลสำคัญเบื้องต้น"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-400/10 resize-none"
            />
          </div>
        </div>
      </div>

      {/* ปุ่มถัดไป */}
      <div className="mx-auto max-w-2xl pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pink-400 text-sm font-bold text-white shadow-xl shadow-pink-400/20 transition-all hover:bg-pink-500 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          <span>{canSubmit ? "ถัดไป: อัปโหลดเอกสาร" : "กรุณากรอกข้อมูลให้ครบถ้วน"}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}