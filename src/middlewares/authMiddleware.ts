import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "your_secret_key";

interface JwtPayload {
  userId: string;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (ex) {
    res.status(400).send({ error: "Invalid token" });
  }
};
