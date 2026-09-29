"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";
import { GoogleTranslate } from "@/components/GoogleTranslate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row">
      {/* Sidebar ฝั่งซ้าย */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* แถบบาร์ด้านบน (ลบชื่อวัดออกแล้ว เหลือแค่ปุ่มเมนูมือถือและตัวสลับภาษาขวาบน) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition cursor-pointer"
              aria-label="เปิดเมนู"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* ปุ่มสลับภาษาอยู่มุมขวาบนแบบคลีนๆ */}
          <div className="flex items-center gap-2">
            <GoogleTranslate />
          </div>
        </div>

        {/* เนื้อหาหน้าเว็บหลัก */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}