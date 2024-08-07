import express from "express";

import bodyParser from "body-parser";

import { Signin, Signup } from "./controllers/authController";

import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(bodyParser.json());

app.use(express.json());

app.post("/signup", Signup);

app.post("/signin", Signin);

app.use(errorHandler);

export default app;
