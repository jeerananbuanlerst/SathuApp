"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Stepper from "@/components/register/Stepper";
import { supabase } from "@/lib/supabase/client";
import { Clock, CheckCircle2, Building2, Loader2, ArrowRight } from "lucide-react";

export default function RegisterStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("pending");
  const [templeInfo, setTempleInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestRegistration() {
      const { data, error } = await supabase
        .from("temple_registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setTempleInfo(data);
        setStatus(data.status);
      }
      setLoading(false);
    }

    fetchLatestRegistration();
    
    // ตั้งเวลาเช็คสถานะอัตโนมัติทุก 5 วินาที (รอทีมงาน Sathu กดอนุมัติจากหลังบ้าน)
    const interval = setInterval(fetchLatestRegistration, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans pb-16">
      {/* Header ธีมวัด โลโก้ Sathu */}
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
            ขั้นตอนที่ 3 จาก 3
          </span>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            สถานะการสมัคร
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            ตรวจสอบความคืบหน้าคำขอสมัคร Admin ของคุณ
          </p>
        </div>

        <Stepper current={3} />

        <div className="mt-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/70 shadow-sm text-center space-y-6 max-w-xl mx-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-purple-600" />
              <p className="text-xs font-medium">กำลังโหลดข้อมูลสถานะ...</p>
            </div>
          ) : status === "pending" ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-b from-amber-50/60 to-transparent rounded-3xl p-6 sm:p-8 border border-amber-100/80 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100/70 text-amber-600 flex items-center justify-center shadow-inner">
                  <Clock size={32} className="stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900">กำลังรอตรวจสอบข้อมูล</h2>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    เจ้าหน้าที่ทีมงานกลาง Sathu กำลังตรวจสอบเอกสารและข้อมูลวัดของคุณ การอนุมัติจะเสร็จสิ้นภายใน 1-3 วันทำการ
                  </p>
                </div>
              </div>

              {/* เช็คลิสต์สถานะ */}
              <div className="text-left bg-slate-50/60 p-5 rounded-2xl space-y-3.5 text-xs text-slate-600 border border-slate-100 font-medium">
                <div className="flex items-center gap-3 text-emerald-600">
                  <CheckCircle2 size={18} className="shrink-0" /> 
                  <span>ส่งคำขอสมัครและอัปโหลดเอกสารเรียบร้อยแล้ว</span>
                </div>
                <div className="flex items-center gap-3 text-amber-600">
                  <Clock size={18} className="shrink-0 animate-spin" /> 
                  <span>ทีม Sathu กำลังตรวจสอบข้อมูลและเอกสารวัด</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 opacity-60">
                  <div className="w-[18px] h-[18px] rounded-full border border-slate-300 flex items-center justify-center text-[10px]">3</div>
                  <span>รอผลการอนุมัติสิทธิ์ Admin</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 opacity-60">
                  <div className="w-[18px] h-[18px] rounded-full border border-slate-300 flex items-center justify-center text-[10px]">4</div>
                  <span>เข้าใช้งานระบบ Admin Dashboard</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="relative flex flex-col items-center justify-center space-y-4">
                
                {/* เปลี่ยนมาแสดงรูป Logo2.png ตรงนี้ */}
                <div className="relative w-20 h-20 mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/10 to-[#241A72]/10 p-2 shadow-sm border border-purple-100 flex items-center justify-center">
                  <Image
                    src="/Logo2.png"
                    alt="Logo2"
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    สมัคร Admin สำเร็จ!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
                    ข้อมูลและเอกสารได้รับการยืนยันจากทีมงาน Sathu แล้ว เริ่มต้นใช้งานระบบจัดการวัดได้เลย
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/admin/dashboard")}
                className="w-full bg-gradient-to-r from-[#5b3894] to-[#a25192] hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                เข้าสู่ระบบ Admin Dashboard <ArrowRight size={16} />
              </button>
            </div>
          )}

          {templeInfo && (
            <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 text-xs text-slate-600 border border-slate-100 font-medium">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 size={16} className="text-purple-700" /> {templeInfo.temple_name}
              </p>
              <p>ผู้ดูแล: <span className="text-slate-900 font-semibold">{templeInfo.admin_name}</span></p>
              <p>จังหวัด: <span className="text-slate-900 font-semibold">{templeInfo.province}</span></p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}