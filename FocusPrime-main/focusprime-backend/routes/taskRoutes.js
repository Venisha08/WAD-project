const express = require("express");
const taskController = require("../controllers/taskController");
const router = express.Router();

router.post("/tasks", taskController.addTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.put("/tasks/:id/complete", taskController.completeTask);
router.get("/tasks", taskController.getTasks);

module.exports = router;

