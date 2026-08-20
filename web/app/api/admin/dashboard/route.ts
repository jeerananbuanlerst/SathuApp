import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Sathu Admin Dashboard API is active" 
  });
}