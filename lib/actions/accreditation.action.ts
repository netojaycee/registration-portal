
"use server";
import { accreditUser, bulkAccreditUsers, fetchUsers, fetchAllUsersForExport } from "@/lib/services/accreditation.service";
import { accreditUserSchema, bulkAccreditSchema, fetchUsersSchema, fetchAllUsersForExportSchema } from "@/lib/schemas/accreditation-schemas";
import z from "zod";

export async function accreditUserAction(input: z.infer<typeof accreditUserSchema>) {
  const result = accreditUserSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const res = await accreditUser(result.data.id);
    if (res.alreadyAccredited) {
      return { success: false, alreadyAccredited: true, user: res.user };
    }
    return { success: true, user: res.user };
  } catch (error) {
    return { error: "Failed to accredit user" };
  }
}

export async function bulkAccreditUsersAction(input: z.infer<typeof bulkAccreditSchema>) {
  const result = bulkAccreditSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const res = await bulkAccreditUsers(result.data.ids);
    if (res.already.length === result.data.ids.length) {
      return { success: false, alreadyAccredited: true, already: res.already, updatedCount: 0 };
    }
    return { success: true, already: res.already, updatedCount: res.updatedCount };
  } catch (error) {
    return { error: "Failed to bulk accredit" };
  }
}

export async function fetchAllUsersForExportAction(input: z.infer<typeof fetchAllUsersForExportSchema>) {
  const result = fetchAllUsersForExportSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const data = await fetchAllUsersForExport(result.data);
    return { success: true, ...data };
  } catch (error) {
    return { error: "Failed to fetch users for export" };
  }
}

export async function fetchUsersAction(input: z.infer<typeof fetchUsersSchema>) {
  const result = fetchUsersSchema.safeParse(input);
  if (!result.success) return { error: result.error.flatten() };
  try {
    const data = await fetchUsers(result.data);
    return { success: true, ...data };
  } catch (error) {
    return { error: "Failed to fetch users" };
  }
}
