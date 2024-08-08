import { Request, Response } from "express";
import { makePostCommentService } from "../services/commentService";
import { httpRequestDurationMicroseconds } from "../metrics";
import { responseStatuses } from "../constants/responses";

export const makePostComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user;

  const end = httpRequestDurationMicroseconds.startTimer();
  try {
    const { createdComment, message, status } = await makePostCommentService(
      parseInt(user?.id!),
      parseInt(id),
      comment
    );

    end({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });

    return res.status(status).json({
      message,
      createdComment,
    });
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
