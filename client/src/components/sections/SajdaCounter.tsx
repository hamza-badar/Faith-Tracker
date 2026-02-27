import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { Button } from "@/components/ui/button";
import { User, Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SajdaCounter() {
  const { data: progress, isLoading } = useProgress();
  const updateProgress = useUpdateProgress();

  if (isLoading) {
    return <div className="space-y-4 py-4"><Skeleton className="h-16 w-full rounded-2xl" /></div>;
  }

  const count = progress?.sajdaCount || 0;

  const handleIncrement = () => {
    updateProgress.mutate({ sajdaCount: count + 1 });
  };

  const handleDecrement = () => {
    if (count > 0) {
      updateProgress.mutate({ sajdaCount: count - 1 });
    }
  };

  return (
    <div className="pt-4 pb-2">
      <div className="flex items-center justify-between bg-secondary/30 p-6 rounded-3xl border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-semibold text-foreground">
              {count}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Sajda Tilawat</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-2xl border-border/50 shadow-sm"
            onClick={handleDecrement}
            disabled={count === 0 || updateProgress.isPending}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <Button
            className="w-12 h-12 rounded-2xl shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            size="icon"
            onClick={handleIncrement}
            disabled={updateProgress.isPending}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
