import { Request, Response } from "express";
import { SigninService, SignupService } from "../services/authService";
import { responseStatuses, responseTypes } from "../constants/responses";
import { httpRequestDurationMicroseconds } from "../metrics";

export const Signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { message, status, type, user } = await SignupService(email, password);

  const end = httpRequestDurationMicroseconds.startTimer();
  try {
    end({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });
    return type === responseTypes.SUCCESS
      ? res.status(status).json({ message, user })
      : res.status(status).json({ message });
  } catch (error) {
    end({
      route: req?.route?.path,
      status_code: responseStatuses.SERVER_ERROR,
      method: req.method,
    });
    return res
      .status(responseStatuses.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const Signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const end = httpRequestDurationMicroseconds.startTimer();
  const { status, type, message, token, user } = await SigninService(
    email,
    password
  );

  try {
    end({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });
    return type === responseTypes.SUCCESS
      ? res.status(status).json({ token, user })
      : res.status(status).json({ message });
  } catch (error) {
    end({
      route: req?.route?.path,
      status_code: responseStatuses.SERVER_ERROR,
      method: req.method,
    });
    return res
      .status(responseStatuses.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
