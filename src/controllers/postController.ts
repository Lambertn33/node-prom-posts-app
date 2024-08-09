import { Request, Response } from "express";
import {
  createPostService,
  getPostService,
  getPostsService,
  getUserPostsService,
  searchPostService,
  updatePostService,
} from "../services/postService";
import { checkPostUpdatePermission } from "../repositories/postRepository";
import { responseStatuses, responseTypes } from "../constants/responses";
import { httpRequestDurationMicroseconds, dbQueryDuration } from "../metrics";

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const user = req.user;
  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endbQueryDuration = dbQueryDuration.startTimer();

  const { createdPost, message, status } = await createPostService(
    title,
    content,
    parseInt(user?.id!)
  );

  endHttpRequestDuration({
    route: req.route.path,
    status_code: res.statusCode,
    method: req.method,
  });

  endbQueryDuration({ query_type: "create_post" });

  return res.status(status).json({
    message,
    createdPost,
  });
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endbQueryDuration = dbQueryDuration.startTimer();

  const user = req.user;
  if (!(await checkPostUpdatePermission(parseInt(id), parseInt(user?.id!)))) {
    endHttpRequestDuration({
      route: req.route.path,
      status_code: res.statusCode,
      method: req.method,
    });
    endbQueryDuration({ query_type: "update_post" });
    return res
      .status(responseStatuses.FORBIDDEN)
      .json({ message: "You can only edit your posts" });
  }

  const { message, status, updatedPost } = await updatePostService(
    title,
    content,
    parseInt(id)
  );

  endHttpRequestDuration({
    route: req.route.path,
    status_code: res.statusCode,
    method: req.method,
  });
  endbQueryDuration({ query_type: "update_post" });
  return res.status(status).json({
    message,
    updatedPost,
  });
};

export const getPosts = async (req: Request, res: Response) => {
  const { posts, status } = await getPostsService();
  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endbQueryDuration = dbQueryDuration.startTimer();

  endHttpRequestDuration({
    route: req.route.path,
    status_code: res.statusCode,
    method: req.method,
  });

  endbQueryDuration({ query_type: "get_posts" });
  return res.status(status).json({
    posts,
  });
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, type, message, post } = await getPostService(parseInt(id));
  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endbQueryDuration = dbQueryDuration.startTimer();

  endHttpRequestDuration({
    route: req.route.path,
    status_code: res.statusCode,
    method: req.method,
  });
  endbQueryDuration({ query_type: "get_post" });

  return type === responseTypes.SUCCESS
    ? res.status(status).json({
        post,
      })
    : res.status(status).json({
        message,
      });
};

export const getUserPosts = async (req: Request, res: Response) => {
  const user = req.user;
  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endbQueryDuration = dbQueryDuration.startTimer();
  const { posts, status } = await getUserPostsService(parseInt(user?.id!));

  endHttpRequestDuration({
    route: req.route.path,
    status_code: res.statusCode,
    method: req.method,
  });
  endbQueryDuration({ query_type: "get_user_posts" });

  return res.status(status).json({
    posts,
  });
};

export const searchPosts = async (req: Request, res: Response) => {
  const endHttpRequestDuration = httpRequestDurationMicroseconds.startTimer();
  const endbQueryDuration = dbQueryDuration.startTimer();

  const { searchKey } = req.body;
  const { status, type, message, searchedPosts } = await searchPostService(
    searchKey
  );

  endHttpRequestDuration({
    route: req.route.path,
    status_code: res.statusCode,
    method: req.method,
  });

  endbQueryDuration({ query_type: "search_posts" });

  return type === responseTypes.SUCCESS
    ? res.status(status).json({
        searchedPosts,
      })
    : res.status(status).json({
        message,
      });
};
