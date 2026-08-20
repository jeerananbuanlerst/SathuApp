"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, RefreshCw, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client"; 

type Step = "email" | "otp" | "password" | "success";

const OTP_LENGTH = 6;
const OTP_DURATION = 113; // 01:53 in seconds

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  
  // OTP States
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [step, secondsLeft]);

  const timeLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;

  function focusInput(index: number) {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }

  function handleOtpChange(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      const chars = clean.split("");
      let cursor = index;
      for (const ch of chars) {
        if (cursor >= OTP_LENGTH) break;
        next[cursor] = ch;
        cursor += 1;
      }
      const nextFocus = Math.min(cursor, OTP_LENGTH - 1);
      requestAnimationFrame(() => focusInput(nextFocus));
      return next;
    });
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    focusInput(Math.min(text.length, OTP_LENGTH - 1));
  }

  // =========================================================
  // STEP 1 : ส่งลิงก์/รหัสรีเซ็ตพาสเวิร์ดไปยัง Email
  // =========================================================
  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      alert("กรุณากรอกอีเมล");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/forgot-password`,
      });

      if (error) {
        console.error("Send reset email error:", error);
        alert(error.message || "ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้");
        return;
      }

      alert("ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว");
      setSecondsLeft(OTP_DURATION);
      setStep("otp");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // STEP 2 : ตรวจสอบรหัส OTP 6 หลักสำหรับกู้คืนรหัสผ่าน
  // =========================================================
  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete) {
      alert("กรุณากรอกรหัส OTP 6 หลักให้ครบถ้วน");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: "recovery", // ใช้ type "recovery" สำหรับการกู้คืนรหัสผ่าน
      });

      if (error) {
        console.error("Verify OTP error:", error);
        alert("รหัส OTP ไม่ถูกต้องหรือหมดอายุ");
        return;
      }

      if (!data.session) {
        alert("ไม่สามารถยืนยัน OTP ได้ กรุณาลองใหม่");
        return;
      }

      alert("ยืนยัน OTP สำเร็จ");
      setStep("password");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถตรวจสอบ OTP ได้");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/forgot-password`,
      });

      if (error) {
        alert(error.message || "ไม่สามารถส่งรหัสใหม่ได้");
        return;
      }

      setDigits(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(OTP_DURATION);
      focusInput(0);
      alert("ส่งรหัสใหม่ไปยังอีเมลแล้ว");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถส่งรหัสใหม่ได้");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // STEP 3 : ตั้งรหัสผ่านใหม่
  // =========================================================
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert(error.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
        return;
      }

      setStep("success");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-[#241A72] p-3 md:p-6">
      <div className="flex h-[620px] w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-2xl">
        
        {/* Left: Form Panel */}
        <section className="relative flex w-full flex-col px-6 py-6 md:w-[48%] md:px-10 md:py-8 justify-between overflow-y-auto">
          
          {/* Close / Back Button */}
          <button
            type="button"
            aria-label="ปิด"
            onClick={() => router.push("/admin/login")}
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="mx-auto flex w-full max-w-[340px] flex-1 flex-col justify-center my-auto pt-6">
            
            {/* ================= STEP 1: EMAIL ================= */}
            {step === "email" && (
              <>
                <div className="mb-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail size={24} />
                  </div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    ลืมรหัสผ่าน?
                  </h1>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    กรอกอีเมลที่ใช้เข้าสู่ระบบ เราจะส่งรหัส OTP สำหรับยืนยันตัวตนให้คุณ
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-foreground">
                      อีเมล
                    </label>
                    <div className="flex items-center gap-2.5 rounded-lg border border-input bg-background px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <Mail size={16} className="text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="h-11 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.62_0.22_5)] text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "กำลังส่ง OTP..." : "ส่ง OTP"}
                  </button>
                </form>
              </>
            )}

            {/* ================= STEP 2: OTP ================= */}
            {step === "otp" && (
              <>
                <div className="mb-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    ยืนยันรหัส OTP
                  </h1>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    เราได้ส่งรหัส OTP 6 หลักไปยังอีเมลของคุณ
                    <br />
                    <span className="font-medium text-primary">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP}>
                  <div className="flex items-center justify-between gap-1.5 md:gap-2">
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={OTP_LENGTH}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        onFocus={(e) => e.target.select()}
                        aria-label={`หลักที่ ${i + 1}`}
                        className="h-12 w-10 md:w-11 rounded-lg border border-input bg-background text-center text-base font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    ))}
                  </div>

                  {/* Timer & Resend */}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      หมดอายุใน <span className="font-semibold text-[oklch(0.6_0.2_10)]">{timeLabel}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={secondsLeft > 0 || loading}
                      className="inline-flex items-center gap-1 font-medium text-primary transition hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                    >
                      ส่งรหัสใหม่ <RefreshCw size={12} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!isComplete || loading}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.62_0.22_5)] text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <ArrowLeft size={14} /> เปลี่ยนอีเมล
                  </button>
                </form>
              </>
            )}

            {/* ================= STEP 3: NEW PASSWORD ================= */}
            {step === "password" && (
              <>
                <div className="mb-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lock size={24} />
                  </div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    ตั้งรหัสผ่านใหม่
                  </h1>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    กำหนดรหัสผ่านใหม่ที่มีความปลอดภัย (อย่างน้อย 8 ตัวอักษร)
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">รหัสผ่านใหม่</label>
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <Lock size={16} className="text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-10 flex-1 bg-transparent text-xs text-foreground outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">ยืนยันรหัสผ่านใหม่</label>
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <Lock size={16} className="text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-10 flex-1 bg-transparent text-xs text-foreground outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {confirmPassword && newPassword === confirmPassword && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 size={14} /> รหัสผ่านตรงกัน
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !newPassword || newPassword !== confirmPassword}
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.62_0.22_5)] text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "กำลังเปลี่ยนรหัส..." : "เปลี่ยนรหัสผ่าน"}
                  </button>
                </form>
              </>
            )}

            {/* ================= STEP 4: SUCCESS ================= */}
            {step === "success" && (
              <div className="text-center py-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  เปลี่ยนรหัสผ่านสำเร็จ!
                </h1>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว สามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้ทันที
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/admin/login")}
                  className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary to-[oklch(0.62_0.22_5)] text-xs font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
                >
                  กลับสู่หน้าเข้าสู่ระบบ
                </button>
              </div>
            )}

          </div>

          <div className="text-center text-[11px] text-muted-foreground mt-4">
            ระบบบริหารการจัดการสาธุแอดมิน
          </div>
        </section>

        {/* Right: Buddha Background Panel */}
        <section className="relative hidden overflow-hidden bg-accent md:block md:w-[52%]">
          <img
            src="/buddha-bg.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90 mix-blend-multiply"
          />
          {/* Meditation logo watermark */}
          <div className="relative z-10 p-6">
            <svg
              width="34"
              height="34"
              viewBox="0 0 48 48"
              fill="none"
              className="text-primary"
              aria-label="Sathu"
            >
              <circle cx="24" cy="9" r="4.5" fill="currentColor" />
              <path
                d="M24 16c-7 0-13 4-15 10 5-3 9-4 15-4s10 1 15 4c-2-6-8-10-15-10z"
                fill="currentColor"
              />
              <path
                d="M9 27c4 3 9 5 15 5s11-2 15-5c-3 5-8 8-15 8s-12-3-15-8z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </div>
        </section>

      </div>
    </main>
  );
}