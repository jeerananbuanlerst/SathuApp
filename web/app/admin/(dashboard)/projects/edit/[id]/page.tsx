"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goal, setGoal] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("admin_projects")
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      setTitle(data.title || "")
      setDescription(data.description || "")
      setGoal(String(data.goal || ""))
      setEndDate(data.end_date || "")
    } else {
      alert("ไม่พบข้อมูลโครงการ")
      router.push("/admin/projects")
    }
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from("admin_projects")
      .update({
        title,
        description,
        goal: Number(goal),
        end_date: endDate || null,
      })
      .eq("id", id)

    setSaving(false)
    if (error) {
      alert("อัปเดตไม่สำเร็จ: " + error.message)
    } else {
      alert("บันทึกการแก้ไขสำเร็จ!")
      router.push("/admin/projects")
    }
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

  if (loading) {
    return <div className="text-center py-24 text-muted-foreground text-xs">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/projects")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          แก้ไขโปรเจคบริจาค
        </h1>
      </div>

      <form onSubmit={handleUpdate} className="bg-card rounded-2xl border border-border/60 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">ชื่อโปรเจค *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">เป้าหมายเงิน (บาท) *</label>
            <input
              type="text"
              required
              inputMode="numeric"
              value={goal}
              onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ""))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">วันปิดรับ</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">รายละเอียดโปรเจค</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-pink-400 text-white font-bold text-sm shadow-md hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} /> {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </div>
      </form>
    </div>
  )
}