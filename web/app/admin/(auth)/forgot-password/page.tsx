"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { X, Mail, ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, RefreshCw, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type Step = "email" | "otp" | "password" | "success"

const OTP_LENGTH = 6
const OTP_DURATION = 113

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  
  // OTP States
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  // Password States
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [step, secondsLeft])

  const timeLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0")
    const s = (secondsLeft % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }, [secondsLeft])

  const otp = digits.join("")
  const isComplete = otp.length === OTP_LENGTH

  function focusInput(index: number) {
    const el = inputsRef.current[index]
    if (el) {
      el.focus()
      el.select()
    }
  }

  function handleOtpChange(index: number, value: string) {
    const clean = value.replace(/\D/g, "")
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev]
        next[index] = ""
        return next
      })
      return
    }

    setDigits((prev) => {
      const next = [...prev]
      const chars = clean.split("")
      let cursor = index
      for (const ch of chars) {
        if (cursor >= OTP_LENGTH) break
        next[cursor] = ch
        cursor += 1
      }
      const nextFocus = Math.min(cursor, OTP_LENGTH - 1)
      requestAnimationFrame(() => focusInput(nextFocus))
      return next
    })
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev]
          next[index] = ""
          return next
        })
      } else if (index > 0) {
        focusInput(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (!text) return
    const next = Array(OTP_LENGTH).fill("")
    text.split("").forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    focusInput(Math.min(text.length, OTP_LENGTH - 1))
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      alert("กรุณากรอกอีเมล")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/forgot-password`,
      })

      if (error) {
        alert(error.message || "ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้")
        return
      }

      alert("ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว")
      setSecondsLeft(OTP_DURATION)
      setStep("otp")
    } catch (error) {
      console.error(error)
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()
    if (!isComplete) {
      alert("กรุณากรอกรหัส OTP 6 หลักให้ครบถ้วน")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "recovery",
      })

      if (error) {
        alert("รหัส OTP ไม่ถูกต้องหรือหมดอายุ")
        return
      }

      if (!data.session) {
        alert("ไม่สามารถยืนยัน OTP ได้ กรุณาลองใหม่")
        return
      }

      alert("ยืนยัน OTP สำเร็จ")
      setStep("password")
    } catch (error) {
      console.error(error)
      alert("ไม่สามารถตรวจสอบ OTP ได้")
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOTP() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/forgot-password`,
      })

      if (error) {
        alert(error.message || "ไม่สามารถส่งรหัสใหม่ได้")
        return
      }

      setDigits(Array(OTP_LENGTH).fill(""))
      setSecondsLeft(OTP_DURATION)
      focusInput(0)
      alert("ส่งรหัสใหม่ไปยังอีเมลแล้ว")
    } catch (error) {
      console.error(error)
      alert("ไม่สามารถส่งรหัสใหม่ได้")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
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

      setStep("success")
    } catch (error) {
      console.error(error)
      alert("ไม่สามารถเปลี่ยนรหัสผ่านได้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#241A72] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* รูปพระพุทธรูปขนาดใหญ่ที่มุมขวาบน สไตล์เดียวกับหน้า Login */}
      <img
        src="/buddha-bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[85%] w-auto max-w-none object-contain object-right-top select-none mix-blend-multiply opacity-55"
      />

      <div className="relative z-10 w-full max-w-md bg-[#2A1E6E]/90 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition"
          >
            <ArrowLeft size={16} /> กลับหน้าเข้าสู่ระบบ
          </button>
          <img src="/sathu-logo.png" alt="Sathu logo" className="h-8 w-8 object-contain" />
        </div>

        <div className="space-y-6">
          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <>
              <div>
                <h1 className="text-2xl font-extrabold leading-snug">
                  ลืมรหัสผ่าน?
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  กรอกอีเมลที่ใช้เข้าสู่ระบบ เราจะส่งรหัสยืนยันสำหรับกู้คืนรหัสผ่านให้คุณ
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 focus-within:border-[#F48FB1] focus-within:ring-2 focus-within:ring-[#F48FB1]/40">
                  <Mail size={18} className="text-white/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="h-12 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#241A72] shadow-lg transition hover:bg-white/90 active:scale-[0.99] disabled:opacity-70"
                >
                  {loading ? "กำลังส่ง OTP..." : "ส่งรหัส OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <>
              <div>
                <h1 className="text-2xl font-extrabold leading-snug">
                  ยืนยันรหัส OTP
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  กรอกรหัส 6 หลักที่ส่งไปที่อีเมล <span className="text-[#F48FB1] font-semibold">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsRef.current[i] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      onFocus={(e) => e.target.select()}
                      className="h-12 w-11 rounded-xl border border-white/20 bg-white/10 text-center text-lg font-bold text-white outline-none transition focus:border-[#F48FB1] focus:ring-2 focus:ring-[#F48FB1]/40"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>หมดอายุใน <strong className="text-[#F48FB1]">{timeLabel}</strong></span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={secondsLeft > 0 || loading}
                    className="flex items-center gap-1 text-[#F48FB1] hover:underline disabled:opacity-40"
                  >
                    ส่งรหัสใหม่ <RefreshCw size={12} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!isComplete || loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#241A72] shadow-lg transition hover:bg-white/90 active:scale-[0.99] disabled:opacity-70"
                >
                  {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === "password" && (
            <>
              <div>
                <h1 className="text-2xl font-extrabold leading-snug">
                  ตั้งรหัสผ่านใหม่
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  กำหนดรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 focus-within:border-[#F48FB1] focus-within:ring-2 focus-within:ring-[#F48FB1]/40">
                  <Lock size={18} className="text-white/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="รหัสผ่านใหม่"
                    className="h-12 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 focus-within:border-[#F48FB1] focus-within:ring-2 focus-within:ring-[#F48FB1]/40">
                  <Lock size={18} className="text-white/60" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    className="h-12 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {confirmPassword && newPassword === confirmPassword && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 size={14} /> รหัสผ่านตรงกัน
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#241A72] shadow-lg transition hover:bg-white/90 active:scale-[0.99] disabled:opacity-70"
                >
                  {loading ? "กำลังเปลี่ยนรหัส..." : "เปลี่ยนรหัสผ่าน"}
                </button>
              </form>
            </>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <h1 className="text-2xl font-extrabold">เปลี่ยนรหัสผ่านสำเร็จ!</h1>
              <p className="text-xs text-white/70 leading-relaxed">
                รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว สามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้ทันที
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#F48FB1] text-sm font-bold text-white shadow-lg transition hover:bg-[#f07ba3]"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}