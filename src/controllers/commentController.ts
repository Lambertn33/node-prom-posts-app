import { Request, Response } from "express";
import { makePostCommentService } from "../services/commentService";

export const makePostComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req.user;

  const { createdComment, message, status } = await makePostCommentService(
    parseInt(user?.id!),
    parseInt(id),
    comment
  );

  return res.status(status).json({
    message,
    createdComment,
  });
};
