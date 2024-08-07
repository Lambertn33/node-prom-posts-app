import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserByEmail = (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = (email: string, password: string): Promise<User> => {
  const data = { email, password };
  return prisma.user.create({
    data,
  });
};
