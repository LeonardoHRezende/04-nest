import { z } from "zod";


export const envSchema = z.object({
  DATA_BASE_URL: z.string(),
})