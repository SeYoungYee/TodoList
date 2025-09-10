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
    const [editId, setEditId] = useState<number | null>(null)
    const [editValue, setEditValue] = useState("")

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

    // supabase 할 일 삭제 함수
    const supabaseDeleteTodo = async (id: number) => {
        const confirm = window.confirm("정말 삭제하시겠습니까?");
        if (confirm) {
        const { data, error } = await supabase
            .from("todos")
            .delete()
            .eq("id", id);
            if(error) {
                console.log("데이터 삭제 실패", error.message);
            }else {
                fetchTodos(user.id);
            }   
        } else{
            return;
        }
    }

    // supabase 할 일 수정 함수
    const supabaseUpdateTodo = async (id: number, contents: string) => {
        const { data, error } = await supabase
            .from("todos")
            .update({ contents })
            .eq("id", id)
            .select();
        if (error) {
            console.error("데이터 수정 실패", error.message);
        } else {
            await fetchTodos(user.id);
        }
    }

    const startEdit = (id: number, value: string) => {
        setEditId(id);
        setEditValue(value);
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditValue("");
    }

    const saveEdit = async (id: number) => {
        const trimmed = editValue.trim();
        if (!trimmed) {
            cancelEdit();
            return;
        }
        await supabaseUpdateTodo(id, trimmed);
        cancelEdit();
    }

    // supabase 체크박스 함수 (true, false)
    const toggleCheckbox = async (id: number, is_done: boolean) => {
        const { data, error } = await supabase
      .from("todos")
      .update({ is_done: !is_done })
      .eq("id", id)
      .select();
  
    if (error) {
      console.error("체크박스 오류", error.message);
    } else {
      setTodoList(todoList.map((item) =>
        item.id === id ? { ...item, is_done: !is_done } : item
      ));
    }
  };

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
                        key={todo.id ?? index}
                        className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={todo.is_done}
                                onChange={() => toggleCheckbox(todo.id, todo.is_done)}
                            />
                            {editId === todo.id ? (
                                <input
                                    autoFocus
                                    className="text-lg border border-gray-300 rounded px-2 py-1"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => saveEdit(todo.id)}
                                />
                            ) : (
                                <span className={`text-lg ${todo.isDone ? 'line-through text-gray-400' : ''}`}>
                                    {todo.contents}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-6">
                        {editId === todo.id ? (
                            <div className="flex items-center gap-3">
                                <button
                                    className="text-green-600 text-sm hover:underline"
                                    onClick={() => saveEdit(todo.id)}
                                >
                                    저장
                                </button>
                                <button
                                    className="text-gray-500 text-sm hover:underline"
                                    onClick={cancelEdit}
                                >
                                    취소
                                </button>
                            </div>
                        ) : (
                            <button
                                className="text-blue-500 text-sm hover:underline"
                                onClick={() => startEdit(todo.id, todo.contents)}
                            >
                                수정
                            </button>
                        )}
                        <button
                            className="text-red-500 text-sm hover:underline"
                            onClick={() => supabaseDeleteTodo(todo.id)}
                        >
                            삭제
                        </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Todo;