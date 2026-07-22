"use client";
import { Loader2 } from "lucide-react";

export default function SubmitButton({ loading, label = "ส่งข้อมูล" }: { loading?: boolean; label?: string }) {
  return (
    <button
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 disabled:opacity-70"
    >
      {loading ? <><Loader2 className="animate-spin" /> กำลังดำเนินการ...</> : label}
    </button>
  );
}