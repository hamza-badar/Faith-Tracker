import { z } from "zod";
import { insertNaflSchema, insertQazaSchema, updateProgressSchema, naflEntries, qazaEntries, progress } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  progress: {
    get: {
      method: "GET" as const,
      path: "/api/progress" as const,
      responses: {
        200: z.custom<typeof progress.$inferSelect>(),
      }
    },
    update: {
      method: "PUT" as const,
      path: "/api/progress" as const,
      input: updateProgressSchema,
      responses: {
        200: z.custom<typeof progress.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  nafl: {
    list: {
      method: "GET" as const,
      path: "/api/nafl" as const,
      responses: {
        200: z.array(z.custom<typeof naflEntries.$inferSelect>()),
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/nafl" as const,
      input: insertNaflSchema,
      responses: {
        201: z.custom<typeof naflEntries.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/nafl/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  qaza: {
    list: {
      method: "GET" as const,
      path: "/api/qaza" as const,
      responses: {
        200: z.array(z.custom<typeof qazaEntries.$inferSelect>()),
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/qaza" as const,
      input: insertQazaSchema,
      responses: {
        201: z.custom<typeof qazaEntries.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/qaza/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProgressResponse = z.infer<typeof api.progress.get.responses[200]>;
export type NaflListResponse = z.infer<typeof api.nafl.list.responses[200]>;
export type QazaListResponse = z.infer<typeof api.qaza.list.responses[200]>;
