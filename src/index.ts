import app from "./app.js";
import { createClient } from "redis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

await connectDB();
const PORT = process.env.PORT || 5000;






app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is working! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
