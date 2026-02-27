import { useState } from "react";
import { useQazaEntries, useCreateQazaEntry, useDeleteQazaEntry } from "@/hooks/use-qaza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const PRAYERS = [
  { id: "fajr", label: "Fajr" },
  { id: "zuhr", label: "Zuhr" },
  { id: "asr", label: "Asr" },
  { id: "maghrib", label: "Maghrib" },
  { id: "isha", label: "Isha" },
];

export function QazaTracker() {
  const { data: entries, isLoading } = useQazaEntries();
  const createEntry = useCreateQazaEntry();
  const deleteEntry = useDeleteQazaEntry();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [prayer, setPrayer] = useState<string>("fajr");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayer || !date || !reason) return;
    
    createEntry.mutate(
      { prayer, date, reason },
      { 
        onSuccess: () => {
          setIsOpen(false);
          setReason(""); // reset reason, keep date/prayer for quick multi-add
        }
      }
    );
  };

  if (isLoading) {
    return <div className="space-y-4 py-4"><Skeleton className="h-32 w-full rounded-2xl" /></div>;
  }

  // Compute counts
  const counts = PRAYERS.reduce((acc, p) => {
    acc[p.id] = entries?.filter(e => e.prayer === p.id).length || 0;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = entries?.length || 0;

  return (
    <div className="pt-4 pb-2 space-y-6">
      
      {/* Summary Grid */}
      <div className="bg-secondary/30 p-6 rounded-3xl border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">Total: {totalCount}</h3>
            </div>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl shadow-sm bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-border/50">
              <DialogHeader className="mb-4">
                <DialogTitle className="font-display text-2xl">Record Qaza</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="prayer" className="text-muted-foreground">Prayer</Label>
                  <Select value={prayer} onValueChange={setPrayer} required>
                    <SelectTrigger className="h-14 rounded-2xl bg-secondary/30 border-border/50 px-4 font-medium">
                      <SelectValue placeholder="Select prayer" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-lg">
                      {PRAYERS.map(p => (
                        <SelectItem key={p.id} value={p.id} className="rounded-lg font-medium">{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-muted-foreground">Missed Date (Approx)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/30 border-border/50 px-4 font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-muted-foreground">Notes / Reason</Label>
                  <Input
                    id="reason"
                    placeholder="e.g. Travel, Overslept..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/30 border-border/50 px-4 font-medium"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-lg font-medium shadow-md mt-2"
                  disabled={createEntry.isPending}
                >
                  {createEntry.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {PRAYERS.map(p => (
            <div key={p.id} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border/50 shadow-sm">
              <span className="text-xs text-muted-foreground font-medium mb-1">{p.label}</span>
              <span className="font-display font-bold text-xl text-foreground">{counts[p.id]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* List of Entries */}
      {entries && entries.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Recent Records</h4>
          {entries.slice().reverse().map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground font-display font-bold text-sm uppercase">
                  {entry.prayer.substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize flex items-center gap-2">
                    {entry.prayer} 
                    <span className="text-xs font-normal text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{entry.reason}</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                    <Calendar className="w-3 h-3 mr-1 inline" />
                    {format(new Date(entry.date), "MMM d, yyyy")}
                  </p>
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
      )}
    </div>
  );
}
