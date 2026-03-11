import { cn } from "@/lib/utils";
import { 
  Brain, 
  Globe, 
  Atom, 
  Palette, 
  Music, 
  Film, 
  Gamepad2, 
  BookOpen 
} from "lucide-react";

interface TopicSelectorProps {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

const topics = [
  { id: "general", label: "General Knowledge", icon: Brain, color: "primary" },
  { id: "geography", label: "Geography", icon: Globe, color: "secondary" },
  { id: "science", label: "Science", icon: Atom, color: "accent" },
  { id: "art", label: "Art & Culture", icon: Palette, color: "primary" },
  { id: "music", label: "Music", icon: Music, color: "secondary" },
  { id: "movies", label: "Movies & TV", icon: Film, color: "accent" },
  { id: "gaming", label: "Video Games", icon: Gamepad2, color: "primary" },
  { id: "history", label: "History", icon: BookOpen, color: "secondary" },
];

const colorClasses = {
  primary: "border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary",
  secondary: "border-secondary/30 hover:border-secondary bg-secondary/5 hover:bg-secondary/10 text-secondary",
  accent: "border-accent/30 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent",
};

const selectedColorClasses = {
  primary: "border-primary bg-primary/20 glow-primary",
  secondary: "border-secondary bg-secondary/20",
  accent: "border-accent bg-accent/20",
};

export const TopicSelector = ({ selectedTopic, onSelectTopic }: TopicSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {topics.map((topic) => {
        const Icon = topic.icon;
        const isSelected = selectedTopic === topic.id;
        const color = topic.color as keyof typeof colorClasses;
        
        return (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group",
              isSelected 
                ? selectedColorClasses[color]
                : colorClasses[color],
              "hover:scale-105 active:scale-95"
            )}
          >
            <Icon className={cn(
              "w-6 h-6 transition-transform group-hover:scale-110",
              isSelected && "animate-bounce-in"
            )} />
            <span className="text-xs font-medium text-center text-foreground">
              {topic.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
