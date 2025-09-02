"use client"
import { supabase } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Todo = () => {
    type TodoItem = {
        id: number;
        contents: string;
        is_done: boolean;
        user_id: string;
        created_at: string;
        text: string;
        isDone: boolean;
    }

    const [todo, setTodo] = useState("")
    const [todoList, setTodoList] = useState<TodoItem[]>([])
    const [now, setNow] = useState(new Date());
    const [user, setUser] = useState<any>("");
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 로그인된 유저 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (error || !user) {
                router.push("/signin"); // 로그인 안 했으면 로그인 페이지로
            } else {
                setUser(user);
                fetchTodos(user.id); // 유저 있으면 바로 todo 불러오기
            }
        };
        fetchUser();
    }, []);

    // DB에서 todo 불러오기
    const fetchTodos = async (userId: string) => {
        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Todo 불러오기 실패:", error.message);
        } else {
            setTodoList(data || []);
        }
    };

    // supbase 할 일 추가 함수
    const supabaseAddTodo = async () => {
        const { data, error } = await supabase
            .from("todos")
            .insert([{ user_id: user.id, contents: todo, is_done: false }])
            .select();
        if(error) {
            console.log("데이터 추가 실패",error.message);
        }else {
            setTodo("");
            fetchTodos(user.id);
        }
    }

    // 할 일 삭제 함수
    const deleteTodo = (index: number) => {
        const confirm = window.confirm("정말 삭제하시겠습니까?");
        if (confirm) {
            setTodoList(todoList.filter((_, i) => i !== index))
        }
    }

    // 체크박스 토글 함수
    const toggleCheckbox = (index: number) => {
        setTodoList(todoList.map((item, i) =>
            i === index ? { ...item, isDone: !item.isDone } : item
        ));
    }

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push("/signin"); // 로그인 안 했으면 로그인 페이지로
            } else {
                setUser(data.user);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen py-10 px-4 bg-gray-100">
            <h1 className="text-4xl font-bold mb-2">📝 Todo List</h1>
            <h2 className="text-lg text-gray-600">{now.toLocaleDateString()}</h2>
            <h2 className="text-sm text-gray-500 mb-6">{now.toLocaleTimeString()}</h2>
            {/* <h2>로그인 된 이메일: {user.email}</h2> */}
            <div className="flex w-full max-w-xl mb-4 gap-2">
                <input
                    type="text"
                    placeholder="할 일을 입력하세요"
                    className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-blue-400"
                    style={{ cursor: "pointer" }}
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={supabaseAddTodo}
                >
                    추가하기
                </button>
            </div>

            <div className="w-full max-w-xl">
                {todoList.map((todo, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={todo.is_done}
                                onChange={() => toggleCheckbox(index)}
                            />
                            <span className={`text-lg ${todo.isDone ? 'line-through text-gray-400' : ''}`}>
                                {todo.contents}
                            </span>
                        </div>
                        <button
                            className="text-red-500 text-sm hover:underline"
                            onClick={() => deleteTodo(index)}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Todo;