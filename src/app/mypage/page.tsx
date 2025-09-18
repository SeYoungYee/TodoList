"use client";

import { useState, useEffect } from "react";    
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const MyPage = () => {
    const [loginUser, setLoginUser] = useState<any>("");
    const [userInfo, setUserInfo] = useState<any>(null);
    const [now, setNow] = useState(new Date());
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            console.log("데이터", data.user);
            setLoginUser(data.user);
            
            // user_info 테이블에서 추가 정보 가져오기
            if (data.user) {
                console.log("사용자 ID:", data.user.id);
                const { data: userData, error } = await supabase
                    .from("user_info")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();
                
                console.log("user_info 조회 결과:", { userData, error });
                
                if (error) {
                    console.error("user_info 조회 실패:", error);
                    console.error("오류 코드:", error.code);
                    console.error("오류 메시지:", error.message);
                    console.error("오류 세부사항:", error.details);
                    
                    // user_info 레코드가 없으면 생성 시도
                    if (error.code === 'PGRST116') {
                        console.log("user_info 레코드가 없어서 생성합니다.");
                        const { data: newUserData, error: insertError } = await supabase
                            .from("user_info")
                            .insert([{
                                id: data.user.id,
                                email: data.user.email,
                                nickname: data.user.user_metadata?.nickname || null
                            }])
                            .select()
                            .single();
                        
                        if (insertError) {
                            console.error("user_info 생성 실패:", insertError);
                        } else {
                            console.log("user_info 생성 성공:", newUserData);
                            setUserInfo(newUserData);
                        }
                    }
                } else if (userData) {
                    setUserInfo(userData);
                }
            }
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

    // 프로필 이미지 업로드 함수
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !loginUser) return;

        // 파일 형식 검증
        if (!file.type.startsWith('image/')) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        setIsUploading(true);
        
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64String = e.target?.result as string;
                
                const { error } = await supabase
                    .from("user_info")
                    .update({ profile_img: base64String })
                    .eq("id", loginUser.id);
                
                if (error) {
                    console.error("프로필 이미지 업로드 실패", error);
                    alert("프로필 이미지 업로드에 실패");
                } else {
                    alert("프로필 이미지가 업로드 완료");
                    // 사용자 정보 다시 불러오기
                    const { data: userData } = await supabase
                        .from("user_info")
                        .select("*")
                        .eq("id", loginUser.id)
                        .single();
                    setUserInfo(userData);
                }
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("이미지 처리 오류", error);
            alert("이미지 처리 중 오류가 발생");
            setIsUploading(false);
        }
    };

    // 프로필 이미지 삭제 함수
    const handleImageDelete = async () => {
        if (!loginUser || !confirm("프로필 이미지를 삭제하시겠습니까?")) return;

        try {
            const { error } = await supabase
                .from("user_info")
                .update({ profile_img: null })
                .eq("id", loginUser.id);
            
            if (error) {
                console.error("프로필 이미지 삭제 실패", error);
                alert("프로필 이미지 삭제에 실패");
            } else {
                alert("프로필 이미지가 삭제 완료");
                setUserInfo({ ...userInfo, profile_img: null });
            }
        } catch (error) {
            console.error("이미지 삭제 오류", error);
            alert("이미지 삭제 중 오류가 발생");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-10 px-4 bg-gray-100">
            <h1 className="text-4xl font-bold mb-2">👤 마이페이지</h1>
            <h2 className="text-lg text-gray-600">{now.toLocaleDateString()}</h2>
            <h2 className="text-sm text-gray-500 mb-6">{now.toLocaleTimeString()}</h2>
            
            <div className="w-full max-w-xl">
                <div className="bg-white p-6 rounded shadow mb-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">🖼️ 프로필 이미지</h3>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {userInfo?.profile_img ? (
                                <img 
                                    src={userInfo.profile_img} 
                                    alt="프로필 이미지" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                    <span className="text-4xl text-gray-400">👤</span>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <label className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer">
                                {isUploading ? "업로드 중..." : "이미지 선택"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                            {userInfo?.profile_img && (
                                <button 
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                    onClick={handleImageDelete}
                                >
                                    이미지 삭제
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow mb-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">📧 계정 정보</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">이메일:</span>
                            <span className="text-gray-800">{loginUser?.email || "정보 없음"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">닉네임:</span>
                            <span className="text-gray-800">{userInfo?.nickname || "설정되지 않음"}</span>
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