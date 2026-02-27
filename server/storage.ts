import { db } from "./db";
import {
  naflEntries,
  qazaEntries,
  progress,
  type NaflEntry,
  type InsertNafl,
  type QazaEntry,
  type InsertQaza,
  type Progress,
  type UpdateProgress
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Nafl
  getNaflEntries(): Promise<NaflEntry[]>;
  createNaflEntry(entry: InsertNafl): Promise<NaflEntry>;
  deleteNaflEntry(id: number): Promise<void>;

  // Qaza
  getQazaEntries(): Promise<QazaEntry[]>;
  createQazaEntry(entry: InsertQaza): Promise<QazaEntry>;
  deleteQazaEntry(id: number): Promise<void>;

  // Progress (single row)
  getProgress(): Promise<Progress>;
  updateProgress(updates: UpdateProgress): Promise<Progress>;
}

export class DatabaseStorage implements IStorage {
  async getNaflEntries(): Promise<NaflEntry[]> {
    return await db.select().from(naflEntries);
  }

  async createNaflEntry(entry: InsertNafl): Promise<NaflEntry> {
    const [nafl] = await db.insert(naflEntries).values(entry).returning();
    return nafl;
  }

  async deleteNaflEntry(id: number): Promise<void> {
    await db.delete(naflEntries).where(eq(naflEntries.id, id));
  }

  async getQazaEntries(): Promise<QazaEntry[]> {
    return await db.select().from(qazaEntries);
  }

  async createQazaEntry(entry: InsertQaza): Promise<QazaEntry> {
    const [qaza] = await db.insert(qazaEntries).values(entry).returning();
    return qaza;
  }

  async deleteQazaEntry(id: number): Promise<void> {
    await db.delete(qazaEntries).where(eq(qazaEntries.id, id));
  }

  async getProgress(): Promise<Progress> {
    const [p] = await db.select().from(progress).where(eq(progress.id, 1));
    if (!p) {
      const [newP] = await db.insert(progress).values({ id: 1 }).returning();
      return newP;
    }
    return p;
  }

  async updateProgress(updates: UpdateProgress): Promise<Progress> {
    const p = await this.getProgress();
    const [updated] = await db.update(progress)
      .set(updates)
      .where(eq(progress.id, p.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
