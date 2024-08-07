import express from "express";

import bodyParser from "body-parser";

import { Signin, Signup } from "./controllers/authController";

import {
  createPost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "./controllers/postController";

import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();

app.use(bodyParser.json());

app.use(express.json());

// authentication
app.post("/signup", Signup);

app.post("/signin", Signin);

//posts

app.get("/posts", getPosts);

app.get("/posts/:id", getPost);

app.use(authMiddleware);

app.post("/posts", authMiddleware, createPost);

app.get("/user/posts", authMiddleware, getUserPosts);

app.put("/posts/:id", authMiddleware, updatePost);

export default app;
