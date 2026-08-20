"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export default function AdminChatListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reviews" | "chats">("chats");

  const chatList: ChatItem[] = [
    {
      id: "1",
      name: "ทีมงานสาธุ",
      message: "เนื่องจากรหัสผ่านของคุณมีความปลอดภัยต่ำ...",
      time: "5 เดือนที่ผ่าน",
      unreadCount: 7,
    },
    {
      id: "2",
      name: "ไตภพ สุขทวี",
      message: "มีกิจกรรมวันเสาร์นี้มั้ยครับ?",
      time: "เมื่อสักครู่",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "3",
      name: "Matthew J",
      message: "What time does the temple open to...",
      time: "11 ชั่วโมงที่ผ่านมา",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "4",
      name: "Gina Stone",
      message: "คุณ : รายละเอียดตามนี้คับ",
      time: "5 วันที่ผ่านมา",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-6 space-y-6">
      {/* ส่วนหัว */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          สื่อสารชุมชน
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-6">
        <h2 className="font-display text-lg font-bold text-foreground">แชท</h2>

        {/* แท็บสลับ รีวิว / แชท */}
        <div className="flex rounded-full bg-muted p-1 max-w-sm mx-auto">
          <button
            onClick={() => {
              setActiveTab("reviews");
              router.push("/admin/reviews");
            }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "reviews"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            รีวิว (122)
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "chats"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            แชท (5)
          </button>
        </div>

        {/* รายการแชท */}
        <div className="divide-y divide-border/60">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => router.push(`/admin/chat/${chat.id}`)}
              className="flex items-center justify-between py-4 px-3 rounded-xl transition hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{chat.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {chat.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] text-muted-foreground">{chat.time}</span>
                {chat.unreadCount && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}