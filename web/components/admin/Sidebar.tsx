"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  HeartHandshake,
  Newspaper,
  ShieldCheck,
  Settings,
  LogOut,
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"

const nav = [
  { href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/projects", label: "โครงการบริจาค", icon: HeartHandshake },
  { href: "/admin/activities", label: "โพสต์กิจกรรมวัด", icon: Newspaper },
  { href: "/admin/transparency", label: "รายงานความโปร่งใส", icon: ShieldCheck },
]

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  
  const [templeName, setTempleName] = useState("กำลังโหลดชื่อวัด...")

  // ดึงชื่อวัดจริงของผู้ใช้ที่กำลังล็อกอินอยู่
  useEffect(() => {
    async function fetchTempleName() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const userEmail = session.user.email

        const { data, error } = await supabase
          .from("temple_registrations")
          .select("temple_name")
          .eq("email", userEmail)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (data && !error && data.temple_name) {
          setTempleName(data.temple_name)
        } else {
          setTempleName("ระบบจัดการวัด Sathu")
        }
      } catch (err) {
        console.error("Error fetching temple name:", err)
        setTempleName("ระบบจัดการวัด Sathu")
      }
    }

    fetchTempleName()
  }, [])
  
  const isSettingsActive = pathname === "/admin/settings" || pathname.startsWith("/admin/settings/")

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      await supabase.auth.signOut()
      router.push("/admin/login")
    }
  }

  return (
    <>
      {/* Background Overlay เมื่อพับจอเว็บแล้วเปิด Sidebar */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar เติมกลิ่นอายสีม่วงพรีเมียม รองรับทั้ง Light / Dark Mode */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-68 shrink-0 flex-col px-4 py-6 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 shadow-2xl backdrop-blur-xl",
        "bg-white/95 border-r border-purple-100 text-slate-800 dark:bg-slate-900/95 dark:border-purple-900/40 dark:text-slate-100",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* แสงเรืองแสงสีม่วงตกแต่งมุมบนซ้าย */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* ส่วนหัว Logo & ชื่อวัด */}
        <div className="flex items-center justify-between px-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-700 to-[#241A72] border border-purple-500/30 shadow-md shadow-purple-900/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image src="/sathu-logo.png" alt="โลโก้วัด" width={28} height={28} className="size-7 object-contain drop-shadow" />
            </div>
            <div>
              <p className="font-display text-sm font-black tracking-tight text-slate-900 dark:text-white">
                สาธุ แอดมิน
              </p>
              {/* แสดงชื่อวัดที่ดึงมาจากฐานข้อมูลจริง */}
              <p className="text-[11px] text-purple-600 dark:text-purple-300 truncate max-w-[130px] font-semibold" title={templeName}>
                {templeName}
              </p>
            </div>
          </div>
          {/* ปุ่มกากบาทปิด Sidebar บนจอพับ */}
          {onClose && (
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-purple-50 dark:text-slate-400 dark:hover:bg-purple-950/50 dark:hover:text-white cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* เมนูนำทางหลัก */}
        <nav className="mt-8 flex flex-1 flex-col gap-1.5 relative z-10">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all duration-200 group relative",
                  active
                    ? "bg-gradient-to-r from-purple-700 to-[#241A72] text-white shadow-lg shadow-purple-900/30 scale-[1.02] border border-purple-500/40"
                    : "text-slate-600 hover:bg-purple-50/80 hover:text-purple-700 dark:text-slate-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-200 hover:translate-x-1"
                )}
              >
                <Icon className={cn("size-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-purple-200" : "text-purple-600 dark:text-purple-400")} strokeWidth={2.2} />
                <span>{item.label}</span>
                {active && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* เมนูด้านล่าง (ตั้งค่า & ออกจากระบบ) */}
        <div className="mt-4 flex flex-col gap-1.5 border-t border-purple-100 dark:border-purple-900/40 pt-4 relative z-10">
          <Link
            href="/admin/settings"
            onClick={() => {
              if (onClose) onClose();
            }}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all duration-200",
              isSettingsActive
                ? "bg-gradient-to-r from-purple-700 to-[#241A72] text-white shadow-lg shadow-purple-900/30 border border-purple-500/40"
                : "text-slate-600 hover:bg-purple-50/80 hover:text-purple-700 dark:text-slate-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-200 hover:translate-x-1"
            )}
          >
            <Settings className={cn("size-5 shrink-0", isSettingsActive ? "text-purple-200" : "text-purple-600 dark:text-purple-400")} strokeWidth={2.2} />
            ตั้งค่าระบบ
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300 w-full text-left cursor-pointer group"
          >
            <LogOut className="size-5 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={2.2} />
            ออกจากระบบ
          </button>
        </div>
      </aside>
    </>
  )
}