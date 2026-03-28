import { prisma } from "@/lib/db";
import { Registration, Gender } from "@/prisma/generated/client";

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  branch: string;
  gender: Gender;
  memberType: "member" | "visitor";
  email?: string;
  phone?: string;
}

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  return prisma.registration.create({
    data: {
      ...input,
      memberType: input.memberType || "member",
      email: input.email || null,
      phone: input.phone || null,
    },
  });
}
