import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Progress
  app.get(api.progress.get.path, async (req, res) => {
    const p = await storage.getProgress();
    res.json(p);
  });

  app.put(api.progress.update.path, async (req, res) => {
    try {
      const input = api.progress.update.input.parse(req.body);
      const updated = await storage.updateProgress(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Nafl
  app.get(api.nafl.list.path, async (req, res) => {
    const entries = await storage.getNaflEntries();
    res.json(entries);
  });

  app.post(api.nafl.create.path, async (req, res) => {
    try {
      const input = api.nafl.create.input.parse(req.body);
      const entry = await storage.createNaflEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.nafl.delete.path, async (req, res) => {
    await storage.deleteNaflEntry(Number(req.params.id));
    res.status(204).end();
  });

  // Qaza
  app.get(api.qaza.list.path, async (req, res) => {
    const entries = await storage.getQazaEntries();
    res.json(entries);
  });

  app.post(api.qaza.create.path, async (req, res) => {
    try {
      const input = api.qaza.create.input.parse(req.body);
      const entry = await storage.createQazaEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.qaza.delete.path, async (req, res) => {
    await storage.deleteQazaEntry(Number(req.params.id));
    res.status(204).end();
  });

  return httpServer;
}
