"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  Hash, 
  Phone, 
  User, 
  BadgeCheck, 
  Mail, 
  Edit3, 
  Save,
  ChevronDown 
} from "lucide-react";

export default function TempleProfilePage() {
  const router = useRouter();

  // สถานะเปิด/ปิดการแก้ไข (Editable State) ของแต่ละส่วน
  const [isTempleEditable, setIsTempleEditable] = useState(false);
  const [isAdminEditable, setIsAdminEditable] = useState(false);

  // ข้อมูลฟอร์มวัด
  const [templeData, setTempleData] = useState({
    name: "วัดป่าสิริมงคล",
    address: "123 หมู่ 4 ต.สุรนารี อ.เมือง",
    province: "นครราชสีมา",
    openTime: "06:00 - 18:00",
    registrationNumber: "วัด-000-0000",
    contactNumber: "044-123-456",
  });

  // ข้อมูลฟอร์มผู้ดูแล
  const [adminData, setAdminData] = useState({
    username: "พระมหาสสมชาย ปุญญวุฑโฒ",
    position: "เจ้าอาวาส / ผู้ดูแลระบบ",
    contactNumber: "081-234-5678",
    email: "admin.sathu@gmail.com",
  });

  const handleTempleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTempleEditable(false);
    alert("บันทึกข้อมูลวัดสำเร็จ");
  };

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminEditable(false);
    alert("บันทึกข้อมูลผู้ดูแลสำเร็จ");
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 md:px-8">
      {/* ส่วนหัว: ปุ่มย้อนกลับและชื่อหน้า */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/settings")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
          ข้อมูลวัด / ผู้ดูแล
        </h1>
      </div>

      <div className="space-y-8">
        
        {/* ================= SECTION 1: ข้อมูลวัด ================= */}
        <section className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Building2 className="text-primary" size={22} />
              <h2 className="font-display text-base font-bold text-foreground">ข้อมูลวัด</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsTempleEditable(!isTempleEditable)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm transition hover:opacity-90"
            >
              <Edit3 size={14} />
              {isTempleEditable ? "ยกเลิกแก้ไข" : "แก้ไขข้อมูล"}
            </button>
          </div>

          <form onSubmit={handleTempleSave} className="space-y-4">
            {/* ชื่อวัด */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                ชื่อวัด (Temple Name) *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <Building2 size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isTempleEditable}
                  value={templeData.name}
                  onChange={(e) => setTempleData({ ...templeData, name: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* ที่อยู่วัด */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                ที่อยู่วัด (Address) *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <MapPin size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isTempleEditable}
                  value={templeData.address}
                  onChange={(e) => setTempleData({ ...templeData, address: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* จังหวัด */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                จังหวัด (Province) *
              </label>
              <div className="flex items-center justify-between rounded-xl border border-input bg-background px-3.5 py-2.5">
                <div className="flex items-center gap-2.5 w-full">
                  <MapPin size={18} className="text-muted-foreground shrink-0" />
                  <select
                    disabled={!isTempleEditable}
                    value={templeData.province}
                    onChange={(e) => setTempleData({ ...templeData, province: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70 cursor-pointer"
                  >
                    <option value="นครราชสีมา">นครราชสีมา</option>
                    <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                    <option value="ขอนแก่น">ขอนแก่น</option>
                  </select>
                </div>
                <ChevronDown size={16} className="text-muted-foreground shrink-0" />
              </div>
            </div>

            {/* เวลาเปิด - ปิดวัด */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                เวลาเปิด - ปิดวัด
              </label>
              <div className="flex items-center justify-between rounded-xl border border-input bg-background px-3.5 py-2.5">
                <div className="flex items-center gap-2.5 w-full">
                  <Clock size={18} className="text-muted-foreground shrink-0" />
                  <select
                    disabled={!isTempleEditable}
                    value={templeData.openTime}
                    onChange={(e) => setTempleData({ ...templeData, openTime: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70 cursor-pointer"
                  >
                    <option value="06:00 - 18:00">06:00 - 18:00</option>
                    <option value="05:00 - 20:00">05:00 - 20:00</option>
                    <option value="ตลอด 24 ชั่วโมง">ตลอด 24 ชั่วโมง</option>
                  </select>
                </div>
                <ChevronDown size={16} className="text-muted-foreground shrink-0" />
              </div>
            </div>

            {/* เลขทะเบียนวัด */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                เลขทะเบียนวัด (Temple Registration Number) *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <Hash size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isTempleEditable}
                  value={templeData.registrationNumber}
                  onChange={(e) => setTempleData({ ...templeData, registrationNumber: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* เบอร์ติดต่อวัด */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                เบอร์ติดต่อวัด (Temple contact number) *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <Phone size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isTempleEditable}
                  value={templeData.contactNumber}
                  onChange={(e) => setTempleData({ ...templeData, contactNumber: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* ปุ่มบันทึกข้อมูล (แสดงเฉพาะตอนกดแก้ไข) */}
            {isTempleEditable && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md transition hover:opacity-95"
                >
                  <Save size={16} />
                  บันทึกข้อมูลวัด
                </button>
              </div>
            )}
          </form>
        </section>


        {/* ================= SECTION 2: ข้อมูลผู้ดูแลวัด ================= */}
        <section className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <User className="text-primary" size={22} />
              <h2 className="font-display text-base font-bold text-foreground">ข้อมูลผู้ดูแลวัด</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAdminEditable(!isAdminEditable)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm transition hover:opacity-90"
            >
              <Edit3 size={14} />
              {isAdminEditable ? "ยกเลิกแก้ไข" : "แก้ไขข้อมูล"}
            </button>
          </div>

          <form onSubmit={handleAdminSave} className="space-y-4">
            {/* ชื่อ-ฉายา ผู้ดูแล */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                ชื่อ-ฉายา ผู้ดูแล (User Name) *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <User size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isAdminEditable}
                  value={adminData.username}
                  onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* ตำแหน่ง */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                ตำแหน่ง (position) *
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <BadgeCheck size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isAdminEditable}
                  value={adminData.position}
                  onChange={(e) => setAdminData({ ...adminData, position: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* เบอร์ติดต่อ */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                เบอร์ติดต่อ (Contact number)
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <Phone size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  disabled={!isAdminEditable}
                  value={adminData.contactNumber}
                  onChange={(e) => setAdminData({ ...adminData, contactNumber: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* อีเมล */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                อีเมล (Email)
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                <Mail size={18} className="text-muted-foreground shrink-0" />
                <input
                  type="email"
                  disabled={!isAdminEditable}
                  value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                />
              </div>
            </div>

            {/* ปุ่มบันทึกข้อมูล (แสดงเฉพาะตอนกดแก้ไข) */}
            {isAdminEditable && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md transition hover:opacity-95"
                >
                  <Save size={16} />
                  บันทึกข้อมูลผู้ดูแล
                </button>
              </div>
            )}
          </form>
        </section>

      </div>
    </div>
  );
}