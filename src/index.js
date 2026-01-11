const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const chatRoutes = require("./routes/chat.routes");
const conversationRoutes = require("./routes/conversation.routes");

app.use(express.json());

app.use("/api/chat" ,chatRoutes)
app.use("/api/conversations", conversationRoutes);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });
