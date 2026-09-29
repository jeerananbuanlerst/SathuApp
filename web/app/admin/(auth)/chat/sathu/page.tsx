"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUp, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface TempleInfo {
  id: string;
  temple_name: string;
  status: string;
}

interface ChatMessage {
  id: string;
  temple_id: string;
  sender_type: "sathu" | "temple";
  message: string;
  created_at: string;
  is_read?: boolean;
}

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return "วันนี้";
  if (date.toDateString() === yesterday.toDateString()) return "เมื่อวาน";
  return date.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
}

export default function SathuChatRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myTemple, setMyTemple] = useState<TempleInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const myId = authData?.user?.id ?? null;
        if (!myId) {
          setErrorMsg("กรุณาเข้าสู่ระบบก่อนใช้งานแชท");
          return;
        }

        const { data, error } = await supabase
          .from("temple_registrations")
          .select("id, temple_name, status")
          .eq("user_id", myId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setErrorMsg("ไม่พบข้อมูลวัดที่ผูกกับบัญชีนี้ กรุณาติดต่อทีมงานสาธุ");
          return;
        }
        setMyTemple(data);
      } catch (err: any) {
        console.error("Error loading temple info:", err);
        setErrorMsg("โหลดข้อมูลวัดไม่สำเร็จ: " + (err?.message ?? "unknown error"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!myTemple) return;
    let isCancelled = false;

    const init = async () => {
      const { data, error } = await supabase
        .from("temple_chats")
        .select("*")
        .eq("temple_id", myTemple.id)
        .order("created_at", { ascending: true });

      if (error) console.error("โหลดข้อความแชทไม่สำเร็จ:", error.message);
      if (!isCancelled && data) {
        setMessages(data);
        scrollToBottom(false);
      }

      await supabase
        .from("temple_chats")
        .update({ is_read: true })
        .eq("temple_id", myTemple.id)
        .eq("sender_type", "sathu")
        .eq("is_read", false);
    };
    init();

    const channel = supabase
      .channel(`temple_chats_room_${myTemple.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "temple_chats", filter: `temple_id=eq.${myTemple.id}` },
        (payload) => {
          const incoming = payload.new as ChatMessage;
          setMessages((prev) => (prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]));
          scrollToBottom();
          if (incoming.sender_type === "sathu") {
            supabase.from("temple_chats").update({ is_read: true }).eq("id", incoming.id).then();
          }
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [myTemple, scrollToBottom]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !myTemple || sending) return;

    setSending(true);
    setDraft("");

    const { error } = await supabase
      .from("temple_chats")
      .insert([{ temple_id: myTemple.id, sender_type: "temple", message: text }]);

    setSending(false);

    if (error) {
      alert("ส่งข้อความไม่สำเร็จ: " + error.message);
      setDraft(text);
    }
  };

  const groupedByDay: { label: string; items: ChatMessage[] }[] = [];
  for (const m of messages) {
    const label = formatDateLabel(m.created_at);
    const lastGroup = groupedByDay[groupedByDay.length - 1];
    if (lastGroup && lastGroup.label === label) lastGroup.items.push(m);
    else groupedByDay.push({ label, items: [m] });
  }

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* ─── หัวห้องแชท ─── */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => router.push("/admin/chat")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 md:hidden"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-700 text-white shadow-sm">
            <MessageSquare size={18} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xs sm:text-sm font-bold">ทีมงานสาธุ</h1>
            {myTemple && <p className="truncate text-[11px] text-slate-400">{myTemple.temple_name}</p>}
          </div>
        </div>

        {myTemple && (
          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 text-[10px] font-bold">
            {myTemple.status}
          </span>
        )}
      </div>

      {/* ─── ข้อความ ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/40 dark:bg-slate-950/30">
        {loading ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">กำลังโหลด...</div>
        ) : errorMsg ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
            <MessageSquare size={32} className="text-slate-300" />
            <p className="text-xs text-slate-500">{errorMsg}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 shadow-sm border border-purple-100">
              <MessageSquare size={28} />
            </div>
            <p className="text-sm font-bold">ทีมงานสาธุ</p>
            <p className="text-xs text-slate-400">ยังไม่มีข้อความ ส่งข้อความพูดคุยกับทีมงานได้เลย</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedByDay.map((group, gi) => (
              <div key={gi} className="space-y-2">
                <div className="flex justify-center py-1">
                  <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500">{group.label}</span>
                </div>
                {group.items.map((m) => {
                  const isMine = m.sender_type === "temple";
                  return (
                    <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] break-words rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isMine
                            ? "bg-purple-700 text-white rounded-br-xs"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700 rounded-bl-xs"
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── แถบพิมพ์ข้อความ ─── */}
      <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={!myTemple}
              placeholder="พิมพ์ข้อความถึงทีมงานสาธุ..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-purple-700 hover:bg-purple-600 text-white disabled:opacity-40 transition shadow-sm"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}