"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { X, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

const OTP_LENGTH = 6
const OTP_DURATION = 113

export default function OtpVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION)
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const savedEmail = localStorage.getItem("reset_email")
    if (savedEmail) setEmail(savedEmail)
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

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
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()
    if (!isComplete) {
      alert("กรุณากรอกรหัส OTP ให้ครบถ้วนทั้ง 6 หลัก")
      return
    }

    if (!email) {
      alert("ไม่พบข้อมูลอีเมล กรุณากลับไปเริ่มขั้นตอนลืมรหัสผ่านใหม่อีกครั้ง")
      router.push("/admin/forgot-password")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp.trim(),
        type: "recovery",
      })

      if (error) {
        alert("การยืนยันล้มเหลว: รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว")
        return
      }

      if (!data.session) {
        alert("ไม่พบเซสชันการใช้งาน กรุณาขอรหัสใหม่อีกครั้ง")
        return
      }

      alert("ยืนยันรหัส OTP สำเร็จ!")
      router.push("/admin/reset-password") 
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ กรุณาลองใหม่อีกครั้ง")
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
          onClick={() => router.push("/admin/forgot-password")}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-6 pt-2">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="text-xs font-semibold text-slate-700">Verify Code</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Please enter the 6-digit code sent to your email<br />
              <span className="text-sky-500 font-medium">{email || "example@gmail.com"}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex items-center justify-center gap-2">
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
                  onFocus={(e) => e.target.select()}
                  className="h-12 w-10 sm:w-11 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-800 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-400/20 shadow-inner"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span>หมดอายุใน <strong className="text-pink-500">{timeLabel}</strong></span>
              <button
                type="button"
                onClick={() => alert("ระบบได้ส่งรหัส OTP ใหม่ไปยังอีเมลของคุณแล้ว")}
                className="flex items-center gap-1 text-pink-500 hover:underline cursor-pointer font-medium"
              >
                ส่งรหัสใหม่ <RefreshCw size={12} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!isComplete || loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-pink-400 text-sm font-bold text-white shadow-md hover:bg-pink-500 active:scale-[0.99] transition cursor-pointer disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}