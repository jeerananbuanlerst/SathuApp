"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  HeartHandshake,
  Newspaper,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react"

const nav = [
  { href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/projects", label: "โครงการบริจาค", icon: HeartHandshake },
  { href: "/admin/activities", label: "โพสต์กิจกรรมวัด", icon: Newspaper },
  { href: "/admin/donors", label: "รายชื่อผู้บริจาค", icon: Users },
  { href: "/admin/transparency", label: "รายงานความโปร่งใส", icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  
  // เช็คว่าอยู่หน้าตั้งค่าอยู่หรือไม่ เพื่อใส่ Active State
  const isSettingsActive = pathname === "/admin/settings" || pathname.startsWith("/admin/settings/")

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
          <Image src="/Logo2.png" alt="โลโก้วัด" width={28} height={28} className="size-7 object-contain" />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-sidebar-foreground leading-tight">สาธุ แอดมิน</p>
          <p className="text-xs text-muted-foreground">วัดป่าสิริมงคล</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-sidebar-border pt-4">
        {/* เปลี่ยนจาก button เป็น Link ไปที่ /admin/settings */}
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isSettingsActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <Settings className="size-5 shrink-0" strokeWidth={2} />
          ตั้งค่า
        </Link>

        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15">
          <LogOut className="size-5 shrink-0" strokeWidth={2} />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}