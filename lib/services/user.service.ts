import { prisma } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { requireAuth } from "@/lib/utils/require-auth";

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  requireAuth();
  const passwordHash = await hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: passwordHash },
  });
}

export async function findUserByEmail(email: string) {
  requireAuth();
  return prisma.user.findUnique({ where: { email } });
}

export async function validateUser(email: string, password: string) {
  requireAuth();
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await compare(password, user.password);
  if (!isValid) return null;
  return user;
}
