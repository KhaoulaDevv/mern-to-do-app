const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// Create a task
router.post("/", auth, async (req, res) => {
  const { title, completed, dueDate, priority } = req.body;

  try {
    // Create new task object with all fields
    const newTask = new Task({
      title,
      completed: completed || false,
      user: req.user.id,
      dueDate: dueDate || null,
      priority: priority || "medium",
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// Update a task
router.put("/:id", auth, async (req, res) => {
  const { title, completed, dueDate, priority } = req.body;

  // Build task object based on submitted fields
  const taskFields = {};
  if (title !== undefined) taskFields.title = title;
  if (completed !== undefined) taskFields.completed = completed;
  if (dueDate !== undefined) taskFields.dueDate = dueDate;
  if (priority !== undefined) taskFields.priority = priority;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    await Task.findByIdAndRemove(req.params.id);

    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
