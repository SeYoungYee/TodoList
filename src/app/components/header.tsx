"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      alert("로그아웃 성공");
      console.log("로그아웃 성공");
      router.push("/login"); 
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <header className="w-full p-4 bg-gray-100 flex justify-between items-center">
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        로그아웃
      </button>
    </header>
  );
}
