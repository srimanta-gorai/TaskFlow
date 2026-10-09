
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API welcome route
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running successfully!",
  });
});

//Auth API
app.use("/api/auth", authRoutes);

// Task API
app.use("/api/tasks", taskRoutes);

// Project API
app.use("/api/projects", projectRoutes);


const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TaskFlow server running on http://localhost:${PORT}`);
  });
}

startServer();
