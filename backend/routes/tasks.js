const express = require("express");

const router = express.Router();

const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/tasksController");

// Endpoint to get all tasks
router.get("/", getTasks);

// Endpoint to create a new task
router.post("/", createTask);

// Endpoint to update a task by id
router.patch("/:id", updateTask);

// Endpoint to delete a task by id
router.delete("/:id", deleteTask);

module.exports = router;