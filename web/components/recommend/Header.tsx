"use client";

import { ChevronLeft, HelpCircle } from "lucide-react";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function Header({
  title = "แนะนำกิจกรรม",
  subtitle = "",
}: HeaderProps) {
  return (
    <header className="mb-8">

        <div className="flex items-center gap-4">

      </div>

      <h1 className="text-3xl font-bold mt-6">
        {title}
      </h1>

      {subtitle !== "" && (
        <p className="text-slate-500 mt-2">
          {subtitle}
        </p>
      )}

    </header>
  );
}