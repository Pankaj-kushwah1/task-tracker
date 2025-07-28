import mongoose from "mongoose";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }).min(1, "Title is required"),

  description: z.string({
    required_error: "Description is required",
  }).min(1, "Description is required"),

  isCompleted: z.boolean().optional().default(false),

  dueDate: z
    .string({
      required_error: "Due date is required",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),

  user: z.string({
    required_error: "User ID is required",
  }).refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Please provide valid user",
  }),
});

