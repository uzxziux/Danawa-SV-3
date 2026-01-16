import { z } from "zod";

export const nationSchema = z.enum(["domestic", "export"]);
export type Nation = z.infer<typeof nationSchema>;

export const radarModelSchema = z.object({
  id: z.string(),
  month: z.string(),
  nation: nationSchema,
  rank: z.number(),
  prevRank: z.number().nullable(),
  modelName: z.string(),
  brandName: z.string(),
  sales: z.number(),
  prevSales: z.number().nullable(),
  momAbs: z.number(),
  momPct: z.number(),
  rankChange: z.number(),
  score: z.number(),
  danawaUrl: z.string(),
});

export type RadarModel = z.infer<typeof radarModelSchema>;

export const radarQuerySchema = z.object({
  month: z.string().optional(),
  nation: nationSchema.optional(),
  minSales: z.number().optional(),
  excludeNew: z.boolean().optional(),
  limit: z.number().optional(),
});

export type RadarQuery = z.infer<typeof radarQuerySchema>;

export const radarResponseSchema = z.object({
  models: z.array(radarModelSchema),
  availableMonths: z.array(z.string()),
  currentMonth: z.string(),
  nation: nationSchema,
  totalCount: z.number(),
  lastUpdated: z.string().nullable(),
});

export type RadarResponse = z.infer<typeof radarResponseSchema>;
