import { Request, Response } from "express";
import { makePostCommentService } from "../services/commentService";
import { httpRequestDurationMicroseconds, dbQueryDuration } from "../metrics";
import { responseStatuses } from "../constants/responses";

export const makePostComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user;

  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endDbQueryDuration = dbQueryDuration.startTimer();

  try {
    const { createdComment, message, status } = await makePostCommentService(
      parseInt(user?.id!),
      parseInt(id),
      comment
    );

    endHttpRequestDuration({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });

    endDbQueryDuration({
      query_type: "make_comment",
    });

    return res.status(status).json({
      message,
      createdComment,
    });
  } catch (error) {
    endHttpRequestDuration({
      route: req?.route?.path,
      status_code: responseStatuses.SERVER_ERROR,
      method: req.method,
    });
    endDbQueryDuration({
      query_type: "make_comment",
    });

    return res
      .status(responseStatuses.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
