import express from "express";

import bodyParser from "body-parser";

import { Signin, Signup } from "./controllers/authController";

const app = express();

app.use(bodyParser.json());

app.use(express.json());

app.post("/signup", Signup);

app.post("/signin", Signin);

export default app;
