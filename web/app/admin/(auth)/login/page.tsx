"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  if (!email || !password) {
    alert("กรุณากรอก Email และ Password");
    return;
  }

  setLoading(true);

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
    });

const result = await response.json();

if (!response.ok) {
  alert(result.error);
  return;
}
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  alert(error.message);
  return;
}

alert("เข้าสู่ระบบสำเร็จ");

router.push("/admin/dashboard");
  } catch (error) {
    console.error(error);
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  } finally {
    setLoading(false);
  }
};

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/sidebar-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1f4d39]/55 backdrop-blur-[2px]" />

      {/* Lotus */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0">
        <Image
          src="/บัว.png"
          alt="Lotus"
          width={1920}
          height={500}
          priority
          className="w-full object-cover object-bottom opacity-95"
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-[34px] border border-white/30 bg-white/90 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.25),0_0_40px_rgba(255,255,255,.12)]">

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <Image
            src="/Logo2.png"
            width={120}
            height={120}
            alt="Sathu Admin"
            priority
            className="drop-shadow-2xl"
          />

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#234432]">
            Sathu Admin
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            ระบบจัดการกิจกรรมทางศาสนา
          </p>
        </div>

        {/* Email */}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-[#6C9B74] focus-within:ring-2 focus-within:ring-[#BFD8C2]">
            <Mail size={18} className="text-slate-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="h-14 flex-1 bg-transparent px-3 text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-[#6C9B74] focus-within:ring-2 focus-within:ring-[#BFD8C2]">
            <Lock size={18} className="text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-14 flex-1 bg-transparent px-3 text-slate-700 placeholder:text-slate-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember */}

        <div className="mt-5 flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-slate-500">
            <input type="checkbox" className="rounded" />
            จดจำฉัน
          </label>

          <button
            type="button"
            onClick={() => router.push("/admin/forgot-password")}
            className="text-sm font-medium text-[#2f6546] transition hover:text-[#1d3d2e] hover:underline"
          >
            ลืมรหัสผ่าน?
          </button>

        </div>

        {/* Login Button */}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F8C1BD] to-[#F39E99] text-lg font-bold text-[#214131] shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity=".25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>

              กำลังเข้าสู่ระบบ...
            </>
          ) : (
            <>
              เข้าสู่ระบบ
              <ArrowRight size={20} />
            </>
          )}
        </button>

      </div>
    </main>
  );
}