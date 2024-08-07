import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../repositories/userRepository";
import { generateToken } from "../utils/jwt";

export const SignupService = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      type: "Error",
      status: 400,
      message: "user with such email exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(email, hashedPassword);
  const formattedUser = {
    id: newUser.id,
    email: newUser.email,
  };

  return {
    type: "Success",
    status: 201,
    message: "user created successfully",
    user: formattedUser,
  };
};

export const SigninService = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      type: "Error",
      status: 400,
      message: "Invalid email or password",
    };
  }
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return {
      type: "Error",
      status: 400,
      message: "Invalid email or password",
    };
  }
  const token = generateToken(existingUser.id, existingUser.email);

  return {
    type: "Success",
    status: 200,
    token,
  };
};
