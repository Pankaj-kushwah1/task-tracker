import { title } from "process";
import TaskModel from "../models/task.model.js";

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
