import { z } from "zod";

export const accreditUserSchema = z.object({ id: z.string().min(1) });
export const bulkAccreditSchema = z.object({ ids: z.array(z.string().min(1)).min(1) });
export const fetchUsersSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  isAccredited: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});