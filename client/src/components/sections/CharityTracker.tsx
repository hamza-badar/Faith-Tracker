import { useState, useEffect } from "react";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function CharityTracker() {
  const { data: progress, isLoading } = useProgress();
  const updateProgress = useUpdateProgress();
  
  const [localAmount, setLocalAmount] = useState<string>("");

  // Sync local state when remote data changes, but only if not currently typing
  useEffect(() => {
    if (progress !== undefined) {
      setLocalAmount(progress.charityAmount.toString());
    }
  }, [progress?.charityAmount]);

  if (isLoading) {
    return <div className="space-y-4 py-4"><Skeleton className="h-16 w-full rounded-2xl" /></div>;
  }

  const handleBlur = () => {
    const num = parseInt(localAmount, 10);
    const validNum = isNaN(num) || num < 0 ? 0 : num;
    
    if (validNum !== progress?.charityAmount) {
      updateProgress.mutate({ charityAmount: validNum });
    }
    setLocalAmount(validNum.toString());
  };

  return (
    <div className="pt-4 pb-2">
      <div className="flex items-center gap-4 bg-secondary/30 p-6 rounded-3xl border border-border/50">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Heart className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">To Give (Charity / Zakat)</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-display font-medium text-lg">
              $
            </span>
            <Input
              type="number"
              min="0"
              value={localAmount}
              onChange={(e) => setLocalAmount(e.target.value)}
              onBlur={handleBlur}
              className="pl-8 h-14 text-xl font-display font-semibold rounded-2xl bg-background border-border/50 shadow-sm transition-all focus-visible:ring-primary/20"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
