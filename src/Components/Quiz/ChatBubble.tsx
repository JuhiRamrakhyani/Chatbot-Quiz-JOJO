import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isBot: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const ChatBubble = ({ message, isBot, isLoading, children }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full glass-card flex items-center justify-center glow-primary">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] md:max-w-[70%] rounded-2xl p-4 glass-card",
          isBot
            ? "rounded-tl-sm border-l-2 border-primary/50"
            : "rounded-tr-sm border-r-2 border-secondary/50"
        )}
      >
        {isLoading ? (
          <div className="typing-indicator flex gap-1 py-2 px-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="w-2 h-2 rounded-full bg-primary"></span>
          </div>
        ) : (
          <>
            <p className="text-foreground leading-relaxed">{message}</p>
            {children}
          </>
        )}
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full glass-card flex items-center justify-center border border-secondary/30">
          <User className="w-5 h-5 text-secondary" />
        </div>
      )}
    </div>
  );
};
