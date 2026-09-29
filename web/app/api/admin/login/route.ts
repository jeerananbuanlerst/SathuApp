import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  console.log("========== LOGIN API CALLED ==========");

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "กรุณากรอกอีเมลและรหัสผ่าน",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    // 1. ทำการ Login ผ่าน Supabase Auth
    const {
      data: { user },
      error: loginError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !user) {
      console.error("========== LOGIN ERROR ==========");
      console.error(loginError);
      console.error("=================================");

      return NextResponse.json(
        {
          error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        },
        {
          status: 401,
        }
      );
    }

    console.log("Login Success :", user.email);

    // 2. กรณีเป็น Super Admin หลัก (admin@sathu.com) อนุญาตผ่านทันที
    if (user.email === "admin@sathu.com") {
      return NextResponse.json({
        success: true,
        user,
        admin: { id: user.id, role: "super_admin" },
      });
    }

    // 3. ตรวจสอบสิทธิ์ว่าเป็นแอดมินวัดในตาราง temple_registrations หรือไม่
    const { data: templeData, error: templeError } = await supabase
      .from("temple_registrations")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log("========== TEMPLE ADMIN CHECK ==========");
    console.log(templeData);
    console.log(templeError);
    console.log("========================================");

    // ถ้าไม่พบข้อมูลในตาราง temple_registrations และไม่อยู่ในตาราง admins เดิม ให้ตีตก
    if (templeError || !templeData) {
      // ลองเช็กเผื่อเป็นแอดมินระบบเก่าในตาราง admins
      const { data: legacyAdmin } = await supabase
        .from("admins")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!legacyAdmin) {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            error: "คุณไม่มีสิทธิ์เข้าใช้งานระบบ",
          },
          {
            status: 403,
          }
        );
      }

      return NextResponse.json({
        success: true,
        user,
        admin: legacyAdmin,
      });
    }

    // 4. เช็กสถานะการอนุมัติของวัด
    if (templeData.status !== "approved") {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error: "คำขอลงทะเบียนวัดของคุณยังไม่ได้รับการอนุมัติจากทีมงาน Sathu",
        },
        {
          status: 403,
        }
      );
    }

    // ผ่านการตรวจสอบทั้งหมด อนุญาตให้เข้าสู่ระบบได้
    return NextResponse.json({
      success: true,
      user,
      admin: { id: user.id, role: "temple_admin", temple_name: templeData.temple_name },
    });

  } catch (error) {
    console.error("========== SERVER ERROR ==========");
    console.error(error);
    console.error("==================================");

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}