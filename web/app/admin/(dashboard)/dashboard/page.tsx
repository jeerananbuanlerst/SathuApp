import {
  Users,
  CalendarDays,
  Clock3,
  CheckCircle2,
  TrendingUp,
  Bell,
  MapPin,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-sage-dark">
            Dashboard
          </h1>

          <p className="mt-2 text-subtext">
            ภาพรวมระบบจัดการกิจกรรม Sathu
          </p>
        </div>

        <button className="relative rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Bell size={22} className="text-sage-dark" />

          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-xs text-white">
            3
          </span>
        </button>

      </div>

      {/* Stat */}

      <div className="grid grid-cols-4 gap-6">

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="flex justify-between">

            <div>

              <p className="text-subtext">
                ผู้ใช้งานทั้งหมด
              </p>

              <h2 className="mt-4 text-5xl font-bold text-sage-dark">
                1,284
              </h2>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-light">
              <Users className="text-sage-dark" size={28} />
            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="flex justify-between">

            <div>

              <p className="text-subtext">
                กิจกรรมทั้งหมด
              </p>

              <h2 className="mt-4 text-5xl font-bold text-sage-dark">
                452
              </h2>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-light">
              <CalendarDays className="text-sage-dark" size={28} />
            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="flex justify-between">

            <div>

              <p className="text-subtext">
                รออนุมัติ
              </p>

              <h2 className="mt-4 text-5xl font-bold text-coral-dark">
                12
              </h2>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-light">
              <Clock3 className="text-coral-dark" size={28} />
            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="flex justify-between">

            <div>

              <p className="text-subtext">
                อนุมัติแล้ว
              </p>

              <h2 className="mt-4 text-5xl font-bold text-coral-dark">
                440
              </h2>

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-light">
              <CheckCircle2 className="text-coral-dark" size={28} />
            </div>

          </div>

        </div>

      </div>

      {/* Main */}

      <div className="grid grid-cols-3 gap-6">

        {/* Chart */}

        <div className="col-span-2 rounded-3xl border border-border bg-card p-8 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-sage-dark">
              แนวโน้มกิจกรรม
            </h2>

            <TrendingUp className="text-sage" />

          </div>

          <div className="mt-10 flex h-80 items-end gap-5">

            <div className="h-[45%] flex-1 rounded-t-2xl bg-gradient-to-t from-sage-dark to-sage-light"></div>

            <div className="h-[65%] flex-1 rounded-t-2xl bg-gradient-to-t from-sage-dark to-sage-light"></div>

            <div className="h-[55%] flex-1 rounded-t-2xl bg-gradient-to-t from-sage-dark to-sage-light"></div>

            <div className="h-[85%] flex-1 rounded-t-2xl bg-gradient-to-t from-sage-dark to-sage-light"></div>

            <div className="h-[75%] flex-1 rounded-t-2xl bg-gradient-to-t from-sage-dark to-sage-light"></div>

            <div className="h-[100%] flex-1 rounded-t-2xl bg-gradient-to-t from-sage-dark to-sage-light"></div>

          </div>

          <div className="mt-5 flex justify-between text-subtext">

            <span>ม.ค.</span>
            <span>ก.พ.</span>
            <span>มี.ค.</span>
            <span>เม.ย.</span>
            <span>พ.ค.</span>
            <span>มิ.ย.</span>

          </div>

        </div>

        {/* Latest */}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold text-sage-dark">
            กิจกรรมล่าสุด
          </h2>

          <div className="mb-4 rounded-2xl bg-bg p-4">

            <h3 className="font-bold text-text">
              ตักบาตรวันอาทิตย์
            </h3>

            <p className="mt-2 flex items-center gap-2 text-subtext">
              <MapPin size={16} />
              วัดพระนารายณ์
            </p>

            <span className="mt-3 inline-block rounded-full bg-coral-light px-3 py-1 text-sm text-coral-dark">
              รออนุมัติ
            </span>

          </div>

          <div className="mb-4 rounded-2xl bg-bg p-4">

            <h3 className="font-bold text-text">
              เวียนเทียนวันอาสาฬหบูชา
            </h3>

            <p className="mt-2 flex items-center gap-2 text-subtext">
              <MapPin size={16} />
              วัดศาลาลอย
            </p>

            <span className="mt-3 inline-block rounded-full bg-sage-light px-3 py-1 text-sm text-sage-dark">
              เผยแพร่
            </span>

          </div>

          <div className="mb-4 rounded-2xl bg-bg p-4">

            <h3 className="font-bold text-text">
              ถวายสังฆทาน
            </h3>

            <p className="mt-2 flex items-center gap-2 text-subtext">
              <MapPin size={16} />
              วัดสุทธจินดา
            </p>

            <span className="mt-3 inline-block rounded-full bg-coral-light px-3 py-1 text-sm text-coral-dark">
              รออนุมัติ
            </span>

          </div>

          <div className="rounded-2xl bg-bg p-4">

            <h3 className="font-bold text-text">
              ทำบุญวันเกิด
            </h3>

            <p className="mt-2 flex items-center gap-2 text-subtext">
              <MapPin size={16} />
              วัดป่าสาลวัน
            </p>

            <span className="mt-3 inline-block rounded-full bg-sage-light px-3 py-1 text-sm text-sage-dark">
              เผยแพร่
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}