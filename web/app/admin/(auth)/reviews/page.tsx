"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Send, Edit2, MoreVertical } from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  time: string;
  comment: string;
  reply?: string;
  isEditingReply?: boolean;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reviews" | "chats">("reviews");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "year">("today");

  // State เก็บรายการรีวิวและการตอบกลับ
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "1",
      name: "ภัทรพล สุดสายเนตร",
      rating: 5,
      time: "17:55 • 11/11/2569",
      comment: "วัดสวยมาก บรรยากาศดี พระท่านใจดีมาก จะกลับมาอีกแน่นอน ขอบคุณมากครับ",
      reply: "ขอบคุณโยมมากนะจ๊ะ ยินดีต้อนรับทุกครั้งเลย 🙏",
      isEditingReply: false,
    },
    {
      id: "2",
      name: "วิไล สุขสม",
      rating: 5,
      time: "11:45 • 11/11/2569",
      comment: "บริจาคออนไลน์ได้ง่ายมาก ดีใจที่มีวัดมีระบบแบบนี้ ขอบคุณมากๆนะคะ",
      reply: "",
      isEditingReply: false,
    },
    {
      id: "3",
      name: "วิไล สุขสม",
      rating: 5,
      time: "08:45 • 11/11/2569",
      comment: "น้องหมาน่ารักมากเลยค่ะ ไว้จะมาอีกนะคะ",
      reply: "",
      isEditingReply: false,
    },
  ]);

  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  // ฟังก์ชันส่งคำตอบกลับ
  const handleSendReply = (id: string) => {
    const text = replyInputs[id];
    if (!text?.trim()) return;

    setReviews(reviews.map(r => r.id === id ? { ...r, reply: text, isEditingReply: false } : r));
    setReplyInputs({ ...replyInputs, [id]: "" });
  };

  // ฟังก์ชันเปิดโหมดแก้ไขคำตอบ
  const handleToggleEditReply = (id: string, currentReply?: string) => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        return { ...r, isEditingReply: !r.isEditingReply };
      }
      return r;
    }));
    if (currentReply) {
      setReplyInputs({ ...replyInputs, [id]: currentReply });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 pb-20 space-y-5">
      
      {/* ส่วนหัว: ปุ่มย้อนกลับ & ชื่อหน้า */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          ความคิดเห็น
        </h1>
      </div>

      {/* แท็บสลับ รีวิว / แชท ตาม UX/UI */}
      <div className="flex rounded-full bg-muted p-1 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === "reviews"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          รีวิว (122)
        </button>
        <button
          onClick={() => {
            setActiveTab("chats");
            router.push("/admin/chat"); // ลิงก์ไปหน้าแชท
          }}
          className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === "chats"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          แชท (5)
        </button>
      </div>

      {/* สรุปคะแนน & จำนวนตอบกลับ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-muted-foreground">คะแนนรีวิวเฉลี่ย</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-foreground">4.9</span>
            <Star size={16} className="text-amber-500 fill-amber-500 inline" />
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-muted-foreground">ตอบกลับแล้ว</span>
          <div className="mt-3">
            <span className="font-display text-3xl font-extrabold text-foreground">120</span>
          </div>
        </div>
      </div>

      {/* ตัวกรองช่วงเวลา (วันนี้, สัปดาห์นี้, เดือนนี้, ปีนี้) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-foreground">รีวิวทั้งหมด (122)</h3>
        </div>

        <div className="flex gap-2">
          {[
            { key: "today", label: "วันนี้" },
            { key: "week", label: "สัปดาห์นี้" },
            { key: "month", label: "เดือนนี้" },
            { key: "year", label: "ปีนี้" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDateFilter(tab.key as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                dateFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* รายการความคิดเห็น / รีวิว */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground pt-1">
          {dateFilter === "today" ? "วันนี้" : "ช่วงเวลาที่เลือก"}
        </p>

        {reviews.map((rev) => (
          <div key={rev.id} className="rounded-2xl bg-card border border-border/60 p-4 md:p-5 shadow-sm space-y-3">
            
            {/* หัวข้อรีวิว (ชื่อผู้ใช้ + ดาว + เวลา + เมนู) */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{rev.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < rev.rating ? "text-amber-500 fill-amber-500" : "text-muted"}
                      />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1.5">{rev.time}</span>
                  </div>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical size={16} />
              </button>
            </div>

            {/* ข้อความรีวิว */}
            <p className="text-xs text-foreground leading-relaxed">
              {rev.comment}
            </p>

            {/* ส่วนตอบกลับ (Reply Box / Edit Mode) */}
            {rev.reply && !rev.isEditingReply ? (
              <div className="relative mt-2 rounded-xl bg-primary/5 border-l-4 border-primary p-3 text-xs space-y-1">
                <p className="text-foreground leading-relaxed">{rev.reply}</p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleToggleEditReply(rev.id, rev.reply)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <Edit2 size={12} /> แก้ไข
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="flex items-center rounded-xl bg-muted px-3.5 py-2.5">
                  <input
                    type="text"
                    placeholder={`ตอบกลับ ${rev.name}...`}
                    value={replyInputs[rev.id] || (rev.isEditingReply ? rev.reply : "")}
                    onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition ml-2"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}