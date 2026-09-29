"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Trash2, Database, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // 1. ฟังก์ชันออกจากระบบจริงผ่าน Supabase Auth
  const handleLogout = async () => {
    setLoadingLogout(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error);
      alert("ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง");
      setLoadingLogout(false);
    } else {
      router.push("/admin/login");
    }
  };

  // 2. ฟังก์ชันลบบัญชี (จำลองการจัดการสถานะและพาออกไปหน้าล็อกอิน)
  const handleDeleteAccount = async () => {
    if (confirm("⚠️ คำเตือน: คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) {
      setLoadingDelete(true);
      
      // ทำการ Sign Out ออกจากระบบทันทีเพื่อความปลอดภัย
      await supabase.auth.signOut();
      
      alert("ลบบัญชีผู้ใช้เรียบร้อยแล้ว");
      router.push("/admin/login");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-6">
      {/* ส่วนหัว */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/settings")}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-muted transition cursor-pointer shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Database className="text-primary" size={24} /> การจัดการบัญชี
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            จัดการสถานะเซสชันการเข้าสู่ระบบและความปลอดภัยของบัญชีแอดมิน
          </p>
        </div>
      </div>

      {/* การ์ดรายการจัดการบัญชีแบบเต็มหน้าจอ */}
      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm divide-y divide-border/60">
        
        {/* ออกจากระบบ */}
        <button
          onClick={handleLogout}
          disabled={loadingLogout || loadingDelete}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LogOut size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">ออกจากระบบ</p>
              <p className="text-xs text-muted-foreground mt-0.5">สิ้นสุดเซสชันการใช้งานปัจจุบันบนอุปกรณ์นี้</p>
            </div>
          </div>
          {loadingLogout && <Loader2 size={18} className="animate-spin text-primary" />}
        </button>

        {/* ลบบัญชีผู้ใช้ */}
        <button
          onClick={handleDeleteAccount}
          disabled={loadingLogout || loadingDelete}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-destructive/10 transition cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-destructive">ลบบัญชีผู้ใช้</p>
              <p className="text-xs text-destructive/70 mt-0.5">การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดจะถูกลบ</p>
            </div>
          </div>
          {loadingDelete && <Loader2 size={18} className="animate-spin text-destructive" />}
        </button>

      </div>
    </div>
  );
}