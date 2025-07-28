import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from './routes/task.routes.js'
dotenv.config();

await connectDB();
const PORT = process.env.PORT || 5000;






app.use("/api/auth", authRoutes);
app.use('/api/task',taskRoutes)
app.get("/", (req, res) => {
  res.send("Server is working! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
