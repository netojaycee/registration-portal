"use server";
import { z } from "zod";
import { createRegistration } from "@/lib/services/registration.service";

const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  branch: z.string().min(1, "Branch is required"),
  gender: z.enum(["male", "female"]),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
}).refine((data) => data.email || data.phone, {
  message: "At least Email or Phone is required",
  path: ["email", "phone"],
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export async function registerAction(formData: RegistrationInput) {
  const result = registrationSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.flatten() };
  }
  try {
    const registration = await createRegistration(result.data);
    return { success: true, registration };
  } catch (error) {
    return { error: "Registration failed" };
  }
}
