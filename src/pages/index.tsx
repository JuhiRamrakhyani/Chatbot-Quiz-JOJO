import { useState } from "react";
import { QuizChat } from "../Components/Quiz/QuizChat";
import { ScorePanel } from "../Components/Quiz/ScorePanel";
import { Sparkles, Brain } from "lucide-react";

const Index = () => {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleScoreChange = (newScore: number, total: number, newStreak: number) => {
    setScore(newScore);
    setTotalQuestions(total);
    setStreak(newStreak);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card border-b border-border/50 p-4 sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-float">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text flex items-center gap-2">
                Quiz Master
                <Sparkles className="w-5 h-5 text-accent animate-pulse-glow" />
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">AI-Powered Trivia</p>
            </div>
          </div>
        </div>
      </header>

      {/* Score Panel */}
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <ScorePanel score={score} totalQuestions={totalQuestions} streak={streak} />
      </div>

      {/* Main Chat Container */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 pb-4">
        <div className="glass-card rounded-2xl h-[calc(100vh-280px)] min-h-[400px] overflow-hidden flex flex-col">
          <QuizChat onScoreChange={handleScoreChange} />
        </div>
      </main>

      {/* Footer decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default Index;
