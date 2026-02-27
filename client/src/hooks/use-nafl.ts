import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertNafl } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useNaflEntries() {
  return useQuery({
    queryKey: [api.nafl.list.path],
    queryFn: async () => {
      const res = await fetch(api.nafl.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch Nafl entries");
      return api.nafl.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNaflEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNafl) => {
      const validated = api.nafl.create.input.parse(data);
      const res = await fetch(api.nafl.create.path, {
        method: api.nafl.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.nafl.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to record fast");
      }
      return api.nafl.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.nafl.list.path] });
      toast({ title: "Fast recorded successfully" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}

export function useDeleteNaflEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.nafl.delete.path, { id });
      const res = await fetch(url, {
        method: api.nafl.delete.method,
        credentials: "include",
      });
      if (!res.ok && res.status !== 404) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.nafl.list.path] });
      toast({ title: "Entry removed" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });
}
