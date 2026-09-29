"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Languages } from "lucide-react";
import { GoogleTranslate } from "@/components/GoogleTranslate";

export default function AppearanceSettingsPage() {
  const router = useRouter();

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
            <Languages className="text-primary" size={24} /> ภาษาและการแสดงผล
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            เลือกภาษาหลักในการแสดงผลระบบผู้ดูแลระบบ (Google Translate)
          </p>
        </div>
      </div>

      {/* การ์ดตั้งค่าภาษา */}
      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Languages size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">ระบบแปลภาษาเว็บไซต์ (Automatic Translation)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              เลือกภาษาที่ต้องการจากเมนูด้านล่าง เว็บไซต์จะทำการแปลเนื้อหาทั้งหมดทันที
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/40">
          {/* เรียกใช้งาน Google Translate Widget */}
          <GoogleTranslate />
        </div>
      </div>
    </div>
  );
}