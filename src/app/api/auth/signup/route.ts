import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password, nickname } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname
        }
      }
    });

    if (error) { // 수파 베이스 에러 구문
      console.error("회원가입 오류", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.log("회원가입 완료", data.user);
    return NextResponse.json({ user: data.user });
  } catch (error) { //try catch에서 발생한 에러구문
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
