import { Request, Response } from "express";
import {
  createPostService,
  getPostService,
  getPostsService,
  getUserPostsService,
  updatePostService,
} from "../services/postService";
import { checkPostUpdatePermission } from "../repositories/postRepository";

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const user = req.user;

  const { createdPost, message, status } = await createPostService(
    title,
    content,
    parseInt(user?.id!)
  );

  return res.status(status).json({
    message,
    createdPost,
  });
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const user = req.user;
  if (!(await checkPostUpdatePermission(parseInt(id), parseInt(user?.id!)))) {
    return res.status(403).json({ message: "You can only edit your posts" });
  }

  const { message, status, updatedPost } = await updatePostService(
    title,
    content,
    parseInt(id)
  );

  return res.status(status).json({
    message,
    updatedPost,
  });
};

export const getPosts = async (_: Request, res: Response) => {
  const { posts, status } = await getPostsService();
  return res.status(status).json({
    posts,
  });
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, type, message, post } = await getPostService(parseInt(id));

  return type === "Success"
    ? res.status(status).json({
        post,
      })
    : res.status(status).json({
        message,
      });
};

export const getUserPosts = async (req: Request, res: Response) => {
  const user = req.user;
  const { posts, status } = await getUserPostsService(parseInt(user?.id!));
  return res.status(status).json({
    posts,
  });
};
