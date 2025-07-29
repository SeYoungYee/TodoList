"use client"
import { useState } from "react";

const Todo = () => {
    const [todo, setTodo] = useState("")
    const [todoList, setTodoList] = useState<string[]>([])
    
    // 할 일 추가 함수
    const addTodo = () => {
        if(todo.trim() === ""){
            alert("할 일을 입력해주세요");
            return; // Input이 비어있으면 추가하지 않음
        }
        setTodoList([...todoList, todo])
        setTodo("");
    }
    
    // 할 일 삭제 함수
    const deleteTodo = (index: number) => {
        const confirm = window.confirm("정말 삭제하시겠습니까?");
        if(confirm){
            setTodoList(todoList.filter((_, i) => i !== index))
        }
    }
    return(
        
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">나만의 Todo List</h1>
            <input 
            type="text" 
            placeholder="할 일을 입력해주세요" 
            className="border-2"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            />
            <button className="border-2" onClick={addTodo}>추가하기</button>
            <div>
                {todoList.map((todo, index) => (
                    <div key={index}>
                        {todo}
                        <button className="border-2" onClick={() => deleteTodo(index)}>삭제</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Todo;