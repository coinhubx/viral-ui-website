import { z } from "zod";

const registryEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  source: z.string().optional(),
  type: z.enum(["components:ui"]),
  category: z.string().optional(),
  subcategory: z.string().optional(),
});

export const registrySchema = z.array(registryEntrySchema);

export type Registry = z.infer<typeof registrySchema>;
