import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "로그인 성공", user: email });
  } catch (error) {
    return NextResponse.json({ error: "에러 발생" }, { status: 500 });
  }
}
