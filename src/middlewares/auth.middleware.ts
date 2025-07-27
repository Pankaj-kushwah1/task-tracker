import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const SECRET = process.env.JWT_SECRET!;

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token invalid" });
  }
};
