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

    // Login
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

    // ตรวจสอบสิทธิ์ Admin
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, role")
      .eq("id", user.id)
      .single();

    console.log("========== ADMIN CHECK ==========");
    console.log(admin);
    console.log(adminError);
    console.log("=================================");

    if (adminError) {
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
      admin,
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