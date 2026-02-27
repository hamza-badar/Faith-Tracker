import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertQaza } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useQazaEntries() {
  return useQuery({
    queryKey: [api.qaza.list.path],
    queryFn: async () => {
      const res = await fetch(api.qaza.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch Qaza entries");
      return api.qaza.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateQazaEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertQaza) => {
      const validated = api.qaza.create.input.parse(data);
      const res = await fetch(api.qaza.create.path, {
        method: api.qaza.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.qaza.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to record Qaza prayer");
      }
      return api.qaza.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.qaza.list.path] });
      toast({ title: "Prayer recorded successfully" });
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

export function useDeleteQazaEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.qaza.delete.path, { id });
      const res = await fetch(url, {
        method: api.qaza.delete.method,
        credentials: "include",
      });
      if (!res.ok && res.status !== 404) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.qaza.list.path] });
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
