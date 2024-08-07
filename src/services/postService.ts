import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
  checkPostUpdatePermission,
} from "../repositories/postRepository";

export const createPostService = async (
  title: string,
  content: string,
  userId: number
) => {
  const createdPost = await createPost(title, content, userId);
  return {
    type: "Success",
    status: 201,
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
    type: "Success",
    status: 200,
    message: "post updated successfully",
    updatedPost,
  };
};

export const getPostsService = async () => {
  const posts = await getPosts();
  return {
    type: "Success",
    status: 200,
    posts,
  };
};

export const getPostService = async (postId: number) => {
  const post = await getPost(postId);
  return post
    ? {
        type: "Success",
        status: 200,
        post,
      }
    : {
        type: "Success",
        status: 404,
        message: "Post not found",
      };
};

export const getUserPostsService = async (userId: number) => {
  const posts = await getUserPosts(userId);
  return {
    type: "Success",
    status: 200,
    posts,
  };
};
