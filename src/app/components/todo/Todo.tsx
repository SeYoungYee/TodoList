"use client"
import { useState,useEffect } from "react";

const Todo = () => {
    type TodoItem = {
        text: string;
        isDone: boolean;
    }

    const [todo, setTodo] = useState("")
    const [todoList, setTodoList] = useState<TodoItem[]>([])
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 할 일 추가 함수
    const addTodo = () => {
        if(todo.trim() === ""){
            alert("할 일을 입력해주세요");
            return; // Input이 비어있으면 추가하지 않음
        }
        setTodoList([...todoList, {text: todo, isDone: false}])
        setTodo("");
    }
    
    // 할 일 삭제 함수
    const deleteTodo = (index: number) => {
        const confirm = window.confirm("정말 삭제하시겠습니까?");
        if(confirm){
            setTodoList(todoList.filter((_, i) => i !== index))
        }
    }
    
    // 체크박스 토글 함수
    const toggleCheckbox = (index: number) => {
        setTodoList(todoList.map((item, i) => 
            i === index ? { ...item, isDone: !item.isDone } : item
        ));
    }
    
    return(
        <div className="flex flex-col items-center justify-center">
            <header className="text-2xl font-bold border-2">나만의 Todo List
                <div className="flex flex-col items-center justify-center">
                    <h1>{now.toLocaleDateString()}</h1>
                    <h1>{now.toLocaleTimeString()}</h1>
                </div>
            </header>

            <div className="flex ">
            <input 
            type="text" 
            placeholder="새로운 할 일 추가" 
            className="border-2"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            />
            <button className="border-2" onClick={addTodo}>추가하기</button>
            </div>

            <div>
                {todoList.map((todo, index) => (
                    <div key={index} className={`flex items-center`}>
                        <input 
                            type="checkbox" 
                            checked={todo.isDone}
                            onChange={() => toggleCheckbox(index)}
                        />
                        <span className={todo.isDone ? 'line-through text-gray-500' : ''}>
                            {todo.text}
                        </span>
                        <button className="border-2" onClick={() => deleteTodo(index)}>삭제</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Todo;