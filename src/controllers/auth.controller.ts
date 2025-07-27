// auth.controller.ts
import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;
import { UserModel } from "../models/user.model.js";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (err: any) {
    console.log("err ==> ", err);
    res.status(400).json({
      success: false,
      message: err.message || "Registration failed.",
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};
