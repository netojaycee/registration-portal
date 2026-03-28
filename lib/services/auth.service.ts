import { compare } from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function loginAdmin(email: string, password: string) {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    throw new Error("Admin credentials not set in environment variables");
  }
  if (email !== ADMIN_EMAIL) {
    return null;
  }
  const isValid = await compare(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return null;
  }
  return { email };
}
