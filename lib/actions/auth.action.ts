"use server";
import { z } from "zod";
import { loginAdmin } from "@/lib/services/auth.service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export async function loginAction(input: LoginInput) {
  const result = loginSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const admin = await loginAdmin(result.data.email, result.data.password);
    if (!admin) return { error: "Invalid credentials" };
    // You can set a session/cookie here if needed
    return { success: true, admin };
  } catch (error) {
    return { error: "Login failed" };
  }
}
