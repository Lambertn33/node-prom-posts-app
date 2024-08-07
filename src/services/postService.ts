import { responseStatuses, responseTypes } from "../constants/responses";
import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "../repositories/postRepository";

export const createPostService = async (
  title: string,
  content: string,
  userId: number
) => {
  const createdPost = await createPost(title, content, userId);
  return {
    type: responseTypes.SUCCESS,
    status: responseStatuses.CREATED,
    message: "post created successfully",
    createdPost,
  };
};

export const updatePostService = async (
  title: string,
  content: string,
  postId: number
) => {
  const updatedPost = await updatePost(postId, title, content);
  return {
    type: responseTypes.SUCCESS,
    status: responseStatuses.SUCCESS,
    message: "post updated successfully",
    updatedPost,
  };
};

export const getPostsService = async () => {
  const posts = await getPosts();
  return {
    type: responseTypes.SUCCESS,
    status: responseStatuses.SUCCESS,
    posts,
  };
};

export const getPostService = async (postId: number) => {
  const post = await getPost(postId);
  return post
    ? {
        type: responseTypes.SUCCESS,
        status: responseStatuses.SUCCESS,
        post,
      }
    : {
        type: responseTypes.SUCCESS,
        status: responseStatuses.USER_ERROR,
        message: "Post not found",
      };
};

export const getUserPostsService = async (userId: number) => {
  const posts = await getUserPosts(userId);
  return {
    type: responseTypes.SUCCESS,
    status: responseStatuses.SUCCESS,
    posts,
  };
};
