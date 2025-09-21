import React, { useState, useEffect } from 'react';
import './TodoApp.css';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/todos";


function TodoApp() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add or update todo
  const SubmitTodo = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;

    try {
      if (editId) {
        const res = await fetch(`${BASE_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text: todo,
            completed: false // Include completed status for updates
          }),
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      } else {
        const res = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text: todo,
            completed: false // Include completed status for new todos
          }),
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      }

      setTodo("");
      setEditId(null);
      fetchTodos(); // refresh list
    } catch (error) {
      console.error('Error submitting todo:', error);
    }
  };

  // Delete todo
  const DelTodo = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  // Toggle complete
  const handleLineThrough = async (id, completed) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, completed: !completed } : todo
      )
    );
  };

  // Edit todo
  const handleEdit = (item) => {
    setTodo(item.text);
    setEditId(item._id);
  };

  return (
    <>
      <form onSubmit={SubmitTodo}>
        <input
          type="text"
          placeholder="Enter your task"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <h1>Todo List</h1>
      <ul>
        {todos.map((item) => (
          <li key={item._id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleLineThrough(item._id, item.completed)}
            />
            <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            <button onClick={() => handleEdit(item)}>edit</button>
            <button onClick={() => DelTodo(item._id)}>delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TodoApp;
