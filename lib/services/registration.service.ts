import { prisma } from "@/lib/db";
import { Registration, Gender } from "@/prisma/generated/client";
import { RegistrationInput } from "../actions/registration.action";

// export interface RegistrationInput {
//   firstName: string;
//   lastName: string;
//   branch: string;
//   gender: Gender;
//   email?: string;
//   phone?: string;
//   membershipStatus?: "member" | "visitor";
//   modeOfAttendance?: "cluster" | "online";
//   area?: string;
//   cluster?: string;
//   accommodation?: "yes" | "no";
//   educationCareer?:
//     | "secondary school student"
//     | "post-secondary school student"
//     | "undergraduate"
//     | "fresh graduate/post-graduate"
//     | "career man"
//     | "entrepreneur"
//     | "senior colleague";
//   classLevel?: "jss3" | "ss1" | "ss2" | "ss3";
//   classDivision?: "science" | "art" | "commercial";
//   faculty?: string;
//   job?: string;
//   address?: string;

// }

export async function createRegistration(input: RegistrationInput): Promise<Registration> {
  return prisma.registration.create({
    data: {
      ...input,
      membershipStatus: input.membershipStatus || "member",
      email: input.email || null,
      phoneNumber: input.phoneNumber || null,
    },
  });
}
