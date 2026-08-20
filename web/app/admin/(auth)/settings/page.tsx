"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  UserCheck, 
  Bell, 
  ShieldCheck, 
  Languages, 
  Database, 
  ChevronRight 
} from "lucide-react";

export default function AdminSettingsPage() {
  const router = useRouter();

  // รายการเมนูตั้งค่าตามภาพ UX/UI
  const settingItems = [
    {
      title: "ข้อมูลวัด / ผู้ดูแล",
      icon: UserCheck,
      path: "/admin/settings/profile", // ปรับเปลี่ยน Path ตามต้องการ
    },
    {
      title: "การแจ้งเตือน",
      icon: Bell,
      path: "/admin/settings/notifications",
    },
    {
      title: "ความปลอดภัย",
      icon: ShieldCheck,
      path: "/admin/settings/security",
    },
    {
      title: "ภาษาและการแสดงผล",
      icon: Languages,
      path: "/admin/settings/appearance",
    },
    {
      title: "จัดการบัญชี",
      icon: Database,
      path: "/admin/settings/account",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 md:px-8">
      {/* หัวข้อหน้า */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          ตั้งค่า
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          จัดการข้อมูลระบบ การตั้งค่าบัญชี และความปลอดภัยของแอดมิน
        </p>
      </div>

      {/* การ์ดรายการตั้งค่า */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/60 overflow-hidden divide-y divide-border/60">
        {settingItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={() => {
                // ตัวอย่างการกดเปลี่ยนหน้า หรือแสดง Modal แจ้งเตือนว่ากำลังพัฒนา
                if (item.path) {
                  router.push(item.path);
                }
              }}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComponent size={20} />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
              </div>

              <div className="text-muted-foreground transition-transform group-hover:translate-x-1">
                <ChevronRight size={18} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}