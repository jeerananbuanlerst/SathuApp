"use client"

import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

export default function PasswordChangedSuccessPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen w-full bg-[#241A72] text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <img
        src="/buddha-bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[85%] w-auto max-w-none object-contain object-right-top select-none mix-blend-multiply opacity-55"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl relative text-slate-800 text-center space-y-6">
        
        {/* ไอคอนวงกลมสีชมพูและเครื่องหมายถูก */}
        <div className="pt-4 flex justify-center">
          <div className="relative flex items-center justify-center size-24 rounded-full bg-pink-400 shadow-lg text-white">
            <Check size={48} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Password Changed!
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            Your password has been reset successfully. Please log in again with your new password.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin/login")}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-pink-400 text-sm font-bold text-white shadow-md hover:bg-pink-500 active:scale-[0.99] transition cursor-pointer"
          >
            Back to Log in
          </button>
        </div>
      </div>
    </main>
  )
}