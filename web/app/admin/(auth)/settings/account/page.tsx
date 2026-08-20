"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Trash2, Database } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 md:px-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/settings")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Database className="text-primary" size={24} /> การจัดการบัญชี
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm divide-y divide-border/60">
        {/* ออกจากระบบ */}
        <button
          onClick={() => router.push("/admin/login")}
          className="w-full flex items-center gap-3.5 p-4 md:p-5 text-left hover:bg-muted/50 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LogOut size={20} />
          </div>
          <span className="text-sm font-semibold text-foreground">ออกจากระบบ</span>
        </button>

        {/* ลบบัญชีผู้ใช้ */}
        <button
          onClick={() => confirm("คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่?")}
          className="w-full flex items-center gap-3.5 p-4 md:p-5 text-left hover:bg-destructive/10 transition"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2 size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive">ลบบัญชีผู้ใช้</p>
            <p className="text-xs text-destructive/70">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          </div>
        </button>
      </div>
    </div>
  );
}