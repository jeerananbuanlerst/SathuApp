"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Calendar as CalendarIcon, ArrowLeft, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

interface Activity {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
  status: string;
  completeness: number;
}

export default function ActivitiesPage() {
  const router = useRouter();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalDateString(today));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [monthEventDates, setMonthEventDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchMonthEvents();
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchActivities();
  }, [selectedDate]);

  const fetchMonthEvents = async () => {
    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${lastDay}`;

    const { data } = await supabase
      .from("admin_activities")
      .select("date")
      .eq("status", "published")
      .gte("date", startDate)
      .lte("date", endDate);

    if (data) {
      const dates = data.map((item) => item.date);
      setMonthEventDates(dates);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("admin_activities")
      .select("*")
      .eq("date", selectedDate)
      .eq("status", "published");

    if (data) setActivities(data);
    setLoading(false);
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm("คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?")) {
      await supabase.from("admin_activities").delete().eq("id", id);
      setActivities(activities.filter((a) => a.id !== id));
      fetchMonthEvents();
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const monthDays = getDaysInMonth(currentYear, currentMonth);
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              กิจกรรมทั้งหมด
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">จัดการ ตรวจสอบ และเลือกดูตารางกิจกรรมวัด</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/activities/drafts")}
            className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition"
          >
            ดูแบบร่างทั้งหมด
          </button>
          <button
            onClick={() => router.push("/admin/activities/new")}
            className="inline-flex items-center gap-2 rounded-xl bg-pink-400 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition"
          >
            <Plus size={16} /> สร้างกิจกรรม
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ปฏิทิน */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <CalendarIcon size={18} className="text-primary" /> {thaiMonths[currentMonth]} {currentYear + 543}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                    else { setCurrentMonth(currentMonth - 1); }
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted text-foreground"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => {
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                    else { setCurrentMonth(currentMonth + 1); }
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted text-foreground"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
                <span key={i} className="text-[11px] font-bold text-muted-foreground py-1">{d}</span>
              ))}
              {monthDays.map((dateObj) => {
                const dateStr = getLocalDateString(dateObj);
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === getLocalDateString(today);
                const hasEvent = monthEventDates.includes(dateStr);

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`py-2 rounded-xl text-xs font-semibold transition relative flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-[#241A72] text-white shadow-md"
                        : hasEvent
                        ? "bg-pink-100 text-pink-700 font-bold border border-pink-300" // 👈 เปลี่ยนเป็นไฮไลต์สีชมพูอ่อนแทนจุดแดง ไม่ทับตัวเลข
                        : isToday
                        ? "border border-primary text-primary"
                        : "bg-muted/30 text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{dateObj.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* รายการกิจกรรม */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-card rounded-2xl border border-border/60 p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-foreground">
              รายการกิจกรรมวันที่: <span className="text-primary font-bold">{selectedDate}</span>
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/60 text-muted-foreground text-xs">
              กำลังโหลดข้อมูล...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/60 text-muted-foreground text-xs space-y-2">
              <p>ไม่มีกิจกรรมในวันที่เลือก</p>
              <button
                onClick={() => router.push("/admin/activities/new")}
                className="text-primary font-semibold hover:underline text-xs"
              >
                + เพิ่มกิจกรรมใหม่ในวันนี้
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm flex flex-col md:flex-row gap-5 items-start justify-between">
                  <div className="flex items-start gap-4 w-full">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image src={act.image || "/placeholder.svg"} alt={act.title} fill className="object-cover object-center" />
                    </div>
                    
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-foreground leading-snug break-words">{act.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#241A72] text-white text-[10px] font-semibold shrink-0">
                          เผยแพร่แล้ว
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">📍 สถานที่: {act.location}</p>
                      <p className="text-xs text-muted-foreground">📅 วันที่: {act.date} | ⏰ เวลา: {act.time}</p>
                      <p className="text-xs text-foreground line-clamp-2">{act.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border/40 justify-end shrink-0">
                    <button
                      onClick={() => setSelectedActivity(act)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition whitespace-nowrap"
                    >
                      <Eye size={14} /> ดูรายละเอียด
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition whitespace-nowrap"
                    >
                      <Trash2 size={14} /> ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal: แสดงรายละเอียดกิจกรรม */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground">รายละเอียดกิจกรรม</h3>
              <button onClick={() => setSelectedActivity(null)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedActivity.image && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
                  <Image src={selectedActivity.image} alt={selectedActivity.title} fill className="object-cover object-center" />
                </div>
              )}
              <h4 className="font-bold text-lg text-foreground">{selectedActivity.title}</h4>
              <p className="text-xs text-muted-foreground">📍 สถานที่: {selectedActivity.location}</p>
              <p className="text-xs text-muted-foreground">📅 วันที่: {selectedActivity.date} | ⏰ เวลา: {selectedActivity.time}</p>
              <div className="bg-muted/30 p-4 rounded-xl text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedActivity.description}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}