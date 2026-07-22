"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัว");
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error);
        return;
      }

      alert("เปลี่ยนรหัสผ่านสำเร็จ");

      router.replace("/admin/login");
    } catch (error) {
      console.error(error);
      alert("Server Error");
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
      <div className="absolute inset-0 bg-[#1f4d39]/55 backdrop-blur-[2px]" />

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

      <div className="relative z-10 w-full max-w-md rounded-[34px] border border-white/30 bg-white/90 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.25),0_0_40px_rgba(255,255,255,.12)]">

        <div className="mb-10 flex flex-col items-center">

          <Image
            src="/Logo2.png"
            width={120}
            height={120}
            alt="logo"
            className="drop-shadow-2xl"
          />

          <h1 className="mt-4 text-4xl font-extrabold text-[#234432]">
            ตั้งรหัสผ่านใหม่
          </h1>

          <p className="mt-3 text-center text-sm text-slate-500">
            กำหนดรหัสผ่านใหม่สำหรับบัญชีผู้ดูแลระบบ
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              รหัสผ่านใหม่
            </label>

            <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-[#6C9B74] focus-within:ring-2 focus-within:ring-[#BFD8C2]">

              <Lock size={18} className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 flex-1 bg-transparent px-3 outline-none"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-slate-400" />
                ) : (
                  <Eye size={18} className="text-slate-400" />
                )}
              </button>

            </div>

          </div>

          {/* Confirm */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ยืนยันรหัสผ่าน
            </label>

            <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition-all duration-300 focus-within:border-[#6C9B74] focus-within:ring-2 focus-within:ring-[#BFD8C2]">

              <Lock size={18} className="text-slate-400" />

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 flex-1 bg-transparent px-3 outline-none"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff size={18} className="text-slate-400" />
                ) : (
                  <Eye size={18} className="text-slate-400" />
                )}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F8C1BD] to-[#F39E99] text-lg font-bold text-[#214131] shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
          >
            <CheckCircle size={20} />

            {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}

          </button>

        </form>

      </div>

    </main>
  );
}