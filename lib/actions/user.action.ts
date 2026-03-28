"use server";
import { z } from "zod";
import { createUser, validateUser } from "@/lib/services/user.service";
import { setUserSession, clearUserSession } from "@/lib/utils/auth-session";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export async function registerUserAction(input: RegisterInput) {
  const result = registerSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const user = await createUser(result.data);
    return { success: true, user };
  } catch (error) {
    return { error: "Registration failed" };
  }
}


export async function loginUserAction(input: LoginInput) {

  const result = loginSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const user = await validateUser(result.data.email, result.data.password);
    if (!user) return { error: "Invalid credentials" };
    setUserSession(user.id);
    return { success: true, user };
  } catch (error) {
    return { error: "Login failed" };
  }
}

export async function logoutUserAction() {
  clearUserSession();
  return { success: true };
}
