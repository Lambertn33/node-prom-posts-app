import { responseStatuses, responseTypes } from "../constants/responses";
import { makePostComment } from "../repositories/commentRepository";

export const makePostCommentService = async (
  userId: number,
  postId: number,
  content: string
) => {
  const createdComment = await makePostComment(userId, postId, content);
  return {
    type: responseTypes.SUCCESS,
    status: responseStatuses.CREATED,
    message: "comment successfully",
    createdComment,
  };
};
