import { z } from "zod";

// Plain JSON, no "body" wrapper needed
export const createDepartmentZodSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

export const updateDepartmentZodSchema = z.object({
  name: z.string().min(1, "Department name is required").optional(),
});

// Types
export type CreateDepartmentInput = z.infer<typeof createDepartmentZodSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentZodSchema>;
