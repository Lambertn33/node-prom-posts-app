import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

export const makePostComment = (
  userId: number,
  postId: number,
  content: string
): Promise<Comment> => {
  return prisma.comment.create({
    data: {
      content,
      postId,
      userId,
    },
  });
};
