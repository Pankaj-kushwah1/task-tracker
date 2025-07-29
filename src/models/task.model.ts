import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  user: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const TaskModel = mongoose.model<ITask>("Task", taskSchema);

export default TaskModel;
