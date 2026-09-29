"use client";

import React, { useState, useEffect } from "react";
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
  ChevronDown,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function TempleProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingTemple, setSavingTemple] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);

  // สถานะเปิด/ปิดการแก้ไข (Editable State)
  const [isTempleEditable, setIsTempleEditable] = useState(false);
  const [isAdminEditable, setIsAdminEditable] = useState(false);

  // ID ของแถวข้อมูลในตาราง temple_registrations
  const [recordId, setRecordId] = useState<string | null>(null);

  // ข้อมูลฟอร์มวัด
  const [templeData, setTempleData] = useState({
    name: "",
    address: "",
    province: "นครราชสีมา",
    openTime: "06:00 - 18:00",
    registrationNumber: "",
    contactNumber: "",
  });

  // ข้อมูลฟอร์มผู้ดูแล
  const [adminData, setAdminData] = useState({
    username: "",
    position: "",
    contactNumber: "",
    email: "",
  });

  // ดึงข้อมูลจริงจากตาราง temple_registrations เมื่อโหลดหน้า
  useEffect(() => {
    async function fetchProfileData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const userEmail = session.user.email;
        const userId = session.user.id;

        // ดึงข้อมูลจากตาราง temple_registrations โดยอ้างอิงจาก user_id หรือ email
        const { data, error } = await supabase
          .from("temple_registrations")
          .select("*")
          .or(`user_id.eq.${userId},email.eq.${userEmail}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setRecordId(data.id);
          setTempleData({
            name: data.temple_name || "",
            address: data.address || "",
            province: data.province || "นครราชสีมา",
            openTime: data.open_time || "06:00 - 18:00",
            registrationNumber: data.temple_reg_number || data.registration_number || "",
            contactNumber: data.temple_phone || data.phone || "",
          });

          setAdminData({
            username: data.admin_name || "",
            position: data.position || "",
            contactNumber: data.admin_phone || "",
            email: data.email || userEmail || "",
          });
        } else {
          setAdminData((prev) => ({ ...prev, email: userEmail || "" }));
        }
      }
      setLoading(false);
    }

    fetchProfileData();
  }, []);

  // บันทึกข้อมูลวัดลงตาราง temple_registrations
  const handleTempleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) {
      alert("ไม่พบรหัสข้อมูลวัดในระบบ");
      return;
    }
    setSavingTemple(true);

    const { error } = await supabase
      .from("temple_registrations")
      .update({
        temple_name: templeData.name,
        address: templeData.address,
        province: templeData.province,
        open_time: templeData.openTime,
        temple_reg_number: templeData.registrationNumber,
        temple_phone: templeData.contactNumber,
      })
      .eq("id", recordId);

    if (error) {
      console.error("Error saving temple data:", error);
      alert("ไม่สามารถบันทึกข้อมูลวัดได้ กรุณาลองใหม่อีกครั้ง");
    } else {
      alert("บันทึกข้อมูลวัดสำเร็จ!");
      setIsTempleEditable(false);
    }
    setSavingTemple(false);
  };

  // บันทึกข้อมูลผู้ดูแลลงตาราง temple_registrations
  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId) {
      alert("ไม่พบรหัสข้อมูลผู้ดูแลในระบบ");
      return;
    }
    setSavingAdmin(true);

    const { error } = await supabase
      .from("temple_registrations")
      .update({
        admin_name: adminData.username,
        position: adminData.position,
        admin_phone: adminData.contactNumber,
        phone: adminData.contactNumber,
      })
      .eq("id", recordId);

    if (error) {
      console.error("Error saving admin data:", error);
      alert("ไม่สามารถบันทึกข้อมูลผู้ดูแลได้ กรุณาลองใหม่อีกครั้ง");
    } else {
      alert("บันทึกข้อมูลผู้ดูแลสำเร็จ!");
      setIsAdminEditable(false);
    }
    setSavingAdmin(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground">
        <Loader2 className="animate-spin mr-2" size={20} /> กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-6">
      {/* ส่วนหัว: ปุ่มย้อนกลับและชื่อหน้า */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/settings")}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-muted transition cursor-pointer shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            ข้อมูลวัด / ผู้ดูแล
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            จัดการและอัปเดตข้อมูลรายละเอียดวัดและผู้ดูแลระบบ
          </p>
        </div>
      </div>

      {/* Grid เต็มหน้าจอ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ================= SECTION 1: ข้อมูลวัด ================= */}
        <section className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Building2 className="text-primary" size={22} />
                <h2 className="font-display text-base font-bold text-foreground">ข้อมูลวัด</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsTempleEditable(!isTempleEditable)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm transition hover:opacity-90 cursor-pointer"
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
                    required
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
                    required
                  />
                </div>
              </div>

              {/* จังหวัด */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  จังหวัด (Province) *
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                  <MapPin size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    disabled={!isTempleEditable}
                    value={templeData.province}
                    onChange={(e) => setTempleData({ ...templeData, province: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                    required
                  />
                </div>
              </div>

              {/* เวลาเปิด - ปิดวัด */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  เวลาเปิด - ปิดวัด
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                  <Clock size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    disabled={!isTempleEditable}
                    value={templeData.openTime}
                    onChange={(e) => setTempleData({ ...templeData, openTime: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                  />
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

              {/* ปุ่มบันทึกข้อมูลวัด */}
              {isTempleEditable && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingTemple}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md transition hover:opacity-95 cursor-pointer disabled:opacity-50"
                  >
                    {savingTemple ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>บันทึกข้อมูลวัด</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>


        {/* ================= SECTION 2: ข้อมูลผู้ดูแลวัด ================= */}
        <section className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <User className="text-primary" size={22} />
                <h2 className="font-display text-base font-bold text-foreground">ข้อมูลผู้ดูแลวัด</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminEditable(!isAdminEditable)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm transition hover:opacity-90 cursor-pointer"
              >
                <Edit3 size={14} />
                {isAdminEditable ? "ยกเลิกแก้ไข" : "แก้ไขข้อมูล"}
              </button>
            </div>

            <form onSubmit={handleAdminSave} className="space-y-4">
              {/* ชื่อ-ฉายา ผู้ดูแล */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  ชื่อ-ฉายา ผู้ดูแล (Admin Name) *
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                  <User size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    disabled={!isAdminEditable}
                    value={adminData.username}
                    onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                    required
                  />
                </div>
              </div>

              {/* ตำแหน่ง */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  ตำแหน่ง (Position) *
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:border-primary">
                  <BadgeCheck size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    disabled={!isAdminEditable}
                    value={adminData.position}
                    onChange={(e) => setAdminData({ ...adminData, position: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
                    required
                  />
                </div>
              </div>

              {/* เบอร์ติดต่อ */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  เบอร์ติดต่อผู้ดูแล (Contact number)
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
                  อีเมล (Email) - ไม่สามารถแก้ไขได้
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-input bg-muted px-3.5 py-2.5">
                  <Mail size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="email"
                    disabled
                    value={adminData.email}
                    className="w-full bg-transparent text-xs text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* ปุ่มบันทึกข้อมูลผู้ดูแล */}
              {isAdminEditable && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingAdmin}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md transition hover:opacity-95 cursor-pointer disabled:opacity-50"
                  >
                    {savingAdmin ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>บันทึกข้อมูลผู้ดูแล</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}