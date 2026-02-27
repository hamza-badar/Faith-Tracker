import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const naflEntries = pgTable("nafl_entries", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  reason: text("reason").notNull(),
});

export const qazaEntries = pgTable("qaza_entries", {
  id: serial("id").primaryKey(),
  prayer: text("prayer").notNull(), // fajr, zuhr, asr, maghrib, isha
  date: text("date").notNull(),
  reason: text("reason").notNull(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  quranJuz: integer("quran_juz").notNull().default(0),
  quranFraction: integer("quran_fraction").notNull().default(0), // 0: none, 1: quarter, 2: half, 3: three-quarter
  sajdaCount: integer("sajda_count").notNull().default(0),
  charityAmount: integer("charity_amount").notNull().default(0),
});

export const insertNaflSchema = createInsertSchema(naflEntries).omit({ id: true });
export const insertQazaSchema = createInsertSchema(qazaEntries).omit({ id: true });
export const updateProgressSchema = createInsertSchema(progress).omit({ id: true }).partial();

export type NaflEntry = typeof naflEntries.$inferSelect;
export type InsertNafl = z.infer<typeof insertNaflSchema>;

export type QazaEntry = typeof qazaEntries.$inferSelect;
export type InsertQaza = z.infer<typeof insertQazaSchema>;

export type Progress = typeof progress.$inferSelect;
export type UpdateProgress = z.infer<typeof updateProgressSchema>;
