"use client";

import { ChevronLeft, HelpCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">

        <button className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gold-soft">
          <ChevronLeft
            size={24}
            className="text-gold-dark"
          />
        </button>

        <h1 className="font-serif-th text-4xl font-bold text-ink">
          แนะนำกิจกรรม
        </h1>

        <button className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gold-soft">
          <HelpCircle
            size={24}
            className="text-gold-dark"
          />
        </button>

      </div>
    </header>
  );
}