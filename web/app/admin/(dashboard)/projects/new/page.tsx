"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X, DollarSign, ImagePlus } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const categories = [
  "บริจาคอาหารแก่สัตว์", 
  "ประเพณี", 
  "ซ่อมบำรุงวัด", 
  "เสี่ยงดวงชะตา", 
  "ถวายสังฆทาน", 
  "ทุนการศึกษา",
  "อื่นๆ"
]

const quickAmounts = [20, 50, 100, 300, 500, 1000]

export default function NewProjectPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [goal, setGoal] = useState("")
  const [endDate, setEndDate] = useState("")
  const [imagePreview, setImagePreview] = useState("") // เริ่มต้นเป็นค่าว่าง ไม่ใส่รูปมั่วๆ
  const [loading, setLoading] = useState(false)
  
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (status: "active" | "draft") => {
    if (!title || !goal) {
      alert("กรุณากรอกชื่อโปรเจคและเป้าหมายเงินบริจาค")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("admin_projects").insert([
        {
          title,
          category,
          description,
          goal: Number(goal),
          raised: 0,
          donors: 0,
          end_date: endDate || null,
          image: imagePreview || "https://images.unsplash.com/photo-1544816155-12df9643f363",
          status: status,
        },
      ])

      if (error) throw error

      alert(status === "active" ? "เปิดรับบริจาคสำเร็จ!" : "บันทึกแบบร่างสำเร็จ!")
      router.push(status === "active" ? "/admin/projects" : "/admin/projects/drafts")
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-card px-4 py-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-6 space-y-6">
      
      {/* ส่วนหัวตาม UI */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            สร้างโปรเจคบริจาค
          </h1>
        </div>

        <Link
          href="/admin/projects/drafts"
          className="px-4 py-2 rounded-xl bg-[#241A72] text-white text-xs font-semibold shadow-sm hover:opacity-90 transition flex items-center gap-1.5"
        >
          ดูแบบร่าง
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 p-8 shadow-sm space-y-6">
        
        {/* วัตถุประสงค์การบริจาค */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-foreground">🎯 วัตถุประสงค์การบริจาค</label>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold transition",
                  category === c
                    ? "bg-[#241A72] text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* อัปโหลดรูปกิจกรรม (เคลียร์รูปเริ่มต้นออก ให้กดเลือกเอง) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-foreground">📸 อัปโหลดรูปกิจกรรม</label>
          {imagePreview ? (
            <div className="relative aspect-video w-full max-w-md rounded-2xl overflow-hidden border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview("")}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center aspect-video w-full max-w-md rounded-2xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition text-muted-foreground cursor-pointer"
            >
              <ImagePlus size={32} className="mb-2 text-primary" />
              <span className="text-xs font-semibold">คลิกเพื่ออัปโหลดรูปภาพกิจกรรม</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFiles} className="hidden" />
        </div>

        {/* ชื่อโปรเจค */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">ชื่อโปรเจค *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น บริจาคอาหารให้กับสุนัขจรจัด 24 ตัว"
            className={inputClass}
          />
        </div>

        {/* เป้าหมายเงิน & วันปิดรับ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">เป้าหมายเงิน (บาท) *</label>
            <input
              type="text"
              required
              inputMode="numeric"
              value={goal}
              onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="100,000"
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

        {/* รายละเอียดโปรเจค */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">รายละเอียดโปรเจค</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="คำอธิบายโปรเจค..."
            className={cn(inputClass, "resize-none")}
          />
        </div>

        {/* จำนวนเงินแนะนำให้ผู้บริจาคเลือก */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-foreground flex items-center gap-1.5">
            <DollarSign size={16} className="text-primary" /> จำนวนเงินที่แนะนำให้ผู้บริจาคเลือก
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickAmounts.map((amt) => (
              <div key={amt} className="py-3 rounded-xl bg-[#241A72]/10 text-[#241A72] text-xs font-bold text-center border border-[#241A72]/20">
                {amt.toLocaleString()}
              </div>
            ))}
          </div>
        </div>

        {/* ปุ่มกดเปิดรับบริจาค / บันทึกแบบร่าง */}
        <div className="space-y-3 pt-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave("active")}
            className="w-full py-4 rounded-2xl bg-pink-400 text-white font-bold text-sm shadow-md hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "เปิดรับบริจาค"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave("draft")}
            className="w-full py-4 rounded-2xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกแบบร่าง"}
          </button>
        </div>

      </div>
    </div>
  )
}