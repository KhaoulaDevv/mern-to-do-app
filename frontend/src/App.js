import React, { useState, useEffect } from "react";
import api from "./axiosConfig";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    if (token) {
      api
        .get("/tasks")
        .then((res) => setTasks(res.data))
        .catch(() => {
          setToken("");
          localStorage.removeItem("token");
        });
    }
  }, [token]);
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };
  if (!token) {
    return <AuthForm setToken={setToken} />;
  }
  return (
    <div className="App">
      <h1>Ma To-Do List</h1>
      <button onClick={logout}>Déconnexion</button>
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}
export default App;
