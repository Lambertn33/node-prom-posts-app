import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function cleanDatabase() {
  // await prisma.comment.deleteMany();
  //await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}
