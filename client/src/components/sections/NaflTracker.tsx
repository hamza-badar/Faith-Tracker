import { useState } from "react";
import { useNaflEntries, useCreateNaflEntry, useDeleteNaflEntry } from "@/hooks/use-nafl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, Plus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function NaflTracker() {
  const { data: entries, isLoading } = useNaflEntries();
  const createEntry = useCreateNaflEntry();
  const deleteEntry = useDeleteNaflEntry();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reason) return;
    
    createEntry.mutate(
      { date, reason },
      { onSuccess: () => setIsOpen(false) }
    );
  };

  if (isLoading) {
    return <div className="space-y-4 py-4"><Skeleton className="h-24 w-full rounded-2xl" /></div>;
  }

  const count = entries?.length || 0;

  return (
    <div className="pt-4 pb-2 space-y-4">
      {/* Header/Summary Card */}
      <div className="flex items-center justify-between bg-secondary/30 p-6 rounded-3xl border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-semibold text-foreground">
              {count}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Total Entries</p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-border/50">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-display text-2xl">Record Nafl</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-muted-foreground">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/30 border-border/50 px-4 font-medium"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-muted-foreground">Intention / Notes</Label>
                <Input
                  id="reason"
                  placeholder="e.g. Tahajjud, Gratitude, Repentance..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-14 rounded-2xl bg-secondary/30 border-border/50 px-4 font-medium"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl text-lg font-medium shadow-md"
                disabled={createEntry.isPending}
              >
                {createEntry.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Entries */}
      {entries && entries.length > 0 ? (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">History</h4>
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{entry.reason}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(entry.date), "MMM d, yyyy")}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteEntry.mutate(entry.id)}
                disabled={deleteEntry.isPending}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center px-4">
          <p className="text-muted-foreground text-sm font-medium">No entries recorded yet.</p>
        </div>
      )}
    </div>
  );
}
