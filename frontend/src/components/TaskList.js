import React, { useState } from "react";
import api from "../axiosConfig";

const TaskList = ({ tasks, setTasks, filter }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  const toggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const res = await api.put(`/tasks/${task._id}`, updatedTask);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const deleteTask = async (id) => {
    if (!id) {
      alert("ID de tâche invalide");
      return;
    }
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setEditPriority(task.priority || "medium");
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveEdit = async (task) => {
    try {
      const updatedTask = {
        ...task,
        title: editTitle,
        dueDate: editDueDate || null,
        priority: editPriority,
      };
      const res = await api.put(`/tasks/${task._id}`, updatedTask);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setEditingTask(null);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ul className="task-list">
      {filteredTasks.length === 0 && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "var(--text-light)",
          }}>
          {filter === "all"
            ? "Aucune tâche disponible. Ajoutez-en une !"
            : filter === "active"
            ? "Aucune tâche active"
            : "Aucune tâche complétée"}
        </div>
      )}

      {filteredTasks.map((task) => (
        <li key={task._id} className="task-item">
          {editingTask === task._id ? (
            <div className="edit-form">
              <div className="form-group">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                />
              </div>
              <div className="task-input-group">
                <div className="form-group">
                  <label>Date d'échéance</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Priorité</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}>
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
              </div>
              <div className="task-actions" style={{ marginTop: "10px" }}>
                <button
                  className="btn-primary btn-small"
                  onClick={() => saveEdit(task)}>
                  Enregistrer
                </button>
                <button className="btn-text btn-small" onClick={cancelEditing}>
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-content">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed || false}
                  onChange={() => toggleComplete(task)}
                />
                <span
                  className={`task-text ${task.completed ? "completed" : ""}`}>
                  {task.title}
                </span>
                {task.priority && (
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority === "low" && "Basse"}
                    {task.priority === "medium" && "Moyenne"}
                    {task.priority === "high" && "Haute"}
                  </span>
                )}
              </div>

              {task.dueDate && (
                <div className="task-date">
                  Échéance: {formatDate(task.dueDate)}
                </div>
              )}

              <div className="task-actions">
                <button
                  className="btn-primary btn-small"
                  onClick={() => startEditing(task)}>
                  Modifier
                </button>
                <button
                  className="btn-accent btn-small"
                  onClick={() => deleteTask(task._id)}>
                  Supprimer
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
