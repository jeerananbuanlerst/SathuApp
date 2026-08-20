export type ProjectStatus = "active" | "completed" | "draft"

export type DonationProject = {
  id: string
  title: string
  category: string
  image: string
  description: string
  goal: number
  raised: number
  donors: number
  daysLeft: number
  status: ProjectStatus
  createdAt: string
}

export type Donor = {
  id: string
  name: string
  amount: number
  project: string
  method: "พร้อมเพย์" | "โอนธนาคาร" | "บัตรเครดิต" | "เงินสด"
  date: string
  anonymous: boolean
}

export type ActivityPost = {
  id: string
  title: string
  image: string
  excerpt: string
  date: string
  likes: number
  comments: number
  status: "published" | "draft"
}

export type ProgressUpdate = {
  id: string
  project: string
  title: string
  detail: string
  amountUsed: number
  date: string
  image?: string
}

export type Expense = {
  id: string
  item: string
  category: string
  amount: number
  date: string
  receipt: string
}

export const projects: DonationProject[] = [
  {
    id: "p1",
    title: "ไถ่ชีวิตโค-กระบือ ครั้งที่ 24",
    category: "ไถ่ชีวิตสัตว์",
    image: "/activity-cattle.png",
    description: "ร่วมไถ่ชีวิตโค-กระบือจากโรงฆ่าสัตว์ เพื่อนำไปดูแลที่ศูนย์อนุรักษ์ของวัด",
    goal: 65000,
    raised: 52400,
    donors: 342,
    daysLeft: 12,
    status: "active",
    createdAt: "2026-07-15",
  },
  {
    id: "p2",
    title: "บูรณะพระอุโบสถหลังเก่า",
    category: "บูรณะศาสนสถาน",
    image: "/activity-temple.png",
    description: "ระดมทุนซ่อมแซมหลังคาและโครงสร้างพระอุโบสถที่ทรุดโทรมตามกาลเวลา",
    goal: 250000,
    raised: 118750,
    donors: 521,
    daysLeft: 45,
    status: "active",
    createdAt: "2026-06-20",
  },
  {
    id: "p3",
    title: "โรงทานข้าวสวยเพื่อผู้ยากไร้",
    category: "สาธารณสงเคราะห์",
    image: "/activity-alms.png",
    description: "จัดตั้งโรงทานแจกอาหารให้ผู้ยากไร้และผู้ป่วยติดเตียงในชุมชนรอบวัด",
    goal: 40000,
    raised: 40000,
    donors: 210,
    daysLeft: 0,
    status: "completed",
    createdAt: "2026-05-02",
  },
  {
    id: "p4",
    title: "ทุนการศึกษาสามเณร ปี 2569",
    category: "การศึกษา",
    image: "/activity-alms.png",
    description: "มอบทุนการศึกษาและอุปกรณ์การเรียนให้สามเณรในโรงเรียนพระปริยัติธรรม",
    goal: 80000,
    raised: 12300,
    donors: 48,
    daysLeft: 60,
    status: "draft",
    createdAt: "2026-08-01",
  },
]

export const donors: Donor[] = [
  { id: "d1", name: "สมชาย พิทักษ์", amount: 5000, project: "ไถ่ชีวิตโค-กระบือ ครั้งที่ 24", method: "พร้อมเพย์", date: "2026-08-06 09:12", anonymous: false },
  { id: "d2", name: "ผู้ไม่ประสงค์ออกนาม", amount: 199, project: "บูรณะพระอุโบสถหลังเก่า", method: "โอนธนาคาร", date: "2026-08-06 08:45", anonymous: true },
  { id: "d3", name: "วิภาวดี รุ่งเรือง", amount: 1200, project: "ไถ่ชีวิตโค-กระบือ ครั้งที่ 24", method: "บัตรเครดิต", date: "2026-08-05 21:30", anonymous: false },
  { id: "d4", name: "ธนกร ศรีสุข", amount: 300, project: "โรงทานข้าวสวยเพื่อผู้ยากไร้", method: "พร้อมเพย์", date: "2026-08-05 18:02", anonymous: false },
  { id: "d5", name: "ครอบครัวใจบุญ", amount: 10000, project: "บูรณะพระอุโบสถหลังเก่า", method: "โอนธนาคาร", date: "2026-08-05 14:20", anonymous: false },
  { id: "d6", name: "อารีย์ ทองดี", amount: 500, project: "ไถ่ชีวิตโค-กระบือ ครั้งที่ 24", method: "พร้อมเพย์", date: "2026-08-05 11:15", anonymous: false },
  { id: "d7", name: "ผู้ไม่ประสงค์ออกนาม", amount: 2000, project: "ทุนการศึกษาสามเณร ปี 2569", method: "เงินสด", date: "2026-08-04 16:40", anonymous: true },
  { id: "d8", name: "ณัฐพงษ์ วัฒนา", amount: 750, project: "บูรณะพระอุโบสถหลังเก่า", method: "บัตรเครดิต", date: "2026-08-04 13:05", anonymous: false },
  { id: "d9", name: "สุมาลี แก้วมณี", amount: 1500, project: "โรงทานข้าวสวยเพื่อผู้ยากไร้", method: "พร้อมเพย์", date: "2026-08-04 10:22", anonymous: false },
  { id: "d10", name: "ปรีชา มั่นคง", amount: 250, project: "ไถ่ชีวิตโค-กระบือ ครั้งที่ 24", method: "โอนธนาคาร", date: "2026-08-03 20:11", anonymous: false },
  { id: "d11", name: "กนกวรรณ สายทอง", amount: 3200, project: "บูรณะพระอุโบสถหลังเก่า", method: "โอนธนาคาร", date: "2026-08-03 17:50", anonymous: false },
  { id: "d12", name: "วีรยุทธ เจริญพร", amount: 199, project: "ทุนการศึกษาสามเณร ปี 2569", method: "พร้อมเพย์", date: "2026-08-03 09:33", anonymous: false },
]

export const activities: ActivityPost[] = [
  {
    id: "a1",
    title: "พิธีไถ่ชีวิตโค-กระบือ ครั้งที่ 24 สำเร็จลุล่วง",
    image: "/activity-cattle.png",
    excerpt: "ขออนุโมทนาบุญกับญาติโยมทุกท่านที่ร่วมกันไถ่ชีวิตโค-กระบือจำนวน 8 ตัว นำไปดูแล ณ ศูนย์อนุรักษ์ของวัด",
    date: "2026-08-06",
    likes: 1240,
    comments: 86,
    status: "published",
  },
  {
    id: "a2",
    title: "ความคืบหน้าการบูรณะพระอุโบสถ เดือนสิงหาคม",
    image: "/activity-temple.png",
    excerpt: "งานซ่อมแซมหลังคาคืบหน้าไปกว่า 40% แล้ว ขอเชิญญาติโยมร่วมบุญต่อเนื่องเพื่อให้สำเร็จตามกำหนด",
    date: "2026-08-04",
    likes: 892,
    comments: 54,
    status: "published",
  },
  {
    id: "a3",
    title: "โรงทานข้าวสวยแจกจ่ายผู้ยากไร้ครบ 210 ครอบครัว",
    image: "/activity-alms.png",
    excerpt: "โครงการโรงทานบรรลุเป้าหมาย แจกจ่ายอาหารให้ผู้ยากไร้และผู้ป่วยติดเตียงในชุมชนได้ครบตามแผน",
    date: "2026-08-01",
    likes: 1567,
    comments: 122,
    status: "published",
  },
  {
    id: "a4",
    title: "เตรียมเปิดรับทุนการศึกษาสามเณร ปี 2569",
    image: "/activity-alms.png",
    excerpt: "ร่างประชาสัมพันธ์โครงการทุนการศึกษาสามเณร รอตรวจทานก่อนเผยแพร่",
    date: "2026-08-01",
    likes: 0,
    comments: 0,
    status: "draft",
  },
]

export const progressUpdates: ProgressUpdate[] = [
  {
    id: "u1",
    project: "ไถ่ชีวิตโค-กระบือ ครั้งที่ 24",
    title: "ชำระค่าไถ่ชีวิตโค 8 ตัว",
    detail: "โอนเงินให้โรงฆ่าสัตว์เพื่อไถ่ชีวิตโค 8 ตัว พร้อมค่าขนส่งไปยังศูนย์อนุรักษ์",
    amountUsed: 48000,
    date: "2026-08-06",
    image: "/activity-cattle.png",
  },
  {
    id: "u2",
    project: "บูรณะพระอุโบสถหลังเก่า",
    title: "จ่ายค่าวัสดุมุงหลังคา",
    detail: "จัดซื้อกระเบื้องมุงหลังคาและโครงเหล็กสำหรับงานบูรณะระยะที่ 1",
    amountUsed: 62000,
    date: "2026-08-02",
    image: "/activity-temple.png",
  },
  {
    id: "u3",
    project: "โรงทานข้าวสวยเพื่อผู้ยากไร้",
    title: "สรุปค่าใช้จ่ายโครงการทั้งหมด",
    detail: "โครงการเสร็จสมบูรณ์ ใช้งบประมาณตามที่ระดมทุนได้ครบถ้วน พร้อมใบเสร็จทุกรายการ",
    amountUsed: 40000,
    date: "2026-07-30",
  },
]

export const expenses: Expense[] = [
  { id: "e1", item: "ค่าไถ่ชีวิตโค 8 ตัว", category: "ไถ่ชีวิตสัตว์", amount: 44000, date: "2026-08-06", receipt: "RC-2408-001" },
  { id: "e2", item: "ค่าขนส่งสัตว์", category: "ไถ่ชีวิตสัตว์", amount: 4000, date: "2026-08-06", receipt: "RC-2408-002" },
  { id: "e3", item: "กระเบื้องมุงหลังคา", category: "บูรณะศาสนสถาน", amount: 38000, date: "2026-08-02", receipt: "RC-2408-003" },
  { id: "e4", item: "โครงเหล็กและอุปกรณ์", category: "บูรณะศาสนสถาน", amount: 24000, date: "2026-08-02", receipt: "RC-2408-004" },
  { id: "e5", item: "ข้าวสารและวัตถุดิบ", category: "สาธารณสงเคราะห์", amount: 28000, date: "2026-07-28", receipt: "RC-2407-018" },
  { id: "e6", item: "ภาชนะและบรรจุภัณฑ์", category: "สาธารณสงเคราะห์", amount: 12000, date: "2026-07-28", receipt: "RC-2407-019" },
]

export const donationTrend = [
  { day: "31 ก.ค.", amount: 8200 },
  { day: "1 ส.ค.", amount: 12400 },
  { day: "2 ส.ค.", amount: 9800 },
  { day: "3 ส.ค.", amount: 15600 },
  { day: "4 ส.ค.", amount: 21300 },
  { day: "5 ส.ค.", amount: 18900 },
  { day: "6 ส.ค.", amount: 25100 },
]

export function formatBaht(n: number): string {
  return "฿" + n.toLocaleString("th-TH")
}

export const totals = {
  totalRaised: projects.reduce((s, p) => s + p.raised, 0),
  totalDonors: donors.length === 0 ? 0 : 1121,
  activeProjects: projects.filter((p) => p.status === "active").length,
  todayAmount: 25100,
}
