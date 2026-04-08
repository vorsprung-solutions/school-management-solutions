import { z } from "zod";

export const NoticeValidations = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      priority: z.enum(["normal", "low", "medium", "high"]).optional().default("normal"),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(["normal", "low", "medium", "high"]).optional(),
    }),
  }),
};
