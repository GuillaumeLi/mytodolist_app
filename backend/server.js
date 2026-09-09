require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});

// Endpoint to get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while querying tasks"});
    }
});

// Endpoint to create a new task
app.post("/tasks", async (req, res) => {
    console.log("POST received !");
    console.log(req.body);

    // Validate the request body
    if (req.body.title === undefined ||
        typeof req.body.title !== "string" ||
        req.body.title.trim() === "") {
        return res.status(400).json({message: "Title must be defined and must be a non-empty string"});
    }
    if (req.body.description !== undefined &&
        typeof req.body.description !== "string") {
        return res.status(400).json({message: "Description must be a string"});
    }
    if (req.body.completed !== undefined &&
        typeof req.body.completed !== "boolean") {
        return res.status(400).json({message: "Completed must be a boolean"});
    }

    try {
        const description = req.body.description !== null ? req.body.description.trim() : null;
        const result = await pool.query(
            `INSERT INTO tasks (title, description)
            VALUES ($1, $2) 
            RETURNING *`,
            [req.body.title.trim(), description]);
        const newTask = result.rows[0];
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while creating a new task"});
    }
});

// Endpoint to delete a task by id
app.delete("/tasks/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(`
            DELETE FROM tasks
            WHERE id = $1`, [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({message: "Task not found"});
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while deleting task"});
    }
});

// Endpoint to update a task by id
app.patch("/tasks/:id", async (req, res) => {
    console.log("PATCH received");
    console.log(req.body);

    const id = req.params.id;
    const fields = [];
    const values = [];

    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: "No data to update"});
    }
    
    // Validate the request body
    if (req.body.title !== undefined &&
        (typeof req.body.title !== "string" ||
        req.body.title.trim() === "")) {
        return res.status(400).json({message: "Title must be a non-empty string"});
    }
    if (req.body.description !== undefined &&
        typeof req.body.description !== "string" ) {
        return res.status(400).json({message: "Description must be a string"});
    }
    if (req.body.completed !== undefined &&
        typeof req.body.completed !== "boolean") {
        return res.status(400).json({message: "Completed must be a boolean"});
    }

    // Update the task's properties if they are provided in the request body
    if (req.body.title !== undefined) {
        fields.push(`title = $${fields.length + 1}`);
        values.push(req.body.title.trim());
    }
    if (req.body.description !== undefined) {
        fields.push(`description = $${fields.length + 1}`);
        values.push(req.body.description.trim());
    }
    if (req.body.completed !== undefined) {
        fields.push(`completed = $${fields.length + 1}`);
        values.push(req.body.completed);
    }
    values.push(id);

    const query = `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *`;
    
    try {
        const result = await pool.query(query, values);

        if(result.rows.length === 0) {
            return res.status(404).json({message: "Task not found"});
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while updating task"});
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});