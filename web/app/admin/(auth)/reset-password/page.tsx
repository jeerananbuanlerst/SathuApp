"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Lock, Eye, EyeOff, Check, Circle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // เงื่อนไขความปลอดภัยของรหัสผ่านตาม UI
  const hasMinLength = newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasLowerCase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasMinLength) {
      alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        alert(error.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้")
        return
      }

      router.push("/admin/success")
    } catch (error) {
      console.error(error)
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้")
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
          onClick={() => router.push("/admin/otp")}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        <div className="space-y-6 pt-2">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="text-xs font-semibold text-slate-600">Reset Password</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 ml-1">New Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-pink-400 focus-within:bg-white transition">
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="รหัสผ่านใหม่"
                  className="h-11 flex-1 bg-transparent text-xs text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 ml-1">Confirm New Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-pink-400 focus-within:bg-white transition">
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  className="h-11 flex-1 bg-transparent text-xs text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* กล่องเช็คเงื่อนไขรหัสผ่านตามเรฟดีไซน์ */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
              <p className="text-[11px] font-bold text-slate-700">รหัสผ่านที่ดีต้องมี</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  {hasMinLength ? <Check size={13} /> : <Circle size={10} />} อย่างน้อย 8 ตัวอักษร
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  {hasNumber ? <Check size={13} /> : <Circle size={10} />} ตัวเลข (0-9)
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpperCase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  {hasUpperCase ? <Check size={13} /> : <Circle size={10} />} ตัวพิมพ์ใหญ่ (A-Z)
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  {hasSpecialChar ? <Check size={13} /> : <Circle size={10} />} อักขระพิเศษ
                </div>
                <div className={`flex items-center gap-1.5 col-span-2 ${hasLowerCase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  {hasLowerCase ? <Check size={13} /> : <Circle size={10} />} ตัวพิมพ์เล็ก (a-z)
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !hasMinLength || newPassword !== confirmPassword}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-pink-400 text-sm font-bold text-white shadow-md hover:bg-pink-500 active:scale-[0.99] transition cursor-pointer disabled:opacity-70 mt-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}