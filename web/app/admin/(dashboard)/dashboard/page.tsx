"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  DollarSign, 
  Star, 
  Calendar, 
  TrendingUp, 
  HeartHandshake,
  FileText,
  MessageSquare,
  BarChart3,
  PlusCircle,
  QrCode
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Activity {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // ดึงข้อมูลกิจกรรมล่าสุดจาก Supabase
  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    const { data } = await supabase
      .from("admin_activities")
      .select("id, title, location, date, time, status")
      .eq("status", "published")
      .order("date", { ascending: false })
      .limit(2); // ดึงมาแสดง 2 รายการล่าสุด

    if (data) {
      setRecentActivities(data);
    }
  };

  // รายการเมนูทางลัด (Shortcuts) 
  const shortcuts = [
    {
      title: "โครงการบริจาค",
      icon: <HeartHandshake className="text-primary" size={32} />,
      path: "/admin/projects",
      color: "bg-primary/10",
    },
    {
      title: "รายงานการใช้เงิน",
      icon: <FileText className="text-blue-500" size={32} />,
      path: "/admin/transparency", // เชื่อมไปหน้าความโปร่งใสแล้ว
      color: "bg-blue-500/10",
    },
    {
      title: "ตอบรีวิว",
      icon: <Star className="text-amber-500 fill-amber-500" size={32} />,
      path: "/admin/reviews",
      color: "bg-amber-500/10",
    },
    {
      title: "สื่อสารชุมชน (แชท)",
      icon: <MessageSquare className="text-pink-500" size={32} />,
      path: "/admin/chat",
      color: "bg-pink-500/10",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="text-emerald-500" size={32} />,
      path: "/admin/analytics",
      color: "bg-emerald-500/10",
    },
    {
      title: "โพสต์กิจกรรม",
      icon: <PlusCircle className="text-purple-500" size={32} />,
      path: "/admin/activities",
      color: "bg-purple-500/10",
    },
    {
      title: "สร้างคิวอาร์โค้ด",
      icon: <QrCode className="text-indigo-500" size={32} />,
      path: "/admin/qr",
      color: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-8">
      
      {/* ส่วนหัว: Admin Dashboard & ชื่อวัด */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Dashboard
          </h1>
          <h2 className="font-display text-2xl font-bold text-foreground">
            วัดศาลาลอย (นครราชสีมา)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ภาพรวมระบบจัดการกิจกรรมและข้อมูลวัด Sathu
          </p>
        </div>
      </div>

      {/* Grid Layout หลักสำหรับเว็บ (ขยายเต็มจอ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* คอลัมน์ซ้ายและกลาง (กว้าง 2 ส่วน) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* การ์ดต้อนรับ (Welcome Banner) */}
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1.5 z-10">
              <p className="text-xs text-muted-foreground">อรุณสวัสดิ์</p>
              <h3 className="font-display text-2xl font-bold text-foreground">
                สมชาย พิทักษ์
              </h3>
              <p className="text-xs text-muted-foreground pt-1">
                ขอให้วันนี้เป็นวันดีสำหรับคุณและร่วมทำนุบำรุงพระพุทธศาสนาไปด้วยกัน
              </p>
            </div>
            <div className="text-6xl select-none z-10 p-2">
              🪷
            </div>
          </div>

          {/* สถิติภาพรวม */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* ยอดบริจาครวม */}
            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">ยอดบริจาครวม (บาท)</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">เป้าหมาย 100,000 บาท</p>
                </div>
                <span className="text-xs font-bold text-foreground">65 %</span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-pink-400 rounded-full w-[65%]" />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-muted-foreground">65,000 / 100,000 บ.</span>
                <span className="font-display text-3xl font-extrabold text-foreground">
                  65,000.00
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 pt-2 border-t border-border/40">
                <TrendingUp size={16} /> +12% จากเดือนที่แล้ว
              </div>
            </div>

            {/* ผู้บริจาคทั้งหมด */}
            <div 
              onClick={() => router.push("/admin/donors")}
              className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/50 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ผู้บริจาคทั้งหมด</p>
                  <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                    ▲ +8 คนวันนี้
                  </p>
                </div>
              </div>
              <span className="font-display text-2xl font-extrabold text-foreground">
                756 <span className="text-xs font-normal text-muted-foreground">คน</span>
              </span>
            </div>

            {/* สรุปคะแนนรีวิว */}
            <div 
              onClick={() => router.push("/admin/reviews")}
              className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/50 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Star size={24} className="fill-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">คะแนนรีวิวเฉลี่ย</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">จาก 122 รีวิว</p>
                </div>
              </div>
              <span className="font-display text-2xl font-extrabold text-foreground">
                4.9
              </span>
            </div>

          </div>

          {/* ================= SECTION: ทางลัดการจัดการ (Shortcuts) ================= */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">จัดการ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {shortcuts.map((item, index) => (
                <div
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md transition cursor-pointer space-y-3"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} transition group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* โปรเจกต์ระดมทุนยอดนิยม */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">โปรเจกต์ระดมทุน</h3>
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm group cursor-pointer" onClick={() => router.push("/admin/projects")}>
              <div className="relative h-44 w-full">
                <img 
                  src="/buddha-bg.png" 
                  alt="โปรเจกต์" 
                  className="absolute inset-0 h-full w-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-4 left-5 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/80 text-white mb-2 inline-block">
                      กำลังระดมทุน
                    </span>
                    <h4 className="text-base font-bold drop-shadow-sm">
                      บริจาคอาหารให้กับสุนัขจรจัด 24 ตัว
                    </h4>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-md transition group-hover:scale-110">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* คอลัมน์ขวา (กิจกรรมล่าสุดจากโพสต์กิจกรรมวัด, บริจาคล่าสุด) */}
        <div className="space-y-6">
          
          {/* กิจกรรมล่าสุด (ดึงข้อมูลจริงจากหน้าโพสต์กิจกรรมวัด) */}
          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">กิจกรรมล่าสุด</h3>
              <button 
                onClick={() => router.push("/admin/activities")}
                className="text-xs font-medium text-primary hover:underline"
              >
                ดูทั้งหมด &gt;
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">ยังไม่มีกิจกรรมที่เผยแพร่</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {act.location || "วัดศาลาลอย"}</span>
                      <span className="text-emerald-500 font-medium">เผยแพร่แล้ว</span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground">{act.title}</h4>
                    <p className="text-[10px] text-muted-foreground">📅 {act.date} | ⏰ {act.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* บริจาคล่าสุด */}
          <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">บริจาคล่าสุด</h3>
              <button 
                onClick={() => router.push("/admin/donors")}
                className="text-xs font-medium text-primary hover:underline"
              >
                ดูทั้งหมด &gt;
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    ภ
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">ภัทรพล สุดสายเนตร</p>
                    <p className="text-[10px] text-muted-foreground">5 นาทีที่แล้ว</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">+ 100 บ.</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                    ว
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">วิไล สุขสม</p>
                    <p className="text-[10px] text-muted-foreground">1 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">+ 500 บ.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}