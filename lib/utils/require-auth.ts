import { getUserSession } from "@/lib/utils/auth-session";

export function requireAuth() {
  const userId = getUserSession();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
