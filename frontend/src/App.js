import React, { useState, useEffect } from "react";
import api from "./axiosConfig";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      // If unauthorized, clear token and log out
      if (err.response && err.response.status === 401) {
        setToken("");
        localStorage.removeItem("token");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  // Counts for task statistics
  const taskStats = {
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  };

  if (!token) {
    return <AuthForm setToken={setToken} />;
  }

  return (
    <div className="App">
      <div className="app-container">
        <div className="app-header">
          <h1>Ma To-Do List</h1>
          <button onClick={logout} className="btn-accent logout-btn">
            Déconnexion
          </button>
        </div>

        {/* Task stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {taskStats.total}
            </div>
            <div style={{ color: "var(--text-light)" }}>Total</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {taskStats.active}
            </div>
            <div style={{ color: "var(--text-light)" }}>Active</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>
              {taskStats.completed}
            </div>
            <div style={{ color: "var(--text-light)" }}>Complété</div>
          </div>
        </div>
      </div>

      <TaskForm setTasks={setTasks} />

      <div className="app-container">
        {/* Filter tabs */}
        <div className="filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}>
            Toutes ({taskStats.total})
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}>
            Active ({taskStats.active})
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}>
            Complété ({taskStats.completed})
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Chargement des tâches...
          </div>
        ) : (
          <TaskList tasks={tasks} setTasks={setTasks} filter={filter} />
        )}
      </div>
    </div>
  );
}

export default App;
