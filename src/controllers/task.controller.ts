import { Request, Response } from "express";
import { addNewTask } from "../services/task.service.js";
import { createTaskSchema } from "../validations/task.validation.js";
import TaskModel from "../models/task.model.js";

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
    const userId = req.user._id;
    console.log("req.user ==> ", req.user);
    const tasks = await TaskModel.find({ user: userId }).populate(
      "user",
      "fullName email"
    );

    return res.status(200).json({ success: true, tasks });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
