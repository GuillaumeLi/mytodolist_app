const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");

// Start and configure Express and save routes
const app = express();
app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Hello from my backend!");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});