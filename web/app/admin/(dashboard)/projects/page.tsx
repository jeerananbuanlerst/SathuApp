"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Plus, CheckCircle2, Clock, Edit, Ban } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"active" | "ended" | "all">("active")
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("admin_projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setProjects(data)
    setLoading(false)
  }

  // เปลี่ยนเป็นอัปเดตสถานะเป็น ended แทนการลบ
  const handleCloseProject = async (id: string) => {
    if (confirm("ต้องการปิดรับโครงการนี้ใช่หรือไม่?")) {
      const { error } = await supabase
        .from("admin_projects")
        .update({ status: "ended" })
        .eq("id", id)

      if (error) {
        alert("เกิดข้อผิดพลาด: " + error.message)
      } else {
        setProjects(projects.map((p) => (p.id === id ? { ...p, status: "ended" } : p)))
      }
    }
  }

  const formatBaht = (amount: number) => {
    return new Intl.NumberFormat("th-TH").format(amount)
  }

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "active") return p.status === "active" || !p.status
    if (activeTab === "ended") return p.status === "ended" || p.status === "closed"
    return true
  })

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            รับบริจาค
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">จัดการโครงการระดมทุนและตรวจสอบสถานะการบริจาค</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/drafts"
            className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition"
          >
            ดูแบบร่างทั้งหมด
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-400 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus size={16} /> สร้างโปรเจคบริจาคใหม่
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-border pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-2 transition-colors relative ${
            activeTab === "active" ? "text-primary border-b-2 border-primary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          กำลังเปิด ({projects.filter((p) => p.status === "active" || !p.status).length})
        </button>
        <button
          onClick={() => setActiveTab("ended")}
          className={`pb-2 transition-colors relative ${
            activeTab === "ended" ? "text-primary border-b-2 border-primary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          ปิดแล้ว ({projects.filter((p) => p.status === "ended" || p.status === "closed").length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 transition-colors relative ${
            activeTab === "all" ? "text-primary border-b-2 border-primary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          ทั้งหมด ({projects.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-16 text-muted-foreground text-xs">กำลังโหลดข้อมูล...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-border/60 text-muted-foreground text-xs">
            ไม่มีโครงการในสถานะนี้
          </div>
        ) : (
          filteredProjects.map((p) => {
            const raised = p.raised || 0
            const goal = p.goal || 1
            const pct = Math.min(Math.round((raised / goal) * 100), 100)
            const isEnded = p.status === "ended" || p.status === "closed"

            return (
              <div key={p.id} className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm flex flex-col justify-between group">
                
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={p.image || "https://images.unsplash.com/photo-1544816155-12df9643f363"}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                      {p.category || "ทั่วไป"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span>สร้างเมื่อ {new Date(p.created_at).toLocaleDateString("th-TH")}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      isEnded ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
                    }`}>
                      {isEnded ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      {isEnded ? "เสร็จสิ้น" : "กำลังดำเนินการ"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.description || "ไม่มีรายละเอียด"}</p>
                    <p className="text-[11px] text-muted-foreground pt-1">เปิดรับถึง: {p.end_date || "ไม่มีกำหนด"}</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-foreground">{formatBaht(raised)} / {formatBaht(goal)} บ.</span>
                      <span className="text-muted-foreground">{pct} % • {p.donors || 0} คน</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <button
                      onClick={() => router.push(`/admin/projects/edit/${p.id}`)}
                      className="px-4 py-1.5 rounded-xl bg-[#241A72]/10 text-[#241A72] text-xs font-semibold hover:bg-[#241A72]/20 transition flex items-center gap-1"
                    >
                      <Edit size={12} /> แก้ไข
                    </button>

                    {!isEnded && (
                      <button
                        onClick={() => handleCloseProject(p.id)}
                        className="px-4 py-1.5 rounded-xl border border-rose-500 text-rose-500 text-xs font-semibold hover:bg-rose-50 transition flex items-center gap-1"
                      >
                        <Ban size={12} /> ปิดรับ
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}