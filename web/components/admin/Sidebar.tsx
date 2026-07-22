"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  LogOut,
} from "lucide-react";

const links = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/approval",
    label: "อนุมัติกิจกรรม",
    icon: CheckSquare,
  },
  {
    href: "/admin/recommend",
    label: "เพิ่มกิจกรรม",
    icon: PlusCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="relative flex h-screen w-72 flex-col overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/sidebar-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1f4d39]/45 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-7">

        {/* Logo */}
        <div className="mb-12 flex items-center gap-4">

          <div className="relative h-16 w-16">

            <Image
              src="/Logo.png"
              alt="Sathu"
              fill
              priority
              className="object-contain drop-shadow-xl"
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-wide">
              Sathu Admin
            </h1>

            <p className="mt-1 text-sm text-white/75">
              ระบบจัดการกิจกรรม
            </p>

          </div>

        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-3">

          {links.map(({ href, label, icon: Icon }) => {

            const active = pathname === href;

            return (

              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                  active
                    ? "bg-white/20 backdrop-blur-md border border-white/20 shadow-xl"
                    : "hover:bg-white/10"
                }`}
              >

                <Icon
                  size={22}
                  className={`${
                    active
                      ? "text-[#FFD5D2]"
                      : "text-white/90 group-hover:text-white"
                  }`}
                />

                <span
                  className={`text-[17px] ${
                    active
                      ? "font-semibold text-white"
                      : "text-white/85"
                  }`}
                >
                  {label}
                </span>

              </Link>

            );
          })}

        </nav>

        {/* Logout */}

       <button className="mt-auto flex items-center gap-4 rounded-2xl px-6 py-4 text-[#FFD7D3] transition-all duration-300 hover:bg-white/10">

  <LogOut size={22} />

  <span className="text-[17px] font-medium tracking-wide">
    ออกจากระบบ
  </span>

</button>

      </div>
    </aside>
  );
}