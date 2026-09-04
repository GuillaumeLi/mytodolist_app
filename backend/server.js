const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Apprendre Node.js",
        description: "Comprendre les bases de Node.js et comment créer des applications backend.",
        completed: false
    },
    {
        id: 2,
        title: "Apprendre Express",
        description: "Comprendre les bases d'Express et comment créer des routes et des middlewares.",
        completed: false
    }
];

app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/tasks", (req, res) => {
    console.log("POST reçu !");
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

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});