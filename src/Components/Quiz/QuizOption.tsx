import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface QuizOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isRevealed: boolean;
  onClick: () => void;
  disabled: boolean;
}

const optionLabels = ["A", "B", "C", "D"];

export const QuizOption = ({
  option,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled,
}: QuizOptionProps) => {
  const getStateStyles = () => {
    if (!isRevealed) {
      if (isSelected) {
        return "border-primary bg-primary/10 glow-primary";
      }
      return "border-border hover:border-primary/50 hover:bg-primary/5";
    }

    if (isCorrect) {
      return "border-success bg-success/10 glow-success";
    }
    if (isSelected && !isCorrect) {
      return "border-destructive bg-destructive/10 glow-error animate-shake";
    }
    return "border-border opacity-50";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-xl glass-card border-2 transition-all duration-300 text-left flex items-center gap-4 group",
        getStateStyles(),
        !disabled && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        disabled && "cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all",
          isRevealed && isCorrect
            ? "bg-success text-success-foreground"
            : isRevealed && isSelected && !isCorrect
            ? "bg-destructive text-destructive-foreground"
            : isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
        )}
      >
        {isRevealed && isCorrect ? (
          <Check className="w-5 h-5" />
        ) : isRevealed && isSelected && !isCorrect ? (
          <X className="w-5 h-5" />
        ) : (
          optionLabels[index]
        )}
      </span>
      <span className="text-foreground flex-1">{option}</span>
    </button>
  );
};
