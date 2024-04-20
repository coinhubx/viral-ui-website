import { z } from "zod";

const registryEntrySchema = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
});

export const registrySchema = z.array(registryEntrySchema);

export type Registry = z.infer<typeof registrySchema>;
