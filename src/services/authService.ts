import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../repositories/userRepository";
import { generateToken } from "../utils/jwt";
import { responseStatuses, responseTypes } from "../constants/responses";

export const SignupService = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      type: responseTypes.ERROR,
      status: responseStatuses.USER_ERROR,
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
    type: responseTypes.SUCCESS,
    status: responseStatuses.CREATED,
    message: "user created successfully",
    user: formattedUser,
  };
};

export const SigninService = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      type: responseTypes.ERROR,
      status: responseStatuses.USER_ERROR,
      message: "Invalid email or password",
    };
  }
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return {
      type: responseTypes.ERROR,
      status: responseStatuses.USER_ERROR,
      message: "Invalid email or password",
    };
  }
  const token = generateToken(existingUser.id, existingUser.email);
  const user = {
    id: existingUser.id,
    email: existingUser.email,
  };

  return {
    type: responseTypes.SUCCESS,
    status: responseStatuses.SUCCESS,
    token,
    user,
  };
};
