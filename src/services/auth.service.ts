import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
// auth.service.ts
type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

export const registerUser = async ({
  fullName,
  email,
  password,
}: RegisterInput) => {
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const user = await UserModel.create({ fullName, email, password });
  //   user.password = undefined;
  //   const userObj = user.toObject();
  //   delete userObj.password;
  //   return userObj;

  return user;
};

type LoginInput = {
  email: string;
  password: string;
};

import { IUser } from "../models/user.model.js"; // ✅ import interface

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = (await UserModel.findOne({ email })) as IUser;
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, JWT_SECRET as string);

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};
