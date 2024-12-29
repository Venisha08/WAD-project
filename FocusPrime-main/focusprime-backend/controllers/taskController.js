const Task = require("../models/task");

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const newTask = new Task({ text: req.body.text, completed: false }); // Ensure task starts as not completed
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Mark a task as completed
exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    // Update the task's completed status
    const task = await Task.findByIdAndUpdate(
      taskId,
      { completed: true },
      { new: true }
    );
    
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    // Return the updated task
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark task as completed" });
  }
};

// Fetch all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
