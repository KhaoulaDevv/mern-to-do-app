import React, { useState } from "react";
import api from "../axiosConfig";
const TaskForm = ({ setTasks }) => {
  const [newTask, setNewTask] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      const res = await api.post("/tasks", { title: newTask });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      alert("Erreur lors de l’ajout de la tâche");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche"
        required
      />
      <button type="submit">Ajouter</button>
    </form>
  );
};
export default TaskForm;
