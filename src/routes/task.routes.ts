import express from "express";
import { addTask, getAllTasks } from "../controllers/task.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/tasks", isAuthenticated, getAllTasks);
router.post('/add-task',addTask)
export default router;
