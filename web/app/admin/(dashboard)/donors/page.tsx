"use client"

import { useMemo, useState } from "react"
import { Search, Users, HandCoins, Download, BadgeCheck } from "lucide-react"
import { Card, SectionHeading, Chip } from "@/components/admin/ui"
import { donors, formatBaht } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const methodStyle: Record<string, string> = {
  พร้อมเพย์: "bg-primary/10 text-primary",
  โอนธนาคาร: "bg-chart-3/15 text-chart-3",
  บัตรเครดิต: "bg-accent/15 text-accent",
  เงินสด: "bg-chart-5/15 text-chart-5",
}

export default function DonorsPage() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return donors
    return donors.filter(
      (d) => d.name.toLowerCase().includes(q) || d.project.toLowerCase().includes(q),
    )
  }, [query])

  const totalAmount = filtered.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground">1,121 คน</p>
            <p className="text-sm text-muted-foreground">ผู้บริจาคทั้งหมด</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-chart-4/15 text-chart-4">
            <HandCoins className="size-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground">{formatBaht(211050)}</p>
            <p className="text-sm text-muted-foreground">ยอดบริจาครวมทั้งหมด</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <BadgeCheck className="size-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground">{formatBaht(Math.round(211050 / 1121))}</p>
            <p className="text-sm text-muted-foreground">ยอดเฉลี่ยต่อคน</p>
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <SectionHeading
          title="รายชื่อผู้บริจาค"
          description={`แสดง ${filtered.length} รายการ · รวม ${formatBaht(totalAmount)}`}
          action={
            <button className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <Download className="size-4" /> ส่งออก CSV
            </button>
          }
        />

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อผู้บริจาค หรือชื่อโครงการ..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Table (desktop) */}
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">ผู้บริจาค</th>
                <th className="px-4 py-3">โครงการ</th>
                <th className="px-4 py-3">ช่องทาง</th>
                <th className="px-4 py-3">วันที่</th>
                <th className="px-4 py-3 text-right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                        {d.anonymous ? "?" : d.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.project}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", methodStyle[d.method])}>
                      {d.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3 text-right font-semibold text-chart-4">+{formatBaht(d.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">ไม่พบผู้บริจาคที่ตรงกับการค้นหา</p>
          )}
        </div>

        {/* Cards (mobile) */}
        <div className="flex flex-col gap-3 md:hidden">
          {filtered.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {d.anonymous ? "?" : d.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{d.name}</p>
                <p className="truncate text-xs text-muted-foreground">{d.project}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Chip className={methodStyle[d.method]}>{d.method}</Chip>
                  <span className="text-[11px] text-muted-foreground">{d.date}</span>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold text-chart-4">+{formatBaht(d.amount)}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">ไม่พบผู้บริจาคที่ตรงกับการค้นหา</p>
          )}
        </div>
      </Card>
    </div>
  )
}
