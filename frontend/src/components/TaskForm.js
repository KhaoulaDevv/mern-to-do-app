import React, { useState } from "react";
import api from "../axiosConfig";

const TaskForm = ({ setTasks }) => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsLoading(true);

    try {
      const taskData = {
        title: newTask,
        completed: false,
        priority: priority,
      };

      // Add due date if provided
      if (dueDate) {
        taskData.dueDate = dueDate;
      }

      const res = await api.post("/tasks", taskData);
      setTasks((prev) => [...prev, res.data]);

      // Reset form
      setNewTask("");
      setDueDate("");
      setPriority("medium");
    } catch (err) {
      alert(
        err.response?.data?.message || "Erreur lors de l'ajout de la tâche"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Nouvelle tâche</label>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Que devez-vous faire ?"
            required
          />
        </div>

        <div className="task-input-group">
          <div className="form-group">
            <label>Date d'échéance (optionnelle)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priorité</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Ajout en cours..." : "Ajouter la tâche"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
