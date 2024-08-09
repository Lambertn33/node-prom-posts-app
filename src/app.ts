import express, { Request, Response } from "express";

import bodyParser from "body-parser";

import { Signin, Signup } from "./controllers/authController";

import { getMetrics, metricsMiddleware } from "./metrics";

import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  searchPosts,
  updatePost,
} from "./controllers/postController";

import { makePostComment } from "./controllers/commentController";

import { authMiddleware } from "./middlewares/authMiddleware";

import { responseStatuses } from "./constants/responses";

const app = express();

app.use(metricsMiddleware);

app.use(bodyParser.json());

app.use(express.json());

//default

app.get("/", (_: Request, res: Response) => {
  res.status(responseStatuses.SUCCESS).json({ message: "Welcome to this app" });
});

app.get("/metrics", getMetrics);

// authentication
app.post("/signup", Signup);

app.post("/signin", Signin);

//posts

app.get("/posts", getPosts);

app.get("/posts/:id", getPost);

app.post("/posts/search", searchPosts);

// requires auth

app.use(authMiddleware);

app.post("/posts", authMiddleware, createPost);

app.get("/user/posts", authMiddleware, getUserPosts);

app.put("/posts/:id", authMiddleware, updatePost);

app.post("/posts/:id/comment", authMiddleware, makePostComment);

export default app;
