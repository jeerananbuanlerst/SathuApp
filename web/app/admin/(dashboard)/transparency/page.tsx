"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, Plus, Download, CheckCircle2, ImagePlus, X } from "lucide-react"
import { Card, SectionHeading, Progress } from "@/components/admin/ui"
import { supabase } from "@/lib/supabase/client"

export default function TransparencyPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState("")
  const [reportDetail, setReportDetail] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ดึงข้อมูลโครงการบริจาคจริงจาก Supabase (admin_projects)
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("admin_projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setProjects(data)
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const urls = Array.from(files).map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...urls])
  }

  const handlePublishReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject || !reportDetail) {
      alert("กรุณาเลือกโครงการและกรอกรายละเอียดความคืบหน้า")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert("อัปเดตรายงานความโปร่งใสสำเร็จ!")
      setSelectedProject("")
      setReportDetail("")
      setImages([])
    }, 1000)
  }

  const formatBaht = (amount: number) => {
    return new Intl.NumberFormat("th-TH").format(amount) + " บ."
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-6 space-y-6">
      
      {/* ส่วนหัวตาม UX/UI */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          รายงานความโปร่งใส
        </h1>
      </div>

      {/* รายการโปรเจคทั้งหมดที่ดึงมาจาก admin/projects */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-foreground">โปรเจคทั้งหมด</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/60 text-muted-foreground text-xs">
            ยังไม่มีโครงการบริจาคในระบบ
          </div>
        ) : (
          projects.map((p) => {
            const raised = p.raised || 0
            const goal = p.goal || 1
            const pct = Math.min(Math.round((raised / goal) * 100), 100)

            return (
              <div key={p.id} className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-foreground leading-snug">{p.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-semibold">
                    {p.status === "active" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  เป้าหมาย {formatBaht(goal)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{formatBaht(raised)} / {formatBaht(goal)}</span>
                    <span className="text-muted-foreground">{pct} %</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ฟอร์ม: อัปเดตความคืบหน้า */}
      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-foreground">อัปเดตความคืบหน้า</h3>

        <form onSubmit={handlePublishReport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">เลือกโปรเจค</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">เลือกโปรเจคของคุณ...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.title}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">รายละเอียดความคืบหน้า</label>
            <textarea
              rows={4}
              value={reportDetail}
              onChange={(e) => setReportDetail(e.target.value)}
              placeholder="รายงานเรื่อง..."
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* อัปโหลดรูปภาพรายงาน */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Upload" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition text-muted-foreground"
              >
                <Plus size={24} className="mb-1 text-primary" />
                <span className="text-[10px] font-semibold">เพิ่มรูป</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </div>

          {/* ปุ่มดำเนินการ */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-pink-400 text-white font-bold text-sm shadow-md hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? "กำลังอัปเดต..." : "อัปเดตรายงาน"}
            </button>

            <button
              type="button"
              onClick={() => alert("กำลังดาวน์โหลดและส่งออกรายงานเป็น PDF...")}
              className="w-full py-3.5 rounded-2xl bg-card border border-border text-[#241A72] text-xs font-bold shadow-sm hover:bg-muted transition flex items-center justify-center gap-2"
            >
              <Download size={16} /> Export รายงานเป็น PDF ส่งให้ผู้บริจาค
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}