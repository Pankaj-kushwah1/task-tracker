import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const SECRET = process.env.JWT_SECRET!;

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Please provide token" });

  try {
    const decoded = jwt.verify(token, SECRET!);

    if (typeof decoded === "string") {
      return res.status(403).json({ msg: "Token invalid" });
    }

    req.user = decoded as JwtPayload & { _id: string };
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token invalid" });
  }
};
