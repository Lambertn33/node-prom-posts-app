import { PrismaClient, Post } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = (
  title: string,
  content: string,
  userId: number
): Promise<Post> => {
  const data = { title, content, userId };

  return prisma.post.create({
    data: {
      content,
      title,
      userId,
    },
  });
};

export const updatePost = (
  postId: number,
  title: string,
  content: string
): Promise<Post> => {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title,
      content,
    },
  });
};

export const getPosts = (): Promise<Post[]> => {
  return prisma.post.findMany({
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const getUserPosts = (userId: number): Promise<Post[]> => {
  return prisma.post.findMany({
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
    where: {
      userId,
    },
  });
};

export const getPost = (id: number): Promise<Post | null> => {
  return prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      comments: {
        select: {
          content: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const checkPostUpdatePermission = async (id: number, userId: number) => {
  const post = await getPost(id);
  return post?.userId === userId;
};
