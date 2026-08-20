"use client"

import type React from "react"

import Link from "next/link"
import { useState, useRef } from "react"
import { ArrowLeft, ImagePlus, X, Check } from "lucide-react"
import { Card, SectionHeading } from "@/components/admin/ui"
import { cn } from "@/lib/utils"

const categories = ["ไถ่ชีวิตสัตว์", "บูรณะศาสนสถาน", "สาธารณสงเคราะห์", "การศึกษา", "อื่นๆ"]
const quickAmounts = [10000, 50000, 100000, 250000]

export default function NewProjectPage() {
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState(categories[0])
  const [goal, setGoal] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const urls = Array.from(files).map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...urls])
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> กลับไปหน้าโครงการ
      </Link>

      <SectionHeading title="สร้างโครงการบริจาค" description="กรอกรายละเอียดโครงการ อัปโหลดรูปภาพ และตั้งเป้าหมายยอดบริจาค" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-5">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
              ชื่อโครงการ
            </label>
            <input id="title" required className={inputClass} placeholder="เช่น ไถ่ชีวิตโค-กระบือ ครั้งที่ 25" />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground">ประเภทกิจกรรม</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="desc" className="mb-1.5 block text-sm font-medium text-foreground">
              รายละเอียดโครงการ
            </label>
            <textarea
              id="desc"
              required
              rows={5}
              className={cn(inputClass, "resize-none leading-relaxed")}
              placeholder="อธิบายวัตถุประสงค์ ที่มา และแผนการใช้เงินของโครงการนี้..."
            />
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground">รูปภาพประกอบ</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((src, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src || "/placeholder.svg"} alt={`รูปโครงการ ${i + 1}`} className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-foreground/70 text-background"
                  aria-label="ลบรูป"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ImagePlus className="size-6" />
              <span className="text-xs font-medium">เพิ่มรูปภาพ</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        </Card>

        <Card className="flex flex-col gap-5">
          <div>
            <label htmlFor="goal" className="mb-1.5 block text-sm font-medium text-foreground">
              เป้าหมายยอดบริจาค (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">฿</span>
              <input
                id="goal"
                required
                inputMode="numeric"
                value={goal}
                onChange={(e) => setGoal(e.target.value.replace(/[^0-9]/g, ""))}
                className={cn(inputClass, "pl-8 font-display text-lg font-semibold")}
                placeholder="0"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {quickAmounts.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setGoal(String(a))}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/70"
                >
                  {a.toLocaleString("th-TH")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start" className="mb-1.5 block text-sm font-medium text-foreground">
                วันที่เริ่มต้น
              </label>
              <input id="start" type="date" className={inputClass} />
            </div>
            <div>
              <label htmlFor="end" className="mb-1.5 block text-sm font-medium text-foreground">
                วันที่สิ้นสุด
              </label>
              <input id="end" type="date" className={inputClass} />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/projects"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            บันทึกเป็นฉบับร่าง
          </Link>
          <button
            type="submit"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors",
              submitted ? "bg-chart-4" : "bg-primary hover:bg-primary/90",
            )}
          >
            {submitted ? (
              <>
                <Check className="size-4" /> เผยแพร่แล้ว
              </>
            ) : (
              "เผยแพร่โครงการ"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
