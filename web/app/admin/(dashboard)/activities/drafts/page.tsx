"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface DraftActivity {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
  status: string;
  completeness: number;
  scheduled_at?: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_activities")
      .select("*")
      .eq("status", "draft")
      .order("date", { ascending: false });

    if (data) setDrafts(data);
    setLoading(false);
  };

  const handleDeleteDraft = async (id: string) => {
    if (confirm("ต้องการลบแบบร่างนี้ใช่หรือไม่?")) {
      await supabase.from("admin_activities").delete().eq("id", id);
      setDrafts(drafts.filter((d) => d.id !== id));
    }
  };

  // พอกกดเผยแพร่จากแบบร่าง ให้อัปเดตสถานะเป็น published แล้วเด้งไปหน้ากิจกรรมทันที
  const handlePublishDraft = async (id: string) => {
    const { error } = await supabase
      .from("admin_activities")
      .update({ status: "published", completeness: 100 })
      .eq("id", id);

    if (error) {
      alert("เผยแพร่ไม่สำเร็จ: " + error.message);
    } else {
      alert("เผยแพร่กิจกรรมสำเร็จ!");
      router.push("/admin/activities"); // เด้งไปหน้ากิจกรรมทันทีตามต้องการ
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/activities")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            แบบร่างทั้งหมด
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">จัดการโพสต์ที่ยังไม่ได้เผยแพร่</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/60 text-muted-foreground text-xs">
            กำลังโหลดข้อมูล...
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/60 text-muted-foreground text-xs space-y-2">
            <p>ไม่มีแบบร่างในขณะนี้</p>
            <button
              onClick={() => router.push("/admin/activities/new")}
              className="text-primary font-semibold hover:underline text-xs"
            >
              + ไปสร้างกิจกรรมใหม่
            </button>
          </div>
        ) : (
          drafts.map((draft) => (
            <div key={draft.id} className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                <div className="flex items-start gap-5 w-full">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-border">
                    {draft.image ? (
                      <Image src={draft.image} alt={draft.title} fill className="object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground text-center p-2">ไม่มีรูปภาพ</span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-foreground">{draft.title}</h3>
                      <span className="px-3 py-1 rounded-full bg-[#241A72] text-white text-[10px] font-semibold">
                        แบบร่าง
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">📍 สถานที่: {draft.location || "-"}</p>
                    <p className="text-xs text-muted-foreground">📅 วันที่: {draft.date || "ยังไม่ได้กำหนด"} | ⏰ เวลา: {draft.time || "-"}</p>
                    {draft.scheduled_at && (
                      <p className="text-xs text-blue-600 font-medium">⏰ ตั้งเวลาโพสต์อัตโนมัติ: {new Date(draft.scheduled_at).toLocaleString("th-TH")}</p>
                    )}
                    <p className="text-xs text-foreground line-clamp-2 mt-1">{draft.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border/40">
                <button
                  onClick={() => handlePublishDraft(draft.id)}
                  className="px-4 py-2 rounded-xl bg-[#241A72] text-white text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5"
                >
                  <Send size={14} /> เผยแพร่ทันที
                </button>
                <button
                  onClick={() => handleDeleteDraft(draft.id)}
                  className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> ลบแบบร่าง
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}