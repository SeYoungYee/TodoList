"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`로그인 실패: ${error.message}`);
      return;
    }
    // 로그인 성공 시 세션 확인
    const session = data.session;
    console.log("로그인된 세션:", session);
    setMessage("로그인 성공!");
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">🔐 로그인</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col w-full max-w-md gap-4 bg-white p-6 rounded shadow"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
