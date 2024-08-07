import { Request, Response } from "express";
import { SigninService, SignupService } from "../services/authService";
import { AppError } from "../utils/error";

export const Signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { formattedUser: user } = await SignupService(email, password);

    return res.status(201).json({
      message: "registration made successfully",
      user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token } = await SigninService(email, password);
    return res.status(200).json(token);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
