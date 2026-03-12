import { useState, useEffect } from "react";

const STORAGE_KEY = "studymaxxing_todos";

function App() {
  const [todos, setTodos] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse todos from localStorage:", error);
      return [];
    }
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos to localStorage:", error);
    }
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput(""); 
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const progressPercentage = todos.length === 0 ? 0 : (completedCount / todos.length) * 100;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            {completedCount} of {todos.length} completed
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a new todo" className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Add
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="mr-2" />
              <span className={todo.completed ? "line-through text-gray-500" : ""}>{todo.text}</span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700 focus:outline-none">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
