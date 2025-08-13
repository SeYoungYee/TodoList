import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("회원가입 오류", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.log("회원가입 됐음", data.user);
    return NextResponse.json({ user: data.user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: 500 }
    );
  }
}
