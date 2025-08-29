"use client"
import { supabase } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Todo = () => {
    type TodoItem = {
        text: string;
        isDone: boolean;
    }

    const [todo, setTodo] = useState("")
    const [todoList, setTodoList] = useState<TodoItem[]>([])
    const [now, setNow] = useState(new Date());
    const [localisLoaded, setLocalIsLoaded] = useState(false);
    const [user,setUser] = useState<any>("");
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 로컬 스토리지 불러오기
    useEffect(() => {
        const savedTodoList = localStorage.getItem("todoList");
        if (savedTodoList) {
            setTodoList(JSON.parse(savedTodoList));
        }
        setLocalIsLoaded(true);
    }, []);
      
    // 할 일 목록 저장 (불러온 이후에만 저장하도록)
    useEffect(() => {
        if (localisLoaded) {
            localStorage.setItem("todoList", JSON.stringify(todoList));
            console.log("저장 완료:", todoList);
        }
    }, [todoList, localisLoaded]);

    // 할 일 추가 함수
    const addTodo = () => {
        if (todo.trim() === "") {
            alert("할 일을 입력해주세요");
            return; // Input이 비어있으면 추가하지 않음
        }
        setTodoList([...todoList, { text: todo, isDone: false }])
        setTodo("");
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

    const insertTodo = () =>{
        
    }

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
                    onClick={addTodo}
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
                                checked={todo.isDone}
                                onChange={() => toggleCheckbox(index)}
                            />
                            <span className={`text-lg ${todo.isDone ? 'line-through text-gray-400' : ''}`}>
                                {todo.text}
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