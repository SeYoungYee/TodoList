"use client";

import { useState, useEffect } from "react";    
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const MyPage = () => {
    const [loginUser, setLoginUser] = useState<any>("");
    const [now, setNow] = useState(new Date());
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            console.log("데이터", data.user);
            setLoginUser(data.user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-10 px-4 bg-gray-100">
            <h1 className="text-4xl font-bold mb-2">👤 마이페이지</h1>
            <h2 className="text-lg text-gray-600">{now.toLocaleDateString()}</h2>
            <h2 className="text-sm text-gray-500 mb-6">{now.toLocaleTimeString()}</h2>
            
            <div className="w-full max-w-xl">
                <div className="bg-white p-6 rounded shadow mb-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">📧 계정 정보</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">이메일:</span>
                            <span className="text-gray-800">{loginUser?.email || "정보 없음"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">닉네임:</span>
                            <span className="text-gray-800">{loginUser?.nickname || "설정되지 않음"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 font-medium">가입일:</span>
                            <span className="text-gray-800">
                                {loginUser?.created_at ? formatDate(loginUser.created_at) : "정보 없음"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow mb-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">⚙️ 계정 설정</h3>
                    <div className="space-y-3">
                        <button 
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            onClick={() => router.push("/")}
                        >
                            📝 Todo 목록으로 돌아가기
                        </button>
                        <button 
                            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            onClick={() => {
                                if (confirm("정말 로그아웃하시겠습니까?")) {
                                    supabase.auth.signOut();
                                    router.push("/signin");
                                }
                            }}
                        >
                            🚪 로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage;