"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

// ไอคอน social เป็น inline SVG ล้วนๆ ไม่ต้องลงไลบรารีเพิ่ม
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"
        fill="#1877F2"
      />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#06C755" />
      <path
        d="M19 11.15c0-3.13-3.14-5.68-7-5.68s-7 2.55-7 5.68c0 2.81 2.49 5.16 5.86 5.61.23.05.54.15.62.35.07.18.05.46.02.64l-.1.6c-.03.18-.14.7.62.38.76-.31 4.09-2.41 5.58-4.13C18.6 13.36 19 12.32 19 11.15Z"
        fill="#fff"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.6a4.8 4.8 0 0 1-2.08 3.15v2.6h3.36c1.97-1.81 3.12-4.48 3.12-7.76Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.36-2.6c-.93.62-2.13 1-3.26 1-2.5 0-4.62-1.69-5.38-3.96H3.16v2.68A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path d="M6.62 14.02a5.99 5.99 0 0 1 0-3.84V7.5H3.16a10 10 0 0 0 0 8.98l3.46-2.46Z" fill="#FBBC05" />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.9 9.9 0 0 0 12 2 10 10 0 0 0 3.16 7.5l3.46 2.68c.76-2.27 2.88-3.96 5.38-3.96Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // ===== Logic การ login เดิม ไม่ได้แก้ =====
  const handleLogin = async () => {
    if (!email || !password) {
      alert("กรุณากรอก Email และ Password")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error)
        return
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        alert(error.message)
        return
      }

      alert("เข้าสู่ระบบสำเร็จ")

      router.push("/admin/dashboard")
    } catch (error) {
      console.error(error)
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้")
    } finally {
      setLoading(false)
    }
  }

  function handleSocialLogin(provider: string) {
    // TODO: ตั้งค่า OAuth provider ใน Supabase ก่อน แล้วเปลี่ยนมาเรียก
    // supabase.auth.signInWithOAuth({ provider: "facebook" | "google" })
    alert(`เข้าสู่ระบบด้วย ${provider} เร็วๆ นี้`)
  }
  // ===== จบ logic เดิม =====

  return (
    // fixed inset-0 = ยึดเต็มจอเสมอ ทะลุออกจาก layout/การ์ดที่ครอบอยู่
    <main className="fixed inset-0 z-50 flex w-full overflow-y-auto bg-[#241A72] text-white">
      {/* ===== ฟอร์มล็อกอิน (เต็มจอ) ===== */}
      <section className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#2A1E6E] p-8 md:p-12">
        {/* ภาพพระพุทธรูปมุมขวาบน — multiply ให้เป็นเงาม่วงเข้มกลืนพื้น (tone-on-tone) */}
        <img
          src="/buddha-bg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[70%] w-auto max-w-none object-contain object-right-top select-none mix-blend-multiply opacity-60"
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-lg font-medium text-white/90">Log in</span>
          <img src="/sathu-logo.png" alt="Sathu logo" className="h-10 w-10 object-contain" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          {/* หัวข้อต้อนรับ */}
          <h1 className="text-4xl font-extrabold leading-tight text-balance">
            Hello
            <br />
            Wellcome to
            <br />
            <span className="text-white">Sa</span>
            <span className="text-[#F48FB1]">thu</span>
            <br />
            for adm<span className="text-[#F48FB1]">in</span>
          </h1>

          {/* ===== ฟอร์ม Email / Password ===== */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 focus-within:border-[#F48FB1] focus-within:ring-2 focus-within:ring-[#F48FB1]/40">
              <Mail size={18} className="text-white/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="h-12 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 focus-within:border-[#F48FB1] focus-within:ring-2 focus-within:ring-[#F48FB1]/40">
              <Lock size={18} className="text-white/60" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 flex-1 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/60 transition hover:text-white"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-white/70">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded accent-[#F48FB1]" />
                จดจำฉัน
              </label>
              <button
                type="button"
                onClick={() => router.push("/admin/forgot-password")}
                className="font-medium text-[#F48FB1] transition hover:underline"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
          </div>

          {/* ปุ่ม Log in (ขาว) */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#241A72] shadow-lg transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                </svg>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              "Log in"
            )}
          </button>

          {/* ปุ่ม Register (ชมพู) */}
          <button
            type="button"
            onClick={() => router.push("/admin/register")}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-[#F48FB1] text-sm font-bold text-white shadow-lg transition hover:bg-[#f07ba3] active:scale-[0.99]"
          >
            Register
          </button>

          {/* social login (placeholder รอ OAuth) */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-[11px] text-white/50">หรือเข้าสู่ระบบด้วย</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition hover:scale-105"
            >
              <FacebookIcon />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Line")}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition hover:scale-105"
            >
              <LineIcon />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition hover:scale-105"
            >
              <GoogleIcon />
            </button>
          </div>

          {/* ข้อความ privacy ตาม mockup */}
          <p className="mt-6 text-center text-[11px] leading-relaxed text-white/50 text-pretty">
            {"By tapping Log in, you agree to our Teams and acknowledge that you have read our "}
            <span className="text-[#F48FB1]">Privacy Policy</span>
          </p>
        </div>
      </section>
    </main>
  )
}
