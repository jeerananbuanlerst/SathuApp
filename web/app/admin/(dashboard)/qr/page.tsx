"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode, Download, Printer, Sparkles, Award } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toPng } from "html-to-image";

export default function AdminQRPage() {
  const [templeName, setTempleName] = useState("กำลังโหลดชื่อวัด...");
  const [templeId, setTempleId] = useState("SATHU-WAT-000");
  const [isDownloading, setIsDownloading] = useState(false);

  // Reference สำหรับชี้ไปที่กล่องการ์ด QR Code ที่ต้องการแปลงเป็นรูปภาพ
  const qrCardRef = useRef<HTMLDivElement>(null);

  // ดึงชื่อวัดจริงของผู้ดูแลที่ล็อกอินอยู่มาทำเป็นข้อมูล QR
  useEffect(() => {
    async function fetchTempleData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("temple_registrations")
          .select("temple_name, id")
          .eq("email", session.user.email)
          .maybeSingle();

        if (data) {
          setTempleName(data.temple_name || "วัดในระบบ Sathu");
          setTempleId(`SATHU-${data.id ? data.id.slice(0, 8).toUpperCase() : "WAT-999"}`);
        }
      }
    }
    fetchTempleData();
  }, []);

  // ฟังก์ชันแปลง HTML element เป็นรูปภาพ PNG และดาวน์โหลดลงเครื่อง
  const handleDownloadImage = async () => {
    if (qrCardRef.current === null) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(qrCardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        skipFonts: true, // ปิดการฝังฟอนต์ภายนอกเพื่อตัดปัญหา SecurityError / CSSRules
        filter: (node) => {
          const tagName = node.tagName;
          return tagName !== 'SCRIPT' && tagName !== 'IFRAME';
        },
      });
      const link = document.createElement("a");
      link.download = `sathu-qr-${templeId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-8 font-sans text-slate-800 dark:text-slate-100 animate-fade-in-up">
      
      {/* ส่วนหัว */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Merit QR Code System
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            คิวอาร์โค้ดสะสมแต้มบุญและรับบริจาค
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ระบบสร้างคิวอาร์โค้ดประจำวัดอัตโนมัติ สำหรับให้ญาติโยมสแกนทำบุญและรับแต้มบุญ (Sathu Points)
          </p>
        </div>
      </div>

      {/* Grid แสดงผล */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* การ์ดแสดงตัวอย่าง QR Code (ใส่ ref เพื่อใช้สำหรับจับภาพเป็นรูปภาพ) */}
        <div 
          ref={qrCardRef}
          className="lg:col-span-1 bg-gradient-to-b from-purple-900 via-[#241A72] to-slate-900 rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden space-y-6"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🪷</div>
          
          <div className="space-y-1 pt-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10">
              <Sparkles size={12} /> QR ประจำวัดอัตโนมัติ
            </span>
            <h3 className="font-display text-lg font-bold pt-1 truncate px-2">
              {templeName}
            </h3>
            <p className="text-[11px] text-purple-200">สแกนทำบุญ & สะสมแต้มบุญเสริมดวง</p>
          </div>

          {/* กรอบจำลอง QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-inner inline-block mx-auto text-slate-900 space-y-3">
            <div className="w-48 h-48 bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative group">
              <QrCode size={120} className="text-slate-800" />
              <div className="absolute inset-0 bg-purple-900/80 backdrop-blur-xs rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                รหัสวัด: {templeId}
              </div>
            </div>
            <p className="text-[10px] font-bold text-purple-900 tracking-wider">
              สแกนผ่านแอปพลิเคชัน Sathu
            </p>
          </div>

          <div className="text-[11px] text-purple-200 pb-2">
            ทุก 100 บาท = 10 แต้มบุญสะสมเพื่อแลกรับสิทธิพิเศษ
          </div>
        </div>

        {/* ส่วนตั้งค่าและปุ่มดาวน์โหลดจริง */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 p-6 md:p-7 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={18} className="text-purple-600 dark:text-purple-400" /> ตั้งค่าแต้มบุญและสิทธิประโยชน์
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">อัตราการให้แต้มบุญ (ต่อยอดบริจาค)</label>
                <input 
                  type="text" 
                  disabled 
                  value="10 บาท = 1 แต้มบุญ (ค่าเริ่มต้นระบบ)" 
                  className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">รหัสประจำคิวอาร์โค้ดวัด (Temple QR ID)</label>
                <input 
                  type="text" 
                  disabled 
                  value={templeId} 
                  className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono outline-none font-semibold"
                />
              </div>

              <div className="bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200/60 dark:border-purple-800/60 space-y-1">
                <p className="font-bold text-purple-700 dark:text-purple-300">💡 ฟีเจอร์สะสมแต้มบุญอัตโนมัติ</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  ทันทีที่คุณสมัครและผ่านการอนุมัติ ระบบได้สร้างคิวอาร์โค้ดสแตนดี้ประจำวัดนี้ให้ทันที ญาติโยมสามารถเปิดมือถือสแกนเพื่อร่วมทำบุญและสะสมแต้มบุญกับทางวัดได้ทันทีโดยไม่ต้องตั้งค่าเพิ่ม!
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button 
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Download size={16} /> {isDownloading ? "กำลังบันทึกภาพ..." : "ดาวน์โหลดภาพ QR (PNG)"}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}