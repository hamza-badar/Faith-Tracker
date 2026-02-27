import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ProgressResponse } from "@shared/routes";
import type { UpdateProgress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useProgress() {
  return useQuery({
    queryKey: [api.progress.get.path],
    queryFn: async () => {
      const res = await fetch(api.progress.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch progress");
      return api.progress.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateProgress) => {
      const res = await fetch(api.progress.update.path, {
        method: api.progress.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.progress.update.responses[400].parse(await res.json());
          throw new Error(error.message || "Invalid data");
        }
        throw new Error("Failed to update progress");
      }
      return api.progress.update.responses[200].parse(await res.json());
    },
    // Optimistic update
    onMutate: async (newProgress) => {
      await queryClient.cancelQueries({ queryKey: [api.progress.get.path] });
      const previousProgress = queryClient.getQueryData<ProgressResponse>([api.progress.get.path]);
      
      if (previousProgress) {
        queryClient.setQueryData<ProgressResponse>([api.progress.get.path], {
          ...previousProgress,
          ...newProgress,
        });
      }
      return { previousProgress };
    },
    onError: (err, newProgress, context) => {
      if (context?.previousProgress) {
        queryClient.setQueryData([api.progress.get.path], context.previousProgress);
      }
      toast({
        title: "Error updating progress",
        description: err.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.progress.get.path] });
    },
  });
}
