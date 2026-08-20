"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, ImagePlus, X } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goal, setGoal] = useState("")
  const [endDate, setEndDate] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) fetchProjectDetails()
  }, [id])

  const fetchProjectDetails = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("admin_projects")
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      setTitle(data.title || "")
      setDescription(data.description || "")
      setGoal(String(data.goal || ""))
      setEndDate(data.end_date || "")
      setImagePreview(data.image || "")
    } else {
      alert("ไม่พบข้อมูลโครงการ")
      router.push("/admin/projects")
    }
    setLoading(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `proj_${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("activity-images")
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("activity-images").getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let finalImageUrl = imagePreview
      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile)
      }

      const { error } = await supabase
        .from("admin_projects")
        .update({
          title,
          description,
          goal: Number(goal),
          end_date: endDate || null,
          image: finalImageUrl,
        })
        .eq("id", id)

      if (error) throw error

      alert("บันทึกการแก้ไขสำเร็จ!")
      router.push("/admin/projects")
    } catch (err: any) {
      alert("อัปเดตไม่สำเร็จ: " + err.message)
    } finally {
      setSaving(false)
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
        
        <div className="space-y-3">
          <label className="block text-xs font-bold text-foreground">📸 รูปภาพโครงการ</label>
          <div className="relative aspect-video w-full max-w-md rounded-2xl overflow-hidden border border-border bg-muted">
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="Project Preview" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs font-semibold hover:bg-black transition z-10"
                >
                  เปลี่ยนรูปภาพ
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center size-full text-muted-foreground hover:bg-muted/80 transition"
              >
                <ImagePlus size={28} className="mb-1 text-primary" />
                <span className="text-xs font-semibold">คลิกเพื่ออัปโหลดรูปภาพ</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

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