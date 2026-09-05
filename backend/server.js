const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const tasks = [
    {
        id: crypto.randomUUID(),
        title: "Apprendre Node.js",
        description: "Comprendre les bases de Node.js et comment créer des applications backend.",
        completed: false
    },
    {
        id: crypto.randomUUID(),
        title: "Apprendre Express",
        description: "Comprendre les bases d'Express et comment créer des routes et des middlewares.",
        completed: false
    }
];

app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});

// Endpoint to get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Endpoint to create a new task
app.post("/tasks", (req, res) => {
    console.log("POST received !");
    console.log(req.body);

    const newTask = {
        id: crypto.randomUUID(),
        title: req.body.title,
        description: req.body.description,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Endpoint to delete a task by id
app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Endpoint to update a task by id
app.patch("/tasks/:id", (req, res) => {
    console.log("PATCH received");
    console.log(req.body);

    const id = req.params.id;
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }

    if (req.body.description !== undefined) {
        task.description = req.body.description;
    }

    res.status(200).json(task);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});