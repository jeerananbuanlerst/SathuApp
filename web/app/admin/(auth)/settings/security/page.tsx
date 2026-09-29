"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("กรุณากรอกรหัสผ่านให้ครบถ้วน");
      return;
    }

    if (newPassword.length < 8) {
      alert("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      alert("เปลี่ยนรหัสผ่านสำเร็จ!");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordEditable(false);
    } catch (err: any) {
      console.error("Error updating password:", err);
      alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน: " + (err?.message || "unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-8 font-sans text-slate-800 dark:text-slate-100 animate-fade-in-up">
      
      {/* ส่วนหัวพร้อมปุ่มลูกศรย้อนกลับ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/settings")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 flex items-center gap-2.5">
              ความปลอดภัย
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              จัดการรหัสผ่านและตรวจสอบความปลอดภัยของบัญชีผู้ดูแลระบบ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* คอลัมน์ซ้าย: เปลี่ยนรหัสผ่านจริงผ่าน Supabase Auth */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/40 p-6 md:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" /> เปลี่ยนรหัสผ่านบัญชี
              </h2>
              <button
                onClick={() => {
                  setIsPasswordEditable(!isPasswordEditable);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 text-xs font-semibold transition hover:bg-purple-100 dark:hover:bg-purple-900/60 cursor-pointer"
              >
                {isPasswordEditable ? "ยกเลิก" : "แก้ไขข้อมูล"}
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-3">
                <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3.5 shadow-2xs">
                  <Lock size={18} className="text-slate-400 mr-3 shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    disabled={!isPasswordEditable}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none disabled:opacity-60"
                  />
                  {isPasswordEditable && (
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600 mr-2 cursor-pointer">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                  {newPassword.length >= 8 && <Check size={18} className="text-emerald-500" />}
                </div>

                <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3.5 shadow-2xs">
                  <Lock size={18} className="text-slate-400 mr-3 shrink-0" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    disabled={!isPasswordEditable}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 outline-none disabled:opacity-60"
                  />
                  {isPasswordEditable && (
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-slate-400 hover:text-slate-600 mr-2 cursor-pointer">
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                  {confirmPassword && confirmPassword === newPassword && <Check size={18} className="text-emerald-500" />}
                </div>
              </div>

              {/* เงื่อนไขรหัสผ่าน */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">รหัสผ่านต้องประกอบด้วย:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> อย่างน้อย 8 ตัวอักษรขึ้นไป</div>
                  <div className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> รองรับความปลอดภัยมาตรฐาน</div>
                </div>
              </div>

              {isPasswordEditable && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* คอลัมน์ขวา: คำแนะนำ */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/40 p-6 shadow-xl space-y-4">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">คำแนะนำด้านความปลอดภัย</h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>• ควรเปลี่ยนรหัสผ่านทุกๆ 3-6 เดือนเพื่อความปลอดภัยสูงสุด</p>
              <p>• หลีกเลี่ยงการใช้รหัสผ่านที่คาดเดาง่าย เช่น วันเกิดหรือเบอร์โทรศัพท์</p>
              <p>• หากพบความผิดปกติในการเข้าใช้งาน กรุณาติดต่อทีมงานสาธุทันที</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}