// components/GoogleTranslate.tsx
"use client";

import React, { useState, useEffect } from "react";

// ประกาศ Type เพื่อป้องกัน TypeScript ฟ้อง Error
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState("th");

  useEffect(() => {
    // โหลด Script Google Translate แบบซ่อนตัว UI ดั้งเดิมทั้งหมด
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'th',
              includedLanguages: 'en,th',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };
    }

    // ตรวจสอบภาษาปัจจุบันจาก Cookie
    const match = document.cookie.match(/(^|;\s*)googtrans=\/th\/([a-z-]+)/);
    if (match && match[2]) {
      setCurrentLang(match[2]);
    }
  }, []);

  // ฟังก์ชันสั่งเปลี่ยนภาษาผ่าน Cookie โดยตรง (ไร้แถบกวนใจ)
  const changeLanguage = (lang: string) => {
    if (lang === "th") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + document.domain;
    } else {
      document.cookie = `googtrans=/th/${lang}; path=/;`;
    }
    setCurrentLang(lang);
    window.location.reload(); // รีเฟรชหน้าเว็บเพื่อให้ระบบแปลภาษาทำงานแบบไร้รอยต่อ
  };

  return (
    <>
      {/* ซ่อน Widget ดั้งเดิมของ Google ทิ้งไปเลย */}
      <div id="google_translate_element" className="hidden" />

      {/* ปุ่มกดสลับภาษาดีไซน์สวยงาม */}
      <div className="flex items-center bg-secondary/80 border border-border/60 rounded-xl p-1 shadow-xs">
        <button
          onClick={() => changeLanguage("th")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentLang === "th"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>TH</span>
        </button>

        <button
          onClick={() => changeLanguage("en")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentLang === "en"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <span>EN</span>
        </button>
      </div>
    </>
  );
}