import express, { Request, Response } from "express";

import bodyParser from "body-parser";

import { Signin, Signup } from "./controllers/authController";

import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "./controllers/postController";

import { makePostComment } from "./controllers/commentController";

import { authMiddleware } from "./middlewares/authMiddleware";
import { responseStatuses } from "./constants/responses";

const app = express();

app.use(bodyParser.json());

app.use(express.json());

//default

app.get("/", (_: Request, res: Response) => {
  res.status(responseStatuses.SUCCESS).json({ message: "Welcome" });
});

// authentication
app.post("/signup", Signup);

app.post("/signin", Signin);

//posts

app.get("/posts", getPosts);

app.get("/posts/:id", getPost);

// requires auth

app.use(authMiddleware);

app.post("/posts", authMiddleware, createPost);

app.get("/user/posts", authMiddleware, getUserPosts);

app.put("/posts/:id", authMiddleware, updatePost);

app.post("/posts/:id/comment", authMiddleware, makePostComment);

export default app;
