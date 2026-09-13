const pool = require("../database");

function isValidTitle(title) {
    return typeof title === "string" && title.trim() !== "";
}

// GET request
async function getTasks (req, res) {
    const { completed, search, sort, order, page, limit } = req.query;

    // --------------- Completed and search validation section ------------
    if(completed !== undefined && completed !== "true" && completed !== "false") {
        return res.status(400).json({message: "Completed must be true or false"});
    }
    // Converting completed into boolean because completed is a query parameter (string value)
    const completedValue = completed !== undefined ? completed === "true" : undefined;
    const searchValue = search?.trim();
    
    // --------------- Sorting validation section -------------------------
    const sortField = sort ?? "title";
    //const sortField = sort ?? "created_at";
    const sortOrder = (order ?? "asc").toLowerCase();
    const allowedSorts = ["created_at", "title", "completed"];

    if (!allowedSorts.includes(sortField)) {
        return res.status(400).json({message: "Invalide sort field"});
    }
    if (!["asc", "desc"].includes(sortOrder)) {
        return res.status(400).json({message: "Invalid sort order"});
    }

    // --------------- Pagination validation section ----------------------
    const pageNumber = Number(page ?? "1");
    const limitNumber = Number(limit ?? "10");

    if(!Number.isInteger(pageNumber) || pageNumber < 1) {
        return res.status(400).json({message: "Page must be a positive integer"});
    }
    if(!Number.isInteger(limitNumber) || limitNumber < 1) {
        return res.status(400).json({message: "Limit must be a positive integer"});
    }
    if (limitNumber > 100) {
        return res.status(400).json({message: "Limit cannot be greater than 100"});
    }
    
    const offset = (pageNumber - 1) * limitNumber;
    
    // --------------- Values for the WHERE query -------------------------
    const conditions = []
    const values = []
    
    if(completedValue !== undefined) {
        conditions.push(`completed = $${values.length + 1}`);
        values.push(completedValue);
    }
    if(searchValue !== undefined) {
        conditions.push(`title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1}`);
        values.push(`%${searchValue}%`);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    
    // --------------- Pagination placeholders -----------------------------
    const limitPlaceholder = values.length + 1;
    const offsetPlaceholder = values.length + 2;
    
    // --------------- Constructing count query ----------------------------
    const countQuery = `SELECT COUNT(*) FROM tasks ${whereClause}`;
    
    // --------------- Constructing query ----------------------------------
    const query =`
        SELECT * FROM tasks
        ${whereClause}
        ORDER BY ${sortField} ${sortOrder}
        LIMIT $${limitPlaceholder}
        OFFSET $${offsetPlaceholder}`;

    const queryValues = [...values, limitNumber, offset];

    try {
        const countResult = await pool.query(countQuery, values);
        const result = await pool.query(query, queryValues);

        // Total tasks and page of the filter query
        const total = Number(countResult.rows[0].count);
        const totalPages = Math.ceil(total / limitNumber);

        res.json({
            tasks: result.rows,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while querying tasks"});
    }
}

// POST request
async function createTask (req, res) {
    // Validate the request body
    if (req.body.title === undefined || !isValidTitle(req.body.title)) {
        return res.status(400).json({message: "Title must be defined and must be a non-empty string"});
    }
    if (req.body.description !== undefined && typeof req.body.description !== "string") {
        return res.status(400).json({message: "Description must be a string"});
    }
    if (req.body.completed !== undefined && typeof req.body.completed !== "boolean") {
        return res.status(400).json({message: "Completed must be a boolean"});
    }

    try {
        const description = req.body.description !== undefined ? req.body.description.trim() : null;
        const result = await pool.query(
            `INSERT INTO tasks (title, description)
            VALUES ($1, $2) 
            RETURNING *`,
            [req.body.title.trim(), description]);
        const createdTask = result.rows[0];
        res.status(201).json(createdTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while creating a new task"});
    }
}

// PATCH request
async function updateTask (req, res) {
    const id = req.params.id;

    // Validate the request body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({message: "No data to update"});
    }
    if (req.body.title !== undefined && !isValidTitle(req.body.title)) {
        return res.status(400).json({message: "Title must be a non-empty string"});
    }
    if (req.body.description !== undefined && typeof req.body.description !== "string") {
        return res.status(400).json({message: "Description must be a string"});
    }
    if (req.body.completed !== undefined && typeof req.body.completed !== "boolean") {
        return res.status(400).json({message: "Completed must be a boolean"});
    }

    const fields = [];
    const values = [];

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
}

// DELETE request
async function deleteTask (req, res) {
    try {
        const result = await pool.query(`
            DELETE FROM tasks
            WHERE id = $1`, [req.params.id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({message: "Task not found"});
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error while deleting task"});
    }
}

module.exports = {
    getTasks, createTask, updateTask, deleteTask
};