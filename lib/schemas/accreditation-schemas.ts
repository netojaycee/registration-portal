import { z } from "zod";

export const accreditUserSchema = z.object({ id: z.string().min(1) });
export const bulkAccreditSchema = z.object({ ids: z.array(z.string().min(1)).min(1) });
export const fetchUsersSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  branch: z.string().optional(),
  isAccredited: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

export const fetchAllUsersForExportSchema = z.object({
  isAccredited: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});



export const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().or(z.literal("")),
  username: z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female"]),
  maritalStatus: z.enum(["Single", "Married", "Widowed"]),
  membershipStatus: z.enum(["member", "visitor"]),
  modeOfAttendance: z.enum(["cluster", "online"]),
  area: z.string().optional(),
  branch: z.string().optional(),
  cluster: z.string().optional(),
  accommodation: z.enum(["yes", "no"]),
  educationCareer: z.enum([
    "Secondary School Student",
    "Post-Secondary School Student",
    "Undergraduate",
    "Fresh Graduate/Post-Graduate",
    "Career Man/Woman",
    "Entrepreneur",
    "Senior Colleague"
  ]),
  classLevel: z.enum(["JSS3", "SS1", "SS2", "SS3"]).optional(),
  classDivision: z.enum(["Science", "Art", "Commercial"]).optional(),
  faculty: z.string().optional(),
  job: z.string().optional(),
  address: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.membershipStatus === "member") {
    if (!data.area) ctx.addIssue({ path: ["area"], code: "custom", message: "Area is required for members" });
    if (!data.branch) ctx.addIssue({ path: ["branch"], code: "custom", message: "Branch is required for members" });
  }
  if (data.membershipStatus === "visitor" && !data.address) {
    ctx.addIssue({ path: ["address"], code: "custom", message: "Address is required for visitors" });
  }
  if (data.modeOfAttendance === "cluster" && !data.cluster) {
    ctx.addIssue({ path: ["cluster"], code: "custom", message: "Cluster is required for Cluster attendance" });
  }
  if (data.educationCareer === "Secondary School Student") {
    if (!data.classLevel) ctx.addIssue({ path: ["classLevel"], code: "custom", message: "Class level required" });
    if (!data.classDivision) ctx.addIssue({ path: ["classDivision"], code: "custom", message: "Class division required" });
  }
  if (data.educationCareer === "Undergraduate" && !data.faculty) {
    ctx.addIssue({ path: ["faculty"], code: "custom", message: "Faculty is required for undergraduates" });
  }
  if (
    (data.educationCareer === "Career Man/Woman" || data.educationCareer === "Entrepreneur") &&
    !data.job
  ) {
    ctx.addIssue({ path: ["job"], code: "custom", message: "Job is required for Career/Entrepreneur" });
  }
});