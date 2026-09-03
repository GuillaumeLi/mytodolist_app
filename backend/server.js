const express = require("express");

const app = express();

app.use(express.json());

const tasks = [
    {
        id: 1,
        title: "Apprendre Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Apprendre Express",
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

    const newTask = req.body;

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});