"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bell, Search, LayoutDashboard, HeartHandshake, Newspaper, Users, ShieldCheck } from "lucide-react"

const titleMap: Record<string, string> = {
  "/admin/dashboard": "แดชบอร์ด",
  "/admin/projects": "โครงการบริจาค",
  "/admin/projects/new": "สร้างโครงการบริจาค",
  "/admin/activities": "โพสต์กิจกรรมวัด",
  "/admin/donors": "รายชื่อผู้บริจาค",
  "/admin/transparency": "รายงานความโปร่งใส",
}

const mobileNav = [
  { href: "/admin/dashboard", label: "หน้าหลัก", icon: LayoutDashboard },
  { href: "/admin/projects", label: "โครงการ", icon: HeartHandshake },
  { href: "/admin/activities", label: "กิจกรรม", icon: Newspaper },
  { href: "/admin/donors", label: "ผู้บริจาค", icon: Users },
  { href: "/admin/transparency", label: "โปร่งใส", icon: ShieldCheck },
]

export function Topbar() {
  const pathname = usePathname()
  const title = titleMap[pathname] ?? "สาธุ แอดมิน"
  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-5 py-4 backdrop-blur lg:px-8">
        <div>
          <p className="text-xs text-muted-foreground">ระบบบริหารการบริจาควัด</p>
          <h1 className="font-display text-lg font-semibold text-foreground lg:text-xl">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="ค้นหา"
          >
            <Search className="size-5" />
          </button>
          <button
            className="relative flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="การแจ้งเตือน"
          >
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-secondary py-1 pl-1 pr-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              พ
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-foreground leading-tight">พระอาจารย์สมชาย</p>
              <p className="text-[11px] text-muted-foreground leading-tight">ผู้ดูแลระบบ</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden">
        {mobileNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
