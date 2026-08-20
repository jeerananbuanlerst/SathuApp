"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const OTP_LENGTH = 6;
const OTP_DURATION = 113; // 01:53 in seconds

export default function OtpVerificationPage() {
  const router = useRouter();
  const email = "example@gmail.com";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const timeLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
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

  function handleChange(index: number, value: string) {
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

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
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

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    focusInput(Math.min(text.length, OTP_LENGTH - 1));
  }

  function handleResend() {
    setDigits(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(OTP_DURATION);
    focusInput(0);
    // TODO: เรียก API ส่ง OTP ใหม่ที่นี่
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete) return;
    setLoading(true);
    // Simulated verify
    setTimeout(() => {
      setLoading(false);
      alert("ยืนยัน OTP สำเร็จ");
    }, 1200);
  }

  return (
    <main className="fixed inset-0 z-50 flex w-full overflow-y-auto bg-[#241A72] text-white">
      <section className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#2A1E6E] p-6 md:p-10">
        {/* Background */}
        <img
          src="/buddha-bg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-[70%] w-auto max-w-none select-none object-contain object-right-top opacity-40 mix-blend-multiply"
        />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()} // หรือ router.push("/admin/login")
            className="flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            ย้อนกลับ
          </button>

          <img
            src="/sathu-logo.png"
            alt="Sathu"
            className="h-10 w-10 object-contain"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={26} className="text-[#F48FB1]" />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              ยืนยัน
              <span className="text-[#F48FB1]"> OTP</span>
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/70">
              เราได้ส่งรหัส OTP 6 หลักไปยังอีเมล
              <br />
              <span className="font-semibold text-white">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="mb-3 block text-sm font-medium text-white/80">
              รหัส OTP 6 หลัก
            </label>

            {/* 6-Digit OTP Inputs */}
            <div className="flex items-center justify-between gap-2 sm:gap-3">
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
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  aria-label={`หลักที่ ${i + 1}`}
                  className="h-14 w-12 sm:h-16 sm:w-14 rounded-xl border border-white/15 bg-white/10 text-center text-2xl font-bold text-white outline-none transition focus:border-[#F48FB1] focus:ring-2 focus:ring-[#F48FB1]/40"
                />
              ))}
            </div>

            {/* Timer / Resend */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-white/60">
                หมดอายุใน <span className="font-medium text-white">{timeLabel}</span>
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || loading}
                className="font-medium text-[#F48FB1] transition hover:underline disabled:cursor-not-allowed disabled:text-white/40 disabled:no-underline"
              >
                ส่งรหัสใหม่
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isComplete || loading}
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#241A72] shadow-lg transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
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
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  ยืนยัน OTP
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}