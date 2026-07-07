"use client";

import { Megaphone } from "lucide-react";

export default function Banner() {
  return (
    <div className="rounded-3xl border border-line bg-white p-6">

      <div className="flex items-center gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft">
          <Megaphone
            size={28}
            className="text-gold-dark"
          />
        </div>

        <div className="flex-1">

          <h2 className="font-serif-th text-2xl font-bold">
            ร่วมแนะนำกิจกรรมดี ๆ
          </h2>

          <p className="mt-2 text-sm text-ink/60">
            ช่วยกันบอกต่อกิจกรรมทางศาสนาให้เพื่อน ๆ
            ได้ร่วมทำบุญและเข้าร่วมกิจกรรม
          </p>

        </div>

        <div className="hidden md:block">
          🛕
        </div>

      </div>

    </div>
  );
}