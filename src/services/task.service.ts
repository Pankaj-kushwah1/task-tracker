import { title } from "process";
import TaskModel from "../models/task.model.js";
import mongoose from "mongoose";

type TaskInput = {
  title: string;
  isCompleted?: boolean;
  dueDate: Date;
  user: string;
  description: string;
};

export const addNewTask = async ({
  title,
  isCompleted,
  dueDate,
  user,
  description,
}: TaskInput) => {
  const newTask = await TaskModel.create({
    title,
    isCompleted,
    dueDate,
    user,
    description,
  });

  return newTask;
};

type UpdateTaskInput = {
  taskId: string;
  updates: {
    title?: string;
    isCompleted?: boolean;
    dueDate?: Date;
    description: string;
  };
  userId: string;
};
export const updateTaskById = async ({
  taskId,
  updates,
  userId,
}: UpdateTaskInput) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId))
    throw Error("Please provide valid task id");

  const task = await TaskModel.findOneAndUpdate(
    { _id: taskId, user: userId }, // Make sure user can only update their own task
    updates,
    { new: true }
  );

  return task;
};

export const deleteTask = async (taskId: string) => {
  const task = await TaskModel.findByIdAndDelete(taskId);

  return task;
};
