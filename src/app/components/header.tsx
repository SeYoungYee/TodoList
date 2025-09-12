"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loginUser, setLoginUser] = useState<any>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setLoginUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      alert("로그아웃 성공");
      console.log("로그아웃 성공");
      router.push("/signin"); 
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
      {/* <h1>로그인된 아이디: {loginUser?.email}</h1> */}
      <button
        onClick={() => router.push("/mypage")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        마이페이지
      </button>
    </header>
  );
}
