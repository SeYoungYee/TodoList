import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "로그아웃 실패" }, { status: 500 });
  }
}
