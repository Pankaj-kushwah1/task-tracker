import { Request, Response } from "express";
import { addNewTask, updateTaskById } from "../services/task.service.js";
import { createTaskSchema } from "../validations/task.validation.js";
import TaskModel from "../models/task.model.js";
import redis from "../config/redis.js";
import { get } from "http";
import {
  getTaskCache,
  invalidateTaskCache,
  setTaskCache,
} from "../utils/cache/task.cache.js";
import mongoose from "mongoose";

export const addTask = async (req: Request, res: Response) => {
  try {
    const { isCompleted } = req.body;
    req.body.isCompleted = isCompleted ?? false;
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: errorMessages[0] });
    }

    const task = await addNewTask(parsed.data);
    return res.status(201).send({ success: true, message: "Task added", task });
  } catch (error: any) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id.toString();

    // Get page and limit from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const cached = await getTaskCache(userId, page, limit);

    if (cached) {
      console.log("⏳ Fetched from Redis");
      return res.status(200).json({
        success: true,
        message: "Tasks fetched from cache",
        tasks: cached, // ✅ already parsed in getTaskCache()
      });
    }

    const tasks = await TaskModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // performance optimization

    // Set cache for 5 minutes
    await setTaskCache(userId, page, limit, tasks);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched from DB",
      tasks,
    });
  } catch (err: any) {
    console.log("err ==> ", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    const userId = req.body.userId;
    const updatedTask = await updateTaskById({ taskId, updates, userId });
    await invalidateTaskCache(userId);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error: any) {
    console.log("error ==> ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send({
        success: false,
        message: "Please provide valid task id",
      });
    }

    const deletedTask = await TaskModel.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res
        .status(400)
        .send({ success: false, message: "Task not found." });
    }

    await invalidateTaskCache(deletedTask.user.toString());
  } catch (error: any) {
    console.log("error ==> ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
