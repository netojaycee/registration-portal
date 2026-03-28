import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/utils/require-auth";


export async function accreditUser(id: string) {
  requireAuth();
  const user = await prisma.registration.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  if (user.isAccredited) {
    return { alreadyAccredited: true, user };
  }
  const updated = await prisma.registration.update({
    where: { id },
    data: { isAccredited: true },
  });
  return { alreadyAccredited: false, user: updated };
}


export async function bulkAccreditUsers(ids: string[]) {
  requireAuth();
  const users = await prisma.registration.findMany({ where: { id: { in: ids } } });
  const already = users.filter(u => u.isAccredited).map(u => u.id);
  const toAccredit = users.filter(u => !u.isAccredited).map(u => u.id);
  let updatedCount = 0;
  if (toAccredit.length > 0) {
    const res = await prisma.registration.updateMany({
      where: { id: { in: toAccredit } },
      data: { isAccredited: true },
    });
    updatedCount = res.count;
  }
  return { already, updatedCount };
}

export interface UserFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAccredited?: boolean;
  page?: number;
  pageSize?: number;
}

export async function fetchUsers({ firstName, lastName, email, isAccredited, page = 1, pageSize = 10 }: UserFilters) {
  requireAuth();
  const where: any = {};
  if (firstName) where.firstName = { contains: firstName, mode: "insensitive" };
  if (lastName) where.lastName = { contains: lastName, mode: "insensitive" };
  if (email) where.email = { contains: email, mode: "insensitive" };
  if (typeof isAccredited === "boolean") where.isAccredited = isAccredited;
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    prisma.registration.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.registration.count({ where })
  ]);
  return { users, total };
}
