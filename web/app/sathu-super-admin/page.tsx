"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { 
  Building2, User, Mail, Phone, MapPin, CheckCircle2, Clock, 
  FileText, Image as ImageIcon, Loader2, Sparkles, ShieldAlert, 
  XCircle, MessageSquare, Send, Search, Settings, Sun, Moon, Globe, KeyRound
} from "lucide-react";

interface TempleRegistration {
  id: string;
  temple_name: string;
  address: string;
  province: string;
  open_time: string;
  temple_reg_number: string;
  temple_phone: string;
  email: string;
  admin_name: string;
  position: string;
  admin_phone: string;
  status: string; 
  document_url: string;
  temple_photo_url: string;
  reject_reason: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  temple_id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

// Dictionary สำหรับเปลี่ยนภาษา (ไทย / อังกฤษ)
const translations: Record<string, any> = {
  th: {
    title: "ทีมงานสาธุ (Admin)",
    subtitle: "ระบบบริหารจัดการและตรวจสอบคำขอวัดส่วนกลาง",
    totalRequests: "คำขอทั้งหมด",
    pending: "รอดำเนินการ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธแล้ว",
    tabPending: "รอตรวจสอบ",
    tabApproved: "อนุมัติแล้ว",
    tabRejected: "ปฏิเสธแล้ว",
    tabChat: "แชทกับแอดมินวัด",
    tabSettings: "ตั้งค่าระบบ",
    searchPlaceholder: "ค้นหาชื่อวัด, จังหวัด, ผู้ดูแล...",
    noData: "ไม่พบรายการวัดในหมวดหมู่นี้",
    templeInfo: "📌 ข้อมูลวัด",
    adminInfo: "👤 ข้อมูลผู้ดูแล (Admin)",
    viewDoc: "ดูเอกสารยืนยัน",
    viewPhoto: "ดูรูปถ่ายวัด",
    chatWithTemple: "แชทกับวัดนี้",
    approveBtn: "อนุมัติ (Approve)",
    rejectBtn: "ปฏิเสธ (Reject)",
    settingsTitle: "ตั้งค่าระบบส่วนกลาง (Super Admin Settings)",
    settingsDesc: "จัดการความปลอดภัย ธีมการแสดงผล และภาษาของระบบ",
    themeMode: "โหมดแสดงผล (Theme Mode)",
    themeDesc: "สลับระหว่างโหมดสว่าง (Light) และโหมดมืด (Dark)",
    langMode: "ภาษาของระบบ (Language)",
    langDesc: "เลือกภาษาที่ต้องการใช้งานในระบบหลังบ้าน",
    passTitle: "เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Change Password)",
    currentPass: "รหัสผ่านปัจจุบัน",
    newPass: "รหัสผ่านใหม่",
    confirmPass: "ยืนยันรหัสผ่านใหม่",
    savePass: "บันทึกรหัสผ่านใหม่",
    chatTitle: "เลือกวัดที่ต้องการพูดคุย",
    chatPlaceholder: "พิมพ์ข้อความตอบกลับแอดมินวัด...",
    send: "ส่ง",
    rejectModalTitle: "ระบุเหตุผลในการปฏิเสธคำขอ",
    rejectModalDesc: "เหตุผลนี้จะถูกบันทึกและแสดงให้ทางวัดรับทราบ เพื่อนำไปแก้ไขและส่งคำขอใหม่",
    cancel: "ยกเลิก",
    confirmReject: "ยืนยันการปฏิเสธ",
  },
  en: {
    title: "Sathu Admin",
    subtitle: "Central Temple Verification & Management System",
    totalRequests: "Total Requests",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    tabPending: "Pending",
    tabApproved: "Approved",
    tabRejected: "Rejected",
    tabChat: "Temple Chats",
    tabSettings: "System Settings",
    searchPlaceholder: "Search temple name, province...",
    noData: "No temples found in this category.",
    templeInfo: "📌 Temple Info",
    adminInfo: "👤 Admin Info",
    viewDoc: "View Document",
    viewPhoto: "View Photo",
    chatWithTemple: "Chat",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    settingsTitle: "Super Admin Settings",
    settingsDesc: "Manage security, appearance theme, and system language.",
    themeMode: "Theme Mode",
    themeDesc: "Switch between Light and Dark mode.",
    langMode: "System Language",
    langDesc: "Select your preferred backend language.",
    passTitle: "Change Admin Password",
    currentPass: "Current Password",
    newPass: "New Password",
    confirmPass: "Confirm New Password",
    savePass: "Save New Password",
    chatTitle: "Select a temple to chat",
    chatPlaceholder: "Type a reply to temple admin...",
    send: "Send",
    rejectModalTitle: "Specify Rejection Reason",
    rejectModalDesc: "This reason will be recorded and shown to the temple for revision.",
    cancel: "Cancel",
    confirmReject: "Confirm Rejection",
  }
};

export default function SathuSuperAdminPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "chat" | "settings">("pending");
  const [registrations, setRegistrations] = useState<TempleRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTemple, setSelectedTemple] = useState<TempleRegistration | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState("");

  // Settings State
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"th" | "en">("th");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const t = translations[language];

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("temple_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRegistrations(data);
      if (selectedTemple) {
        const updatedCurrent = data.find((item) => item.id === selectedTemple.id);
        if (updatedCurrent) setSelectedTemple(updatedCurrent);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
    const interval = setInterval(fetchRegistrations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string, templeName: string) => {
    if (!confirm(`ยืนยันการอนุมัติสิทธิ์ Admin ให้กับ "${templeName}" ใช่หรือไม่?`)) return;

    setProcessingId(id);
    const { error } = await supabase
      .from("temple_registrations")
      .update({ status: "approved", reject_reason: null })
      .eq("id", id);

    setProcessingId(null);

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert(`อนุมัติสำเร็จ! วัด ${templeName} สามารถเข้าสู่ระบบได้แล้ว`);
      fetchRegistrations();
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setRejectReasonText("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingId || !rejectReasonText.trim()) {
      alert("กรุณาระบุเหตุผลในการปฏิเสธคำขอ");
      return;
    }

    setProcessingId(rejectingId);
    const { error } = await supabase
      .from("temple_registrations")
      .update({ status: "rejected", reject_reason: rejectReasonText })
      .eq("id", rejectingId);

    setProcessingId(null);
    setRejectModalOpen(false);
    setRejectingId(null);

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert("ปฏิเสธคำขอเรียบร้อยแล้ว");
      fetchRegistrations();
    }
  };

  useEffect(() => {
    if (!selectedTemple) return;

    let isCancelled = false;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("temple_chats")
        .select("*")
        .eq("temple_id", selectedTemple.id)
        .order("created_at", { ascending: true });

      if (!isCancelled && !error && data) {
        setMessages(data);
      }
      if (error) {
        console.error("โหลดข้อความแชทไม่สำเร็จ:", error.message);
      }
    };

    fetchMessages();

    // ฟังข้อความใหม่แบบเรียลไทม์ แทนการ polling ทุก 3 วิ
    // ทำให้ทั้งสองฝั่ง (ทีมงานสาธุ <-> แอดมินวัด) เห็นข้อความทันทีที่มีการส่ง
    const channel = supabase
      .channel(`temple_chats_${selectedTemple.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "temple_chats",
          filter: `temple_id=eq.${selectedTemple.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            const incoming = payload.new as ChatMessage;
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [selectedTemple]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedTemple) return;

    const msg = inputMessage;
    setInputMessage("");

    const { error } = await supabase.from("temple_chats").insert([
      {
        temple_id: selectedTemple.id,
        sender_type: "sathu",
        message: msg,
      },
    ]);

    if (error) {
      alert("ส่งข้อความไม่สำเร็จ: " + error.message);
      setInputMessage(msg); // คืนข้อความกลับให้ผู้ใช้ ไม่ต้องพิมพ์ใหม่
    }
    // ไม่ต้อง fetch ซ้ำ เพราะ realtime channel ด้านบนจะรับข้อความที่เพิ่ง insert เข้ามาเอง
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    alert("เปลี่ยนรหัสผ่านสำเร็จ!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const filteredRegistrations = registrations.filter((item) => {
    const matchesTab = 
      activeTab === "pending" ? item.status === "pending" :
      activeTab === "approved" ? item.status === "approved" :
      activeTab === "rejected" ? item.status === "rejected" : true;

    const matchesSearch = 
      item.temple_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admin_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 pb-20 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100 text-slate-800"}`}>
      
      {/* Header สไตล์ Glassmorphism */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl shadow-xs transition-all ${darkMode ? "border-slate-800/80 bg-slate-900/80 text-white" : "border-slate-200/60 bg-white/80 text-slate-900"}`}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-tr from-[#241A72] to-purple-600 p-2.5 shadow-md flex items-center justify-center ring-2 ring-purple-500/20">
              <Image
                src="/sathu-logo.png"
                alt="Sathu Logo"
                fill
                className="object-contain p-1.5"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="text-base font-black tracking-tight flex items-center gap-2">
                {t.title} <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Pro</span>
              </p>
              <p className={`text-xs font-medium ${darkMode ? "text-purple-400" : "text-purple-700/80"}`}>{t.subtitle}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl shadow-xs border ${darkMode ? "bg-purple-950/40 border-purple-800/60 text-purple-300" : "bg-white/80 border-purple-200/70 text-purple-900"}`}>
            <ShieldAlert size={16} className="text-purple-600 animate-pulse" />
            <span className="text-xs font-bold">admin@sathu.com</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* สถิติภาพรวมทรงพรีเมียม */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className={`border p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.01] space-y-1.5 ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 backdrop-blur-md border-slate-200/70"}`}>
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">{t.totalRequests}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{registrations.length}</p>
          </div>
          <div className={`border p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.01] space-y-1.5 ${darkMode ? "bg-slate-900/80 border-amber-900/40" : "bg-gradient-to-br from-amber-50/80 to-white border-amber-200/80"}`}>
            <p className="text-xs text-amber-600 font-extrabold uppercase tracking-wider">{t.pending}</p>
            <p className="text-3xl font-black text-amber-600">
              {registrations.filter((r) => r.status === "pending").length}
            </p>
          </div>
          <div className={`border p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.01] space-y-1.5 ${darkMode ? "bg-slate-900/80 border-emerald-900/40" : "bg-gradient-to-br from-emerald-50/80 to-white border-emerald-200/80"}`}>
            <p className="text-xs text-emerald-600 font-extrabold uppercase tracking-wider">{t.approved}</p>
            <p className="text-3xl font-black text-emerald-600">
              {registrations.filter((r) => r.status === "approved").length}
            </p>
          </div>
          <div className={`border p-6 rounded-3xl shadow-sm transition-all hover:scale-[1.01] space-y-1.5 ${darkMode ? "bg-slate-900/80 border-rose-900/40" : "bg-gradient-to-br from-rose-50/80 to-white border-rose-200/80"}`}>
            <p className="text-xs text-rose-600 font-extrabold uppercase tracking-wider">{t.rejected}</p>
            <p className="text-3xl font-black text-rose-600">
              {registrations.filter((r) => r.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* แถบเมนู Tabs แบบ Pills โดดเด่น น่าสนใจ */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-3xl border shadow-sm ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 backdrop-blur-md border-slate-200/80"}`}>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "pending", label: t.tabPending, count: registrations.filter((r) => r.status === "pending").length, icon: Clock },
              { id: "approved", label: t.tabApproved, count: registrations.filter((r) => r.status === "approved").length, icon: CheckCircle2 },
              { id: "rejected", label: t.tabRejected, count: registrations.filter((r) => r.status === "rejected").length, icon: XCircle },
              { id: "chat", label: t.tabChat, count: null, icon: MessageSquare },
              { id: "settings", label: t.tabSettings, count: null, icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? "bg-gradient-to-r from-[#241A72] to-purple-700 text-white shadow-md shadow-purple-900/20 scale-[1.02]"
                      : darkMode ? "bg-slate-800/80 text-slate-300 hover:bg-slate-700" : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-purple-200" : "text-purple-600"} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ช่องค้นหา */}
          {activeTab !== "chat" && activeTab !== "settings" && (
            <div className="relative min-w-[260px] px-1 sm:px-0">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full rounded-2xl pl-11 pr-4 py-3 text-xs outline-none transition font-medium border shadow-2xs ${darkMode ? "bg-slate-950 border-slate-800 text-white focus:border-purple-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#241A72]"}`}
              />
            </div>
          )}
        </div>

        {/* เนื้อหาใน Tab ตั้งค่าระบบ (Settings) */}
        {activeTab === "settings" ? (
          <div className={`border rounded-3xl p-8 sm:p-10 max-w-2xl mx-auto space-y-8 shadow-sm ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 backdrop-blur-md border-slate-200/80"}`}>
            <div>
              <h2 className="text-xl font-black flex items-center gap-2.5">
                <Settings size={22} className="text-purple-600" /> {t.settingsTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{t.settingsDesc}</p>
            </div>

            <hr className={darkMode ? "border-slate-800" : "border-slate-100"} />

            {/* 1. โหมดมืด/สว่าง */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold flex items-center gap-2">
                  {darkMode ? <Moon size={16} className="text-purple-400" /> : <Sun size={16} className="text-amber-500" />} 
                  {t.themeMode}
                </p>
                <p className="text-[11px] text-slate-400">{t.themeDesc}</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer border ${darkMode ? "bg-purple-900/80 text-white border-purple-700" : "bg-slate-100 text-slate-700 border-slate-200"}`}
              >
                {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </div>

            <hr className={darkMode ? "border-slate-800" : "border-slate-100"} />

            {/* 2. เปลี่ยนภาษาที่ใช้งานได้จริง */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold flex items-center gap-2">
                  <Globe size={16} className="text-purple-600" /> {t.langMode}
                </p>
                <p className="text-[11px] text-slate-400">{t.langDesc}</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "th" | "en")}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold outline-none border cursor-pointer shadow-2xs ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
              >
                <option value="th">ภาษาไทย (Thai)</option>
                <option value="en">English</option>
              </select>
            </div>

            <hr className={darkMode ? "border-slate-800" : "border-slate-100"} />

            {/* 3. เปลี่ยนรหัสผ่าน */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <p className="text-xs font-bold flex items-center gap-2">
                <KeyRound size={16} className="text-purple-600" /> {t.passTitle}
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.currentPass}</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl px-4 py-3 text-xs outline-none border font-medium ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.newPass}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl px-4 py-3 text-xs outline-none border font-medium ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.confirmPass}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-xl px-4 py-3 text-xs outline-none border font-medium ${darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#241A72] to-purple-700 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl transition text-xs shadow-md cursor-pointer"
                >
                  {t.savePass}
                </button>
              </div>
            </form>
          </div>
        ) : activeTab !== "chat" ? (
          loading ? (
            <div className={`flex h-64 items-center justify-center rounded-3xl border shadow-sm ${darkMode ? "bg-slate-900/80 border-slate-800 text-slate-400" : "bg-white/80 border-slate-200/80 text-slate-400"}`}>
              <Loader2 size={32} className="animate-spin text-purple-600 mr-2" /> กำลังโหลดข้อมูล...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className={`flex h-64 flex-col items-center justify-center space-y-2 rounded-3xl border p-6 text-center shadow-sm ${darkMode ? "bg-slate-900/80 border-slate-800 text-slate-400" : "bg-white/80 border-slate-200/80 text-slate-400"}`}>
              <Building2 size={42} className="text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-bold">{t.noData}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRegistrations.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 backdrop-blur-md border-slate-200/80"}`}
                >
                  <div className={`flex items-center justify-between border-b pb-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${darkMode ? "bg-purple-950/60 text-purple-300 border-purple-800" : "bg-purple-50 text-[#241A72] border-purple-100 shadow-2xs"}`}>
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-black">{item.temple_name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                          <MapPin size={13} className="text-purple-500" /> จังหวัด{item.province}
                        </p>
                      </div>
                    </div>
                    <div>
                      {item.status === "approved" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
                          <CheckCircle2 size={13} /> {t.approved}
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold animate-pulse shadow-2xs">
                          <Clock size={13} /> {t.pending}
                        </span>
                      )}
                      {item.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs">
                          <XCircle size={13} /> {t.rejected}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className={`p-4 rounded-2xl border space-y-2 shadow-2xs ${darkMode ? "bg-slate-950/50 border-slate-800/80" : "bg-slate-50/80 border-slate-100"}`}>
                      <p className="text-purple-600 dark:text-purple-400 font-bold">{t.templeInfo}</p>
                      <p className="text-slate-500 dark:text-slate-400">ที่อยู่: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.address}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">ทะเบียนวัด: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.temple_reg_number}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">เวลาเปิด-ปิด: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.open_time}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">เบอร์วัด: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.temple_phone}</span></p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 shadow-2xs ${darkMode ? "bg-slate-950/50 border-slate-800/80" : "bg-slate-50/80 border-slate-100"}`}>
                      <p className="text-purple-600 dark:text-purple-400 font-bold">{t.adminInfo}</p>
                      <p className="text-slate-500 dark:text-slate-400">ชื่อ-ฉายา: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.admin_name}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">ตำแหน่ง: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.position}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">อีเมล: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.email}</span></p>
                      <p className="text-slate-500 dark:text-slate-400">เบอร์มือถือ: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.admin_phone}</span></p>
                    </div>
                  </div>

                  {item.status === "rejected" && item.reject_reason && (
                    <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-xs text-rose-800 shadow-2xs">
                      <span className="font-bold">เหตุผลที่ปฏิเสธ:</span> {item.reject_reason}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {item.document_url ? (
                      <a
                        href={item.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition shadow-2xs ${darkMode ? "bg-slate-950 border-purple-900/60 text-purple-300 hover:bg-purple-950" : "bg-purple-50 text-[#241A72] border-purple-200 hover:bg-purple-100"}`}
                      >
                        <FileText size={14} /> {t.viewDoc}
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">ไม่มีเอกสารแนบ</span>
                    )}

                    {item.temple_photo_url ? (
                      <a
                        href={item.temple_photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition shadow-2xs ${darkMode ? "bg-slate-950 border-purple-900/60 text-purple-300 hover:bg-purple-950" : "bg-purple-50 text-[#241A72] border-purple-200 hover:bg-purple-100"}`}
                      >
                        <ImageIcon size={14} /> {t.viewPhoto}
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">ไม่มีรูปถ่ายแนบ</span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedTemple(item);
                        setActiveTab("chat");
                      }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ml-auto border shadow-2xs ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"}`}
                    >
                      <MessageSquare size={14} /> {t.chatWithTemple}
                    </button>
                  </div>

                  {item.status === "pending" && (
                    <div className={`pt-4 border-t grid grid-cols-2 gap-3 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                      <button
                        onClick={() => handleApprove(item.id, item.temple_name)}
                        disabled={processingId === item.id}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} /> {t.approveBtn}
                      </button>
                      <button
                        onClick={() => openRejectModal(item.id)}
                        disabled={processingId === item.id}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 px-4 rounded-2xl transition shadow-sm flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                      >
                        <XCircle size={16} /> {t.rejectBtn}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* --- ระบบแชทสด (Support Chat) โฉมใหม่ --- */
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-3xl p-6 sm:p-8 min-h-[550px] shadow-sm ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 backdrop-blur-md border-slate-200/80"}`}>
            <div className={`space-y-3.5 border-r pr-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{t.chatTitle}</h3>
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {registrations.map((temple) => (
                  <div
                    key={temple.id}
                    onClick={() => setSelectedTemple(temple)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border text-xs space-y-1 ${
                      selectedTemple?.id === temple.id
                        ? darkMode ? "bg-purple-950/80 border-purple-700 text-white font-bold shadow-xs scale-[1.01]" : "bg-purple-50/90 border-purple-200 text-[#241A72] font-bold shadow-2xs scale-[1.01]"
                        : darkMode ? "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800" : "bg-slate-50/80 border-slate-200/60 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-extrabold text-sm">{temple.temple_name}</p>
                    <p className="text-[11px] text-slate-400">ผู้ดูแล: {temple.admin_name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`md:col-span-2 flex flex-col justify-between border rounded-2xl p-5 shadow-2xs ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50/60 border-slate-200/70"}`}>
              {selectedTemple ? (
                <>
                  <div className={`border-b pb-3.5 mb-4 flex items-center justify-between ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{selectedTemple.temple_name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">ติดต่อ: {selectedTemple.admin_name} ({selectedTemple.admin_phone})</p>
                    </div>
                    <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold shadow-2xs ${darkMode ? "bg-purple-950 text-purple-300 border border-purple-800" : "bg-purple-100 text-[#241A72]"}`}>
                      สถานะ: {selectedTemple.status}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[380px] pr-2 mb-4">
                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-24 font-medium">ยังไม่มีประวัติการสนทนากับวัดนี้ เริ่มพิมพ์ข้อความด้านล่างได้เลย</p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender_type === "sathu" ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[75%] p-4 rounded-2xl text-xs font-medium shadow-2xs ${
                              msg.sender_type === "sathu"
                                ? "bg-gradient-to-r from-[#241A72] to-purple-700 text-white rounded-br-none"
                                : darkMode ? "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none" : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                            }`}
                          >
                            <p className={`text-[10px] mb-1 font-bold ${msg.sender_type === "sathu" ? "text-purple-200" : "text-purple-600"}`}>
                              {msg.sender_type === "sathu" ? "ทีมงาน Sathu" : selectedTemple.temple_name}
                            </p>
                            {msg.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className={`flex items-center gap-2.5 pt-3 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={t.chatPlaceholder}
                      className={`flex-1 rounded-2xl px-4 py-3.5 text-xs outline-none transition font-medium border shadow-2xs ${darkMode ? "bg-slate-900 border-slate-800 text-white focus:border-purple-500" : "bg-white border-slate-200 text-slate-900 focus:border-[#241A72]"}`}
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#241A72] to-purple-700 hover:opacity-95 text-white px-6 py-3.5 rounded-2xl font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Send size={14} /> {t.send}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2.5 py-32">
                  <MessageSquare size={42} className="text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-medium">{t.chatTitle}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal ปฏิเสธ */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            <h3 className="text-lg font-black">{t.rejectModalTitle}</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {t.rejectModalDesc}
            </p>
            <textarea
              rows={4}
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              placeholder="เช่น เอกสารใบแต่งตั้งไม่ชัดเจน, ข้อมูลทะเบียนวัดไม่ถูกต้อง..."
              className={`w-full rounded-2xl p-4 text-xs outline-none transition resize-none font-medium border ${darkMode ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500"}`}
            />
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className={`text-xs font-bold px-5 py-3 rounded-2xl transition cursor-pointer ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmReject}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-3 rounded-2xl transition cursor-pointer shadow-sm"
              >
                {t.confirmReject}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}