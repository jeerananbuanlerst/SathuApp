"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Languages, ChevronRight } from "lucide-react";

export default function AppearanceSettingsPage() {
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
          <Languages className="text-primary" size={24} /> ภาษาและการแสดงผล
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <div className="w-full flex items-center justify-between p-4 md:p-5 text-left border-b border-border/60 cursor-pointer hover:bg-muted/50 transition">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Languages size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">ภาษา</p>
              <p className="text-xs text-muted-foreground">ภาษาไทย</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}