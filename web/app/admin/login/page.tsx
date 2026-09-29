"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
      // 1. ตรวจสอบว่าเป็นทีมงานสาธุ (Super Admin) หรือไม่
      if (email === "admin@sathu.com" && password === "1234") {
        localStorage.setItem("sathu_admin_logged_in", "true");
        alert("เข้าสู่ระบบทีมงานสาธุสำเร็จ");
        router.push("/sathu-super-admin");
        return;
      }

      // 2. ล็อกอินปกติสำหรับแอดมินวัดผ่าน Supabase
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert(error.message);
        return;
      }

      // 3. ตรวจสอบสถานะการอนุมัติของวัดก่อนให้เข้า Dashboard
      const { data: templeData } = await supabase
        .from("temple_registrations")
        .select("status")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (templeData && templeData.status !== "approved") {
        alert("คำขอลงทะเบียนวัดของคุณยังไม่ได้รับการอนุมัติ กรุณาตรวจสอบสถานะ");
        router.push("/admin/register/status");
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
    <main className="min-h-screen w-full bg-[#241A72] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* รูปพระพุทธรูปองค์ใหญ่สวยๆ มุมขวาบน */}
      <img
        src="/buddha-bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[85%] w-auto max-w-none object-contain object-right-top select-none mix-blend-multiply opacity-55"
      />

      {/* กล่องฟอร์มล็อกอินดีไซน์พรีเมียม */}
      <div className="relative z-10 w-full max-w-md bg-[#2A1E6E]/95 backdrop-blur-md rounded-3xl border border-white/15 p-8 shadow-2xl space-y-6">
        
        {/* ส่วนหัวการ์ด */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">Admin</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10">
            <img src="/sathu-logo.png" alt="Sathu logo" className="h-6 w-6 object-contain" />
          </div>
        </div>

        {/* ข้อความต้อนรับ */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-snug text-white">
            Hello<br />
            Welcome to<br />
            <span className="text-white">Sa</span><span className="text-[#ff75a0]">thu</span><br />
            for adm<span className="text-[#ff75a0]">in</span>
          </h1>
        </div>

        {/* ฟอร์มกรอกข้อมูล (แก้ปัญหาพื้นหลังขาวและ Autofill) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-[#1c1448] px-4 py-1 transition-all focus-within:border-[#ff75a0] focus-within:ring-2 focus-within:ring-[#ff75a0]/30">
            <Mail size={18} className="text-white/60 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="h-12 w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none autofill:bg-[#1c1448] autofill:text-white [-webkit-autofill]:[-webkit-text-fill-color:white] [-webkit-autofill]:[box-shadow:0_0_0_50px_#1c1448_inset]"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-[#1c1448] px-4 py-1 transition-all focus-within:border-[#ff75a0] focus-within:ring-2 focus-within:ring-[#ff75a0]/30">
            <Lock size={18} className="text-white/60 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none autofill:bg-[#1c1448] autofill:text-white [-webkit-autofill]:[-webkit-text-fill-color:white] [-webkit-autofill]:[box-shadow:0_0_0_50px_#1c1448_inset]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/60 transition hover:text-white shrink-0 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-white/75 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="rounded accent-[#ff75a0] size-4" />
              จดจำฉัน
            </label>
            <button
              type="button"
              onClick={() => router.push("/admin/forgot-password")}
              className="font-medium text-[#ff75a0] transition hover:underline cursor-pointer"
            >
              ลืมรหัสผ่าน?
            </button>
          </div>
        </div>

        {/* ปุ่มดำเนินการหลัก */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#241A72] shadow-lg transition hover:bg-white/90 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Log in"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/register")}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#ff75a0] text-sm font-bold text-white shadow-lg transition hover:bg-[#f06392] active:scale-[0.99] cursor-pointer"
          >
            Register
          </button>
        </div>

        {/* ข้อตกลงการใช้งาน */}
        <p className="text-center text-[11px] leading-relaxed text-white/50 pt-2">
          By tapping Log in, you agree to our Teams and acknowledge that our{" "}
          <span className="text-[#ff75a0] font-medium">Privacy Policy</span>
        </p>

      </div>
    </main>
  );
}

