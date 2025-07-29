import express from "express";
import { addTask, getAllTasks, updateTask } from "../controllers/task.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/tasks", isAuthenticated, getAllTasks);
router.post('/add-task',addTask)
router.put('/:taskId',updateTask);
export default router;
