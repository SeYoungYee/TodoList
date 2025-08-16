"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await res.json();
    setMessage(res.ok ? "회원가입 성공!" : `회원가입 실패: ${data.error}`);
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">📝 회원가입</h1>
      <form
        onSubmit={handleSignup}
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
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          회원가입
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
