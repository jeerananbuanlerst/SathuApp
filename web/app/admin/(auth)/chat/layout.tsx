"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface SidebarItem {
  key: string;
  href: string;
  name: string;
  avatar_url: string | null;
  last_message: string;
  updated_at: string;
  unread_count: number;
  is_mine: boolean;
  isSathu?: boolean;
}

function formatRelativeTime(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffMin = (now.getTime() - date.getTime()) / 60000;
  const diffHr = diffMin / 60;
  const isSameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (diffMin < 1) return "ตอนนี้";
  if (diffMin < 60) return `${Math.floor(diffMin)} น.`;
  if (isSameDay) return `${Math.floor(diffHr)} ชม.`;
  if (isYesterday) return "เมื่อวาน";
  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<SidebarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isRoot = pathname === "/admin/chat" || pathname === "/chat";

  const fetchItems = useCallback(async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const myId = authData?.user?.id ?? null;
      if (!myId) {
        setItems([]);
        return;
      }

      const list: SidebarItem[] = [];

      // 1) ห้องทีมงานสาธุ (ปักหมุดบนสุด)
      const { data: temple } = await supabase
        .from("temple_registrations")
        .select("id")
        .eq("user_id", myId)
        .maybeSingle();

      if (temple) {
        const { data: latest } = await supabase
          .from("temple_chats")
          .select("message, sender_type, created_at")
          .eq("temple_id", temple.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count } = await supabase
          .from("temple_chats")
          .select("id", { count: "exact", head: true })
          .eq("temple_id", temple.id)
          .eq("sender_type", "sathu")
          .eq("is_read", false);

        // ปรับ path ให้ตรงกับโครงสร้าง /admin/chat/sathu ของคุณ
        list.push({
          key: "sathu",
          href: "/admin/chat/sathu",
          name: "ทีมงานสาธุ",
          avatar_url: null,
          last_message: latest?.message ?? "แตะเพื่อเริ่มคุยกับทีมงานสาธุ",
          updated_at: latest?.created_at ?? "",
          unread_count: count ?? 0,
          is_mine: latest?.sender_type === "temple",
          isSathu: true,
        });
      }

      // 2) ห้องแชท 1-1 กับญาติโยมจากตาราง messages
      const { data: dbMessages, error: msgError } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, message, created_at, is_read")
        .or(`sender_id.eq.${myId},receiver_id.eq.${myId}`)
        .order("created_at", { ascending: false });

      if (msgError) throw msgError;

      const grouped = new Map<
        string,
        { last_message: string; updated_at: string; unread_count: number; is_mine: boolean }
      >();

      for (const m of dbMessages ?? []) {
        const partnerId = m.sender_id === myId ? m.receiver_id : m.sender_id;
        if (!grouped.has(partnerId)) {
          grouped.set(partnerId, {
            last_message: m.message,
            updated_at: m.created_at,
            unread_count: 0,
            is_mine: m.sender_id === myId,
          });
        }
        if (m.receiver_id === myId && !m.is_read) {
          grouped.get(partnerId)!.unread_count += 1;
        }
      }

      const partnerIds = Array.from(grouped.keys());
      let profileMap = new Map<string, { name: string; avatar_url: string | null }>();

      if (partnerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", partnerIds);

        if (profiles) {
          profileMap = new Map(
            profiles.map((p: any) => [p.id, { name: p.full_name || "ญาติโยมผู้ใช้งาน", avatar_url: p.avatar_url ?? null }])
          );
        }
      }

      const others: SidebarItem[] = partnerIds
        .map((pid) => {
          const info = grouped.get(pid)!;
          const profile = profileMap.get(pid);
          return {
            key: pid,
            href: `/admin/chat/${pid}`,
            name: profile?.name || `ผู้ใช้งาน #${pid.slice(0, 6)}`,
            avatar_url: profile?.avatar_url ?? null,
            last_message: info.last_message,
            updated_at: info.updated_at,
            unread_count: info.unread_count,
            is_mine: info.is_mine,
          };
        })
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setItems([...list, ...others]);
    } catch (err) {
      console.error("Error fetching chat sidebar:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("chat-sidebar")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => fetchItems())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, () => fetchItems())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "temple_chats" }, () => fetchItems())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "temple_chats" }, () => fetchItems())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  const filtered = items.filter((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="mx-auto flex h-[calc(100dvh-64px)] w-full max-w-7xl overflow-hidden bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 md:my-6 md:h-[calc(100dvh-100px)] md:rounded-3xl md:border md:border-purple-100 dark:md:border-purple-900/40 md:shadow-2xl">
      {/* ─── แถบข้าง: เลือกแชท ─── */}
      <aside
        className={`${isRoot ? "flex" : "hidden"} w-full shrink-0 flex-col border-r border-slate-100 dark:border-slate-800 md:flex md:w-[360px] bg-white dark:bg-slate-900`}
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-base font-bold text-slate-900 dark:text-white">ข้อความสนทนากับญาติโยม</h1>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อญาติโยม..."
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 py-3 pl-11 pr-4 text-xs text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 border border-slate-200/60 dark:border-slate-800 focus:border-purple-600 shadow-2xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-xs text-slate-400">กำลังโหลด...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-xl font-bold">
                💬
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">ยังไม่มีข้อความ</p>
              <p className="text-[11px] text-slate-400">แชทจากญาติโยมจะแสดงที่นี่แบบเรียลไทม์</p>
            </div>
          ) : (
            filtered.map((it) => {
              const hasUnread = it.unread_count > 0;
              const isActive = pathname === it.href;
              const time = formatRelativeTime(it.updated_at);

              return (
                <Link
                  key={it.key}
                  href={it.href}
                  className={`flex items-center gap-3.5 px-5 py-3.5 transition-colors ${
                    isActive ? "bg-purple-50/70 dark:bg-purple-950/40" : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 shadow-2xs">
                      {it.isSathu ? (
                        <div className="flex h-full w-full items-center justify-center bg-purple-700 text-white">
                          <MessageSquare size={20} />
                        </div>
                      ) : it.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.avatar_url} alt={it.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold">{it.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs ${hasUnread ? "font-extrabold text-slate-900 dark:text-white" : "font-bold text-slate-800 dark:text-slate-200"}`}>{it.name}</p>
                    <p className={`truncate text-[11px] mt-0.5 ${hasUnread ? "font-bold text-purple-600 dark:text-purple-400" : "text-slate-400 font-medium"}`}>
                      {it.is_mine && "คุณ: "}
                      {it.last_message}
                      {time && ` · ${time}`}
                    </p>
                  </div>

                  {hasUnread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-600 shadow-sm" />}
                </Link>
              );
            })
          )}
        </div>
      </aside>

      {/* ─── ห้องแชทด้านขวา ─── */}
      <section className={`${isRoot ? "hidden" : "flex"} min-w-0 flex-1 flex-col md:flex bg-white dark:bg-slate-900`}>{children}</section>
    </div>
  );
}