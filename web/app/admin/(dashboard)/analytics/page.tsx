"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Users } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<"7d" | "1m" | "3m" | "1y">("7d")

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-6 space-y-6">
      
      {/* ส่วนหัว */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
      </div>

      {/* แท็บเลือกช่วงเวลา */}
      <div className="flex items-center gap-2">
        {[
          { id: "7d", label: "7 วัน" },
          { id: "1m", label: "1 เดือน" },
          { id: "3m", label: "3 เดือน" },
          { id: "1y", label: "1 ปี" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setPeriod(item.id as any)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${
              period === item.id
                ? "bg-[#241A72] text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* การ์ดสรุปยอดบริจาค & กราฟ */}
      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> ยอดบริจาค
            </h3>
            <p className="text-xs text-muted-foreground">เปรียบเทียบกับช่วงก่อนหน้า</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-1">
            <span className="text-xl font-extrabold text-foreground">85,652</span>
            <p className="text-[11px] text-muted-foreground">ยอดรวม (บ.)</p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              ▲ +12%
            </span>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-1">
            <span className="text-xl font-extrabold text-foreground">5,256</span>
            <p className="text-[11px] text-muted-foreground">ผู้บริจาค</p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              ▲ +17%
            </span>
          </div>
        </div>

        {/* กราฟจำลองตามดีไซน์ */}
        <div className="pt-4 border-t border-border/40 space-y-2">
          <div className="flex justify-between text-[11px] text-muted-foreground pb-2">
            <span>สูง</span>
            <span>กลาง</span>
            <span>ต่ำ</span>
          </div>
          <div className="h-32 w-full flex items-end justify-between px-4 bg-muted/20 rounded-xl relative">
            <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-border/60" />
            <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-border/60" />
            {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 z-10 pb-2">
                <div className="w-2.5 bg-primary rounded-full" style={{ height: `${(idx + 2) * 12}px` }} />
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ยอดบริจาคตามโปรเจค 30 วันล่าสุด */}
      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">ยอดบริจาคตามโปรเจค</h3>
          <span className="text-xs text-muted-foreground">30 วันล่าสุด</span>
        </div>

        <div className="space-y-4 pt-2">
          {[
            { title: "บริจาคอาหารให้กับสุนัขจรจัด 24 ตัว", amount: "65,000 บ.", w: "85%" },
            { title: "ดูดวง & เสียมซี", amount: "1,750 บ.", w: "25%" },
            { title: "ร่วมเป็นเจ้าภาพจัดงานลอยกระทง", amount: "35,000 บ.", w: "60%" },
            { title: "ทำบุญวันลอยกระทง", amount: "10,000 บ.", w: "95%" },
          ].map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">{item.title}</span>
                <span className="text-primary">{item.amount}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-pink-400 rounded-full" style={{ width: item.w }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* สัดส่วนประเภทผู้บริจาค & กิจกรรมที่ได้รับความสนใจสูงสุด */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground">สัดส่วนประเภทผู้บริจาค</h3>
          <div className="flex items-center justify-around py-4">
            <div className="relative size-28 rounded-full border-8 border-primary flex items-center justify-center font-bold text-sm">
              55%
              <div className="absolute inset-0 rounded-full border-8 border-pink-400 clip-path-half" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded bg-primary" />
                <span className="text-muted-foreground">ผู้บริจาครายประจำ (55%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded bg-pink-400" />
                <span className="text-muted-foreground">ผู้บริจาครายใหม่ (45%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground">กิจกรรมที่ได้รับความสนใจสูงสุด</h3>
          <div className="space-y-3 pt-2">
            {[
              { name: "ตักบาตร", count: "111 คน", w: "90%" },
              { name: "ฟังธรรม", count: "56 คน", w: "50%" },
              { name: "ประเพณี", count: "16 คน", w: "20%" },
            ].map((act, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{act.name}</span>
                  <span className="text-muted-foreground">{act.count}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-pink-400 rounded-full" style={{ width: act.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}