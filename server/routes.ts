import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { radarQuerySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/radar", async (req, res) => {
    try {
      const query = radarQuerySchema.parse({
        month: req.query.month as string | undefined,
        nation: req.query.nation as string | undefined,
        minSales: req.query.minSales ? Number(req.query.minSales) : undefined,
        excludeNew: req.query.excludeNew === "true",
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      const data = await storage.getRadarData(query);
      res.json(data);
    } catch (error) {
      console.error("Error fetching radar data:", error);
      res.status(400).json({ error: "Invalid query parameters" });
    }
  });

  app.get("/api/months", async (_req, res) => {
    try {
      const months = await storage.getAvailableMonths();
      res.json({ months });
    } catch (error) {
      console.error("Error fetching months:", error);
      res.status(500).json({ error: "Failed to fetch months" });
    }
  });

  return httpServer;
}
