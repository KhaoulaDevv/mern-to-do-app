import React from "react";
import api from "../axiosConfig";
const TaskList = ({ tasks, setTasks }) => {
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
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id}>
          {task.title}
          <button onClick={() => deleteTask(task._id)}>Supprimer</button>
        </li>
      ))}
    </ul>
  );
};
export default TaskList;
