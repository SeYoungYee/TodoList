import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { email, password, nickname } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "email/password required" }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } }
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    if (!data.user) return NextResponse.json({ error: "no user returned" }, { status: 500 })

    const { error: insertError } = await supabase.from("user_info").insert({
      id: data.user.id,
      email,
      nickname: nickname ?? ""
    })
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ userId: data.user.id }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown error" }, { status: 500 })
  }
}