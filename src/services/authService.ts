import bcrypt from "bcryptjs";

import { createUser, getUserByEmail } from "../repositories/userRepository";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/error";

export const SignupService = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error("user with such email exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(email, hashedPassword);
  const formattedUser = {
    id: newUser.id,
    email: newUser.email,
  };

  return { formattedUser };
};

export const SigninService = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) throw new AppError("Invalid email or password", 401);

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

  const token = generateToken(existingUser.id, existingUser.email);

  return { token };
};
