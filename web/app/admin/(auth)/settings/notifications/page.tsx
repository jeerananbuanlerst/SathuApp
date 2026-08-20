"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";

export default function NotificationsSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    donation: true,
    review: true,
    activity: false,
    report: true,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    {
      key: "donation" as const,
      title: "แจ้งเตือนเมื่อมีบริจาค",
      desc: "รับ Notification ทันที",
    },
    {
      key: "review" as const,
      title: "แจ้งเตือนรีวิวใหม่",
      desc: "เมื่อมีคนรีวิววัด",
    },
    {
      key: "activity" as const,
      title: "แจ้งเตือนก่อนกิจกรรม",
      desc: "ก่อนวันงาน 1 วัน",
    },
    {
      key: "report" as const,
      title: "แจ้งเตือนอัปเดตรายงาน",
      desc: "เตือนให้อัปเดตทุกสัปดาห์",
    },
  ];

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
          <Bell className="text-primary" size={24} /> การแจ้งเตือน
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 shadow-sm divide-y divide-border/60">
        {notificationItems.map((item) => {
          const isOn = settings[item.key];
          return (
            <div key={item.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {isOn ? "เปิด" : "ปิด"}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSwitch(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isOn ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isOn ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}