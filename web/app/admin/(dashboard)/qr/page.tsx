"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, QrCode } from "lucide-react"

export default function QRPage() {
  const router = useRouter()
  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-6 text-center space-y-6">
      <div className="flex justify-start">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border/60 p-12 shadow-sm space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-500">
          <QrCode size={48} />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">ระบบสร้างคิวอาร์โค้ด</h1>
        <p className="text-sm text-muted-foreground">กำลังดำเนินการและพัฒนาอยู่... โปรดติดตามในอัปเดตถัดไป</p>
      </div>
    </div>
  )
}