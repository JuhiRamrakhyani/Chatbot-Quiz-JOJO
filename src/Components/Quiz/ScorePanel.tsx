import { Trophy, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScorePanelProps {
  score: number;
  totalQuestions: number;
  streak: number;
}

export const ScorePanel = ({ score, totalQuestions, streak }: ScorePanelProps) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
          <Trophy className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold gradient-text">
            {score}/{totalQuestions}
          </p>
        </div>
      </div>

      <div className="h-12 w-px bg-border" />

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Accuracy</p>
          <p className="text-2xl font-bold text-secondary">{percentage}%</p>
        </div>
      </div>

      <div className="h-12 w-px bg-border hidden sm:block" />

      <div className={cn("items-center gap-3 hidden sm:flex", streak >= 3 && "animate-pulse-glow")}>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
            streak >= 3 ? "bg-accent/30" : "bg-muted"
          )}
        >
          <Zap className={cn("w-6 h-6", streak >= 3 ? "text-accent" : "text-muted-foreground")} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Streak</p>
          <p className={cn("text-2xl font-bold", streak >= 3 ? "text-accent" : "text-muted-foreground")}>
            🔥 {streak}
          </p>
        </div>
      </div>
    </div>
  );
};
