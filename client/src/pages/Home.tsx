import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuranProgress } from "@/components/sections/QuranProgress";
import { SajdaCounter } from "@/components/sections/SajdaCounter";
import { NaflTracker } from "@/components/sections/NaflTracker";
import { QazaTracker } from "@/components/sections/QazaTracker";
import { CharityTracker } from "@/components/sections/CharityTracker";
import { BookOpen, User, Sun, Clock, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pb-24">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-x-0 border-t-0 rounded-none px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-display font-bold text-xl leading-none tracking-tighter">Deen</span>
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Tracker
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        
        <p className="text-muted-foreground font-medium px-2 mb-8">
          Peace be upon you. Track your spiritual journey beautifully and simply.
        </p>

        <Accordion type="multiple" defaultValue={["quran", "sajda", "qaza", "nafl", "charity"]} className="space-y-4">
          
          {/* QURAN SECTION */}
          <AccordionItem value="quran" className="border-none bg-card rounded-[2rem] shadow-sm border border-border/50 px-2 sm:px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-5 px-2">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-secondary rounded-xl text-primary"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Quran</h2>
                  <p className="text-sm font-normal text-muted-foreground">Recitation progress</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <QuranProgress />
            </AccordionContent>
          </AccordionItem>

          {/* QAZA SECTION */}
          <AccordionItem value="qaza" className="border-none bg-card rounded-[2rem] shadow-sm border border-border/50 px-2 sm:px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-5 px-2">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-secondary rounded-xl text-primary"><Clock className="w-5 h-5" /></div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Qaza Prayers</h2>
                  <p className="text-sm font-normal text-muted-foreground">Missed prayers makeup</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <QazaTracker />
            </AccordionContent>
          </AccordionItem>

          {/* NAFL SECTION */}
          <AccordionItem value="nafl" className="border-none bg-card rounded-[2rem] shadow-sm border border-border/50 px-2 sm:px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-5 px-2">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-secondary rounded-xl text-primary"><Sun className="w-5 h-5" /></div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Nafl</h2>
                  <p className="text-sm font-normal text-muted-foreground">Voluntary prayer log</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <NaflTracker />
            </AccordionContent>
          </AccordionItem>

          {/* SAJDA SECTION */}
          <AccordionItem value="sajda" className="border-none bg-card rounded-[2rem] shadow-sm border border-border/50 px-2 sm:px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-5 px-2">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-secondary rounded-xl text-primary"><User className="w-5 h-5" /></div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Sajda Tilawat</h2>
                  <p className="text-sm font-normal text-muted-foreground">Prostration counter</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <SajdaCounter />
            </AccordionContent>
          </AccordionItem>

          {/* CHARITY SECTION */}
          <AccordionItem value="charity" className="border-none bg-card rounded-[2rem] shadow-sm border border-border/50 px-2 sm:px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-5 px-2">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-secondary rounded-xl text-primary"><Heart className="w-5 h-5" /></div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Charity</h2>
                  <p className="text-sm font-normal text-muted-foreground">Financial giving</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <CharityTracker />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </main>
    </div>
  );
}
