import { Request, Response } from "express";
import { SigninService, SignupService } from "../services/authService";

export const Signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { message, status, type, user } = await SignupService(email, password);
  try {
    return type === "Success"
      ? res.status(status).json({ message, user })
      : res.status(status).json({ message });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { status, type, message, token } = await SigninService(email, password);

  try {
    return type === "Success"
      ? res.status(status).json({ token })
      : res.status(status).json({ message });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
