"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Stepper from "@/components/register/Stepper";
import { supabase } from "@/lib/supabase/client";
import { Building2, Home, MapPin, Clock, Hash, Phone, User, Briefcase, Mail, Lock, Loader2, ChevronDown, Eye, EyeOff } from "lucide-react";

// รายชื่อ 77 จังหวัดในประเทศไทย
const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

export default function RegisterAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    templeName: "",
    address: "",
    province: "นครราชสีมา",
    openTime: "06:00",
    closeTime: "18:00",
    templeRegNumber: "",
    templePhone: "",
    email: "",
    password: "", // ฟิลด์รหัสผ่านสำหรับแอดมินวัด
    adminName: "",
    position: "",
    adminPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) {
      alert("กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      // 1. สมัครบัญชี Supabase Auth ให้แอดมินวัดมีรหัสผ่านสำหรับล็อกอินจริง
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      const formattedOpenTime = `${formData.openTime} - ${formData.closeTime} น.`;

      // 2. บันทึกข้อมูลลงตาราง temple_registrations (ผูก user_id และอีเมล)
      const { error: dbError } = await supabase.from("temple_registrations").insert([
        {
          user_id: userId,
          temple_name: formData.templeName,
          address: formData.address,
          province: formData.province,
          open_time: formattedOpenTime,
          temple_reg_number: formData.templeRegNumber,
          temple_phone: formData.templePhone,
          email: formData.email,
          admin_name: formData.adminName,
          position: formData.position,
          admin_phone: formData.adminPhone,
          phone: formData.adminPhone,
          status: "pending",
        },
      ]);

      if (dbError) throw dbError;

      setLoading(false);
      router.push("/admin/register/documents");
    } catch (error: any) {
      setLoading(false);
      alert("เกิดข้อผิดพลาด: " + error.message);
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
            ขั้นตอนที่ 1 จาก 3
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            สมัคร Admin วัด
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            กรอกข้อมูลวัดและตั้งรหัสผ่านสำหรับเข้าสู่ระบบผู้ดูแล
          </p>
        </div>

        <Stepper current={1} />

        <form onSubmit={handleNext} className="mt-8 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/70 shadow-sm">
          
          {/* ข้อมูลวัด */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={15} /> ข้อมูลวัด
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อวัด (Temple Name) *</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="templeName"
                    required
                    value={formData.templeName}
                    onChange={handleChange}
                    placeholder="เช่น วัดป่าสิริมงคล"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ที่อยู่ (Address) *</label>
                <div className="relative">
                  <Home size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="เลขที่ / หมู่บ้าน / ซอย / ถนน"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">จังหวัด (Province) *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-10 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium appearance-none cursor-pointer"
                    >
                      {THAI_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">เวลาเปิด - ปิดวัด *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      name="openTime"
                      required
                      value={formData.openTime}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 px-3 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                    />
                    <input
                      type="time"
                      name="closeTime"
                      required
                      value={formData.closeTime}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 px-3 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">เลขทะเบียนวัด (Temple Registration Number) *</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="templeRegNumber"
                    required
                    value={formData.templeRegNumber}
                    onChange={handleChange}
                    placeholder="วัด-000-0000"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">เบอร์ติดต่อวัด *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="templePhone"
                      required
                      value={formData.templePhone}
                      onChange={handleChange}
                      placeholder="012-123-4567"
                      className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">อีเมลติดต่อ (Email) *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="temple@email.com"
                      className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* ข้อมูลผู้ดูแล */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <User size={15} /> ข้อมูลผู้ดูแลระบบ
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อ-ฉายา ผู้ดูแล (Admin Name) *</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="adminName"
                    required
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="ชื่อผู้ดูแลระบบ"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ตั้งรหัสผ่านสำหรับเข้าสู่ระบบ (Password) *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="อย่างน้อย 6 ตัวอักษรขึ้นไป"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-12 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ตำแหน่ง (Position) *</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="เช่น เจ้าอาวาส, ไวยาวัจกร"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">เบอร์ติดต่อผู้ดูแล (Contact Number) *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="adminPhone"
                    required
                    value={formData.adminPhone}
                    onChange={handleChange}
                    placeholder="012-123-4567"
                    className="w-full rounded-2xl bg-slate-50/70 border border-slate-200 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#5b3894] to-[#a25192] hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "กำลังบันทึกข้อมูล..." : "ถัดไป: อัปโหลดเอกสาร →"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}