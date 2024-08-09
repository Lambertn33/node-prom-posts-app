import { Request, Response } from "express";
import { SigninService, SignupService } from "../services/authService";
import { responseStatuses, responseTypes } from "../constants/responses";
import {
  httpRequestDurationMicroseconds,
  dbQueryDuration,
  dbQueriesTotal,
} from "../metrics";

export const Signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { message, status, type, user } = await SignupService(email, password);
  dbQueriesTotal.inc({ query_type: "signup" });

  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endDbQueryDuration = dbQueryDuration.startTimer();

  try {
    endHttpRequestDuration({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });
    endDbQueryDuration({
      query_type: "signup",
    });

    return type === responseTypes.SUCCESS
      ? res.status(status).json({ message, user })
      : res.status(status).json({ message });
  } catch (error) {
    endHttpRequestDuration({
      route: req?.route?.path,
      status_code: responseStatuses.SERVER_ERROR,
      method: req.method,
    });
    endDbQueryDuration({
      query_type: "signup",
    });

    return res
      .status(responseStatuses.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const Signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endDbQueryDuration = dbQueryDuration.startTimer();
  const { status, type, message, token, user } = await SigninService(
    email,
    password
  );
  dbQueriesTotal.inc({ query_type: "signin" });

  try {
    endHttpRequestDuration({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });

    endDbQueryDuration({ query_type: "signin" });
    return type === responseTypes.SUCCESS
      ? res.status(status).json({ token, user })
      : res.status(status).json({ message });
  } catch (error) {
    endHttpRequestDuration({
      route: req?.route?.path,
      status_code: responseStatuses.SERVER_ERROR,
      method: req.method,
    });
    endDbQueryDuration({ query_type: "signin" });
    return res
      .status(responseStatuses.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
