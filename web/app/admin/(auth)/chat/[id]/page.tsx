"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Camera, Image as ImageIcon, Mic, Smile, ArrowUp } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Partner {
  id: string;
  name: string;
  avatar_url: string | null;
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

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = (params?.id as string) ?? "";

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    });
  }, []);

  const fetchConversation = useCallback(async () => {
    setLoading(true);
    setMessages([]);
    setPartner(null);
    setDraft("");

    try {
      const { data: authData } = await supabase.auth.getUser();
      const myId = authData?.user?.id ?? null;
      setCurrentUserId(myId);
      if (!myId || !partnerId) return;

      const { data: msgs, error: msgError } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, message, created_at, is_read")
        .or(
          `and(sender_id.eq.${myId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${myId})`
        )
        .order("created_at", { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgs ?? []);

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", partnerId)
        .maybeSingle();

      setPartner({
        id: partnerId,
        name: profile?.full_name || `ผู้ใช้งาน #${partnerId.slice(0, 6)}`,
        avatar_url: profile?.avatar_url ?? null,
      });

      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", myId)
        .eq("is_read", false);
    } catch (err) {
      console.error("Error loading conversation:", err);
    } finally {
      setLoading(false);
      scrollToBottom(false);
    }
  }, [partnerId, scrollToBottom]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    const channel = supabase
      .channel(`chat-room-${partnerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `sender_id=eq.${partnerId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.receiver_id !== currentUserId) return;
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
          scrollToBottom();
          supabase.from("messages").update({ is_read: true }).eq("id", newMsg.id).then();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId, currentUserId, scrollToBottom]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending || !currentUserId) return;
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: partnerId,
      message: text,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setDraft("");
    scrollToBottom();

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({ sender_id: currentUserId, receiver_id: partnerId, message: text, is_read: false })
        .select()
        .single();

      if (error) throw error;
      setMessages((prev) => prev.map((m) => (m.id === tempId ? data : m)));
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setDraft(text);
    } finally {
      setSending(false);
    }
  };

  const groupedByDay: { label: string; items: Message[] }[] = [];
  for (const m of messages) {
    const label = formatDateLabel(m.created_at);
    const lastGroup = groupedByDay[groupedByDay.length - 1];
    if (lastGroup && lastGroup.label === label) lastGroup.items.push(m);
    else groupedByDay.push({ label, items: [m] });
  }

  const lastMineIndex = messages.map((m) => m.sender_id === currentUserId).lastIndexOf(true);

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* ─── หัวห้องแชท ─── */}
      <div className="flex h-16 shrink-0 items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 px-6">
        <button
          onClick={() => router.push("/chat")}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 md:hidden"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 shadow-2xs">
          {partner?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={partner.avatar_url} alt={partner.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold">{partner?.name?.charAt(0) ?? "?"}</span>
          )}
        </div>

        <h1 className="truncate text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{partner?.name ?? "กำลังโหลด..."}</h1>
      </div>

      {/* ─── ข้อความ ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/40 dark:bg-slate-950/30">
        {loading ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">กำลังโหลด...</div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 border border-purple-100 shadow-sm">
              {partner?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partner.avatar_url} alt={partner.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{partner?.name?.charAt(0) ?? "?"}</span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{partner?.name}</p>
            <p className="text-xs text-slate-400">ยังไม่มีข้อความ เริ่มต้นส่งข้อความทักทายได้เลย</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedByDay.map((group, gi) => (
              <div key={gi} className="space-y-2">
                <div className="flex justify-center py-1">
                  <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500">{group.label}</span>
                </div>
                {group.items.map((m, idx) => {
                  const isMine = m.sender_id === currentUserId;
                  const isLastMine = messages.indexOf(m) === lastMineIndex;

                  return (
                    <div key={m.id} className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className="flex max-w-[75%] flex-col gap-1">
                        <div
                          className={`break-words rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isMine
                              ? "bg-purple-700 text-white rounded-br-xs"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700 rounded-bl-xs"
                          }`}
                        >
                          {m.message}
                        </div>
                        {isMine && isLastMine && (
                          <span className="pr-1 text-right text-[10px] text-slate-400 font-medium">
                            {m.is_read ? "อ่านแล้ว" : "ส่งแล้ว"}
                          </span>
                        )}
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
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2 shadow-2xs">
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
              placeholder="พิมพ์ข้อความ..."
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