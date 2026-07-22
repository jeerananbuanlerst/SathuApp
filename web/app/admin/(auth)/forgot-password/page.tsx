"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      alert("กรุณากรอกอีเมล");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "เกิดข้อผิดพลาด");
        return;
      }

      alert("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว");

      setEmail("");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

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
      <div className="pointer-events-none absolute bottom-0 left-0 right-0">
        <Image
          src="/บัว.png"
          alt="lotus"
          width={1920}
          height={500}
          priority
          className="w-full object-cover object-bottom"
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-[34px] border border-white/30 bg-white/90 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.25),0_0_40px_rgba(255,255,255,.12)]">

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">

          <Image
            src="/Logo2.png"
            width={120}
            height={120}
            alt="logo"
            priority
            className="drop-shadow-2xl"
          />

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#234432]">
            ลืมรหัสผ่าน
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-slate-500">
            กรอกอีเมลที่ใช้เข้าสู่ระบบ
            <br />
            ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณ
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-[#6C9B74] focus-within:ring-2 focus-within:ring-[#BFD8C2]">

            <Mail
              size={18}
              className="text-slate-400"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="h-14 flex-1 bg-transparent px-3 text-slate-700 placeholder:text-slate-400 outline-none"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F8C1BD] to-[#F39E99] text-lg font-bold text-[#214131] shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >

            <Send size={18} />

            {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}

          </button>

        </form>

        <Link
          href="/admin/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#2f6546] transition hover:text-[#1d3d2e] hover:underline"
        >

          <ArrowLeft size={18} />

          กลับไปเข้าสู่ระบบ

        </Link>

      </div>
    </main>
  );
}