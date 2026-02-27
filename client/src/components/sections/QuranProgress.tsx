import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FRACTION_LABELS = {
  0: "",
  1: " + ¼",
  2: " + ½",
  3: " + ¾",
};

export function QuranProgress() {
  const { data: progress, isLoading } = useProgress();
  const updateProgress = useUpdateProgress();

  if (isLoading) {
    return <div className="space-y-4 py-4"><Skeleton className="h-16 w-full rounded-2xl" /></div>;
  }

  const currentJuz = progress?.quranJuz || 0;
  const currentFraction = (progress?.quranFraction || 0) as 0 | 1 | 2 | 3;

  const handleIncrement = () => {
    let nextJuz = currentJuz;
    let nextFraction = currentFraction + 1;

    if (nextFraction > 3) {
      nextFraction = 0;
      nextJuz += 1;
    }

    if (nextJuz > 30) return; // Max reached

    updateProgress.mutate({ quranJuz: nextJuz, quranFraction: nextFraction });
  };

  const handleDecrement = () => {
    let nextJuz = currentJuz;
    let nextFraction = currentFraction - 1;

    if (nextFraction < 0) {
      if (nextJuz === 0) return; // Min reached
      nextFraction = 3;
      nextJuz -= 1;
    }

    updateProgress.mutate({ quranJuz: nextJuz, quranFraction: nextFraction });
  };

  const isComplete = currentJuz === 30;
  const displayLabel = currentJuz === 0 && currentFraction === 0 
    ? "Let's begin" 
    : `${currentJuz} Juz${FRACTION_LABELS[currentFraction]}`;

  return (
    <div className="pt-4 pb-2">
      <div className="flex items-center justify-between bg-secondary/30 p-6 rounded-3xl border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-semibold text-foreground">
              {isComplete ? "Completed!" : displayLabel}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Quran Recitation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-2xl border-border/50 shadow-sm"
            onClick={handleDecrement}
            disabled={currentJuz === 0 && currentFraction === 0 || updateProgress.isPending}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <Button
            className="w-12 h-12 rounded-2xl shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            size="icon"
            onClick={handleIncrement}
            disabled={isComplete || updateProgress.isPending}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Progress Bar Visual */}
      <div className="mt-6 px-2">
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(100, ((currentJuz * 4 + currentFraction) / 120) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1 font-medium">
          <span>Start</span>
          <span>Juz 30</span>
        </div>
      </div>
    </div>
  );
}
