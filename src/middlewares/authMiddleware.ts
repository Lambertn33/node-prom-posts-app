import { responseStatuses } from "../constants/responses";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "your_secret_key";

interface JwtPayload {
  userId: string;
  email: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.header("Authorization");
  if (!tokenHeader) return res.status(401).json({ message: "unauthenticated" });

  const token = tokenHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, secretKey) as any;
  if (!decodedToken)
    return res
      .status(responseStatuses.UNAUTHENTICATED)
      .json({ message: "invalid or expired token" });

  const { id, email } = decodedToken;
  req.user = { id, email };
  return next();
};
