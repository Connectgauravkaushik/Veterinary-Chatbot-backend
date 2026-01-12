const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const chatRoutes = require("./routes/chat.routes");
const conversationRoutes = require("./routes/conversation.routes");

app.use(cors());           
app.use(express.json());    


app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });
