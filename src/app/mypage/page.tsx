"use client";

import { useState, useEffect } from "react";    
import { supabase } from "@/lib/supabase";
const MyPage = () => {
    const [loginUser, setLoginUser] = useState<any>("");

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setLoginUser(data.user);
        };
        fetchUser();
    }, []);

    return (
        <div>
            <h1>마이페이지</h1>
            <h2>로그인된 아이디: {loginUser?.email}</h2>
        </div>
    )
}

export default MyPage;