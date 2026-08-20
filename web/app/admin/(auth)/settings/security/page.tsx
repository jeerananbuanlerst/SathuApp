"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock, Check, Eye, EyeOff, Copy, Trash2, ChevronDown } from "lucide-react";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [is2FA, setIs2FA] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 md:px-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.push("/admin/settings")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="text-primary" size={24} /> ความปลอดภัย
        </h1>
      </div>

      {/* เปลี่ยนรหัสผ่าน */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-foreground">เปลี่ยนรหัสผ่าน</h2>
          <button
            onClick={() => setIsPasswordEditable(!isPasswordEditable)}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm transition hover:opacity-90"
          >
            {isPasswordEditable ? "ยกเลิก" : "แก้ไขข้อมูล"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative flex items-center rounded-xl border border-input bg-background px-3.5 py-3">
            <Lock size={18} className="text-muted-foreground mr-3" />
            <input
              type={showPass ? "text" : "password"}
              disabled={!isPasswordEditable}
              defaultValue="••••••••••••••••••••"
              className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
            />
            <button onClick={() => setShowPass(!showPass)} className="text-muted-foreground mr-2">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Check size={18} className="text-emerald-500" />
          </div>

          <div className="relative flex items-center rounded-xl border border-input bg-background px-3.5 py-3">
            <Lock size={18} className="text-muted-foreground mr-3" />
            <input
              type={showConfirmPass ? "text" : "password"}
              disabled={!isPasswordEditable}
              defaultValue="••••••••••••••••••••"
              className="w-full bg-transparent text-xs text-foreground outline-none disabled:opacity-70"
            />
            <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-muted-foreground mr-2">
              {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Check size={18} className="text-emerald-500" />
          </div>

          {/* เงื่อนไขรหัสผ่าน */}
          <div className="rounded-xl bg-muted/40 p-4 border border-border/60 text-xs space-y-2">
            <p className="font-semibold text-foreground">รหัสผ่านต้องมี</p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> อย่างน้อย 8 ตัวอักษร</div>
              <div className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> ตัวเลข (0-9)</div>
              <div className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> ตัวพิมพ์ใหญ่ (A-Z)</div>
              <div className="flex items-center gap-1.5 text-muted-foreground/60"><span className="w-3.5 h-3.5 rounded-full border border-muted-foreground inline-block text-center text-[10px]">○</span> อักขระพิเศษ (!@#$%^&*)</div>
              <div className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500"/> ตัวพิมพ์เล็ก (a-z)</div>
            </div>
          </div>

          {isPasswordEditable && (
            <div className="flex justify-end pt-2">
              <button onClick={() => { setIsPasswordEditable(false); alert("บันทึกรหัสผ่านสำเร็จ"); }} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md">
                บันทึกข้อมูล
              </button>
            </div>
          )}
        </div>
      </div>

      {/* จัดการผู้ดูแลร่วม */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 shadow-sm space-y-4">
        <h2 className="font-display text-base font-bold text-foreground">จัดการผู้ดูแลร่วม</h2>
        
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="ใส่ email เพื่อเพิ่มรายชื่อแอดมิน"
            className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
          />
          <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
            ค้นหา
          </button>
        </div>

        {/* รายชื่อแอดมิน */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">ส</span>
              <span>สมชาย พิทักษ์ (คุณ)</span>
            </div>
            <span className="text-primary font-medium">เจ้าของ</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">ศ</span>
              <span>ศิวกร โพธิ์ทอง</span>
            </div>
            <div className="flex items-center gap-1 text-primary font-medium cursor-pointer">
              ผู้ดูแล <ChevronDown size={14} />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">ป</span>
              <span>ปัท ปัท</span>
            </div>
            <div className="flex items-center gap-1 text-primary font-medium cursor-pointer">
              ผู้เยี่ยมชม <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* การเข้าถึงทั่วไป */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-foreground mb-2">การเข้าถึงทั่วไป</p>
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                🌐
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">ทุกคนที่มีลิงก์</p>
                <p className="text-[11px] text-muted-foreground">ผู้ใช้ทุกคนที่มีลิงก์ที่มีใช้งานระบบได้สามารถ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer">ผู้ดูแล <ChevronDown size={14}/></span>
            </div>
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
            <Copy size={14} /> คัดลอกลิงก์
          </button>
        </div>
      </div>

      {/* ยืนยันสองขั้นตอน (2FA) */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">ยืนยันสองขั้นตอน (2FA)</p>
          <p className="text-xs text-muted-foreground mt-0.5">เพิ่มความปลอดภัยบัญชี</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">{is2FA ? "เปิด" : "ปิด"}</span>
          <button
            onClick={() => setIs2FA(!is2FA)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              is2FA ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                is2FA ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}