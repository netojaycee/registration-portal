import { prisma } from "@/lib/db";
import { Registration, Gender } from "@/prisma/generated/client";

export interface RegistrationInput {
  firstName: string;
  lastName: string;
  branch: string;
  gender: Gender;
  email?: string;
  phone?: string;
}

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  return prisma.registration.create({
    data: {
      ...input,
      email: input.email || null,
      phone: input.phone || null,
    },
  });
}
