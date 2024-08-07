import { makePostComment } from "../repositories/commentRepository";

export const makePostCommentService = async (
  userId: number,
  postId: number,
  content: string
) => {
  const createdComment = await makePostComment(userId, postId, content);
  return {
    type: "Success",
    status: 200,
    message: "comment successfully",
    createdComment,
  };
};
