"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Mail, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      alert("กรุณากรอกอีเมล")
      return
    }

    setLoading(true)
    try {
      console.log("กำลังส่งคำขอไปยัง Supabase สำหรับอีเมล:", email.trim())

      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      console.log("Response จาก Supabase:", { data, error })

      if (error) {
        console.error("Supabase Error Object:", error)
        // ดึงข้อความ error ออกมาให้ครอบคลุมทุกกรณี ป้องกันการแสดงผลว่างเปล่า {}
        const errorMsg = error.message || JSON.stringify(error, null, 2) || "Unknown Supabase error"
        alert("Supabase Error: " + errorMsg)
        setLoading(false)
        return
      }

      localStorage.setItem("reset_email", email.trim())
      alert("ส่งรหัส OTP สำเร็จ! กรุณาตรวจสอบกล่องข้อความอีเมลของคุณ")
      router.push("/admin/otp")
    } catch (err: any) {
      console.error("Catch Error:", err)
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + (err?.message || JSON.stringify(err) || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#241A72] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <img
        src="/buddha-bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[85%] w-auto max-w-none object-contain object-right-top select-none mix-blend-multiply opacity-55"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl relative text-slate-800">
        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-6 pt-2">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="text-xs text-slate-500">
              Enter your Email address
            </p>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 focus-within:border-pink-400 focus-within:bg-white transition">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="h-12 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              No worries, we'll send you <strong className="text-slate-600 font-semibold">reset instructions</strong>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-pink-400 text-sm font-bold text-white shadow-md hover:bg-pink-500 active:scale-[0.99] transition cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </span>
              ) : (
                "Next"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}