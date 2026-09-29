"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserCheck, 
  Bell, 
  ShieldCheck, 
  Languages, 
  Database, 
  ChevronRight,
  ArrowLeft,
  Moon,
  Sun
} from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const settingSections = [
    {
      title: "บัญชีและความปลอดภัย",
      badge: "Account & Security",
      items: [
        { title: "ข้อมูลวัด / ผู้ดูแล", subtitle: "จัดการข้อมูลโปรไฟล์วัดและแอดมินผู้ดูแล", icon: UserCheck, path: "/admin/settings/profile", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60" },
        { title: "ความปลอดภัย", subtitle: "เปลี่ยนรหัสผ่านและตรวจสอบความปลอดภัยระบบ", icon: ShieldCheck, path: "/admin/settings/security", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60" },
      ]
    },
    {
      title: "ระบบและการแสดงผล",
      badge: "System & Preferences",
      items: [
        { title: "การแจ้งเตือน", subtitle: "ตั้งค่าการรับข่าวสารและการแจ้งเตือนกิจกรรม", icon: Bell, path: "/admin/settings/notifications", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
        { title: "ภาษาและการแสดงผล", subtitle: "เลือกภาษาและรูปแบบธีมการแสดงผล", icon: Languages, path: "/admin/settings/appearance", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
        { title: "จัดการบัญชี", subtitle: "ข้อมูลระบบฐานข้อมูลและแคชการใช้งาน", icon: Database, path: "/admin/settings/account", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60" },
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-8 font-sans text-slate-800 dark:text-slate-100 animate-fade-in-up">
      
      {/* ส่วนหัวพร้อมปุ่มย้อนกลับ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs cursor-pointer shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              ตั้งค่าระบบ
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              จัดการข้อมูลระบบ การตั้งค่าบัญชี และความปลอดภัยของแอดมิน
            </p>
          </div>
        </div>
      </div>

      {/* การ์ดสลับโหมด (Dark / Light Mode) ดีไซน์พรีเมียม */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-7 shadow-xl border border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 shrink-0 shadow-2xs">
            {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
          </div>
          <div className="space-y-1">
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {isDarkMode ? "โหมดกลางคืน (Dark Mode)" : "โหมดกลางวัน (Light Mode)"}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ปรับเปลี่ยนธีมการแสดงผลเพื่อความสบายตาในการใช้งานช่วงเวลากลางคืนหรือกลางวัน
            </p>
          </div>
        </div>

        {/* ปุ่มสวิตช์ */}
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-11 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none shadow-inner ${
            isDarkMode ? "bg-purple-950" : "bg-purple-200"
          }`}
        >
          <span className="sr-only">Toggle theme</span>
          <span
            className={`pointer-events-none relative flex h-10 w-10 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${
              isDarkMode ? "translate-x-9 bg-slate-900" : "translate-x-0"
            }`}
          >
            {isDarkMode ? (
              <span className="relative flex items-center justify-center size-full text-sm">
                🌕
              </span>
            ) : (
              <span className="relative flex items-center justify-center size-full text-sm">
                ☀️
              </span>
            )}
          </span>
        </button>
      </div>

      {/* รายการหมวดหมู่การตั้งค่า (ใช้ items-start เพื่อไม่ให้การ์ดฝั่งซ้ายยืดตามฝั่งขวาจนเกิดช่องว่าง) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {settingSections.map((section, sIndex) => (
          <div key={sIndex} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-purple-100 dark:border-purple-900/40 p-6 space-y-5">
            <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-200/60 dark:border-purple-800/50">
                {section.badge}
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white pt-1">{section.title}</h2>
            </div>

            <div className="space-y-3">
              {section.items.map((item, iIndex) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={iIndex}
                    onClick={() => item.path && router.push(item.path)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-left transition-all hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/40 dark:hover:bg-slate-800 group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 shadow-2xs group-hover:scale-105 transition ${item.color}`}>
                        <IconComponent size={22} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-slate-400 shrink-0 transition-transform group-hover:translate-x-1 pl-2">
                      <ChevronRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}