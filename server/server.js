
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Test API route
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running successfully!",
  });
});

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TaskFlow server running on http://localhost:${PORT}`);
  });
}

startServer();
