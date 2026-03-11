/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { QuizOption } from "./QuizOption";
import { TopicSelector } from "./TopicSelector";
import { Confetti } from "./Confetti";
import { Button } from "../ui/button";
import { Lightbulb, RotateCcw, Sparkles, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from '@google/generative-ai';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funFact: string;
}
// Add this interface at top with other interfaces
interface QuizExtraData {
  currentQuestion?: QuizQuestion;
  userAnswer?: number;
  difficulty?: string;
}
interface Message {
  id: string;
  content: string;
  isBot: boolean;
  question?: QuizQuestion;
}

interface QuizChatProps {
  onScoreChange: (score: number, total: number, streak: number) => void;
}

export const QuizChat = ({ onScoreChange }: QuizChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "🎯 Welcome to Quiz Master! I'm your AI quiz companion. Choose a topic below and let's test your knowledge!",
      isBot: true,
    },
  ]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const genAI = typeof window !== 'undefined' 
    ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string)
    : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    onScoreChange(score, totalQuestions, streak);
  }, [score, totalQuestions, streak, onScoreChange]);



// Replace your entire callQuizApi function:
const callQuizApi = async (action: string, extraData: QuizExtraData = {}) => {
  if (!genAI || !import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key missing. Add VITE_GEMINI_API_KEY to .env.local');
  }

  const systemPrompt = `You are a quiz assistant. Respond with PURE JSON only - NO MARKDOWN, NO BACKTICKS, NO EXTRA TEXT.

For evaluate_answer, return exactly:
{"correct": boolean, "feedback": "your fun message", "explanation": "why", "correct_answer": "answer"}

Example: {"correct": false, "feedback": "Close!", "explanation": "Reason here", "correct_answer": "Right answer"}`;

  let userPrompt = '';

  switch (action) {
    case 'generate_question':
      userPrompt = `Create 1 multiple-choice quiz question about "${selectedTopic}" (medium difficulty).

Return ONLY valid JSON:
{
  "question": "What is 2+2?",
  "options": ["3", "4", "5", "6"],
  "correctIndex": 1,
  "explanation": "2+2 equals 4.",
  "funFact": "Basic arithmetic!"
}`;
      break;

    case 'get_hint':
      if (!extraData.currentQuestion) {
        userPrompt = "Give a general quiz hint.";
      } else {
        userPrompt = `Question: "${extraData.currentQuestion.question}"
Correct answer is option ${extraData.currentQuestion.correctIndex + 1}
Give 1 helpful hint without spoiling the answer.`;
      }
      break;

    case 'evaluate_answer':
      if (!extraData.currentQuestion || extraData.userAnswer === undefined) {
        userPrompt = "Please provide a question and answer for evaluation.";
      } else {
        const isCorrect = extraData.userAnswer === extraData.currentQuestion.correctIndex;
        const userAnswerText = extraData.currentQuestion.options[extraData.userAnswer] || "Unknown";
        userPrompt = `${isCorrect ? 'CORRECT' : 'INCORRECT'}! 
Question: "${extraData.currentQuestion.question}"
User answer: "${userAnswerText}"
Give fun feedback + explanation.`;
      }
      break;

    default:
      throw new Error('Invalid action');
  }

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent([systemPrompt, userPrompt]);
  let content = result.response.text();

  // Auto-parse JSON for questions (same as your Deno code)
  if (action === 'generate_question') {
    try {
      const jsonMatch = content.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
      if (jsonMatch) content = JSON.parse(jsonMatch[0]);
    } catch { /* empty */ }
  }

  return { content };
};



  // ... rest of your functions remain EXACTLY the same (generateQuestion, handleStartQuiz, etc.)
  const generateQuestion = async () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setHintsUsed(0);

     try {
    const data = await callQuizApi("generate_question", {});
    const rawContent = data.content;
    
    let question: QuizQuestion;
    
    if (typeof rawContent === 'object' && rawContent) {
      question = rawContent as QuizQuestion;
    } else {
      const contentString = String(rawContent); // ✅ Fix: Force string
      const jsonMatch = contentString.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");
      question = JSON.parse(jsonMatch[0]);
    }
    
    setCurrentQuestion(question);
    setMessages((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        content: question.question, // ✅ This is already string
        isBot: true,
        question,
      },
    ]);
    } catch (error) {
      console.error("Error generating question:", error);
      toast({
        title: "Oops!",
        description: error instanceof Error ? error.message : "Failed to generate question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (!selectedTopic) {
      toast({
        title: "Pick a topic!",
        description: "Choose a topic to start your quiz adventure.",
      });
      return;
    }

    setGameStarted(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `topic-${Date.now()}`,
        content: `Great choice! Let's explore ${selectedTopic}. Here's your first question...`,
        isBot: true,
      },
    ]);
    generateQuestion();
  };

 const handleAnswerSelect = async (index: number) => {
  if (isRevealed || isLoading || !currentQuestion) return;

  setSelectedAnswer(index);
  setIsRevealed(true);
  setTotalQuestions((prev) => prev + 1);

  const isCorrect = index === currentQuestion.correctIndex;

  if (isCorrect) {
    setScore((prev) => prev + 1);
    setStreak((prev) => prev + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  } else {
    setStreak(0);
  }

  // Add user answer
  setMessages((prev) => [
    ...prev,
    {
      id: `a-${Date.now()}`,
      content: currentQuestion.options[index],
      isBot: false,
    },
  ]);

  setIsLoading(true);
  try {
    const data = await callQuizApi("evaluate_answer", {
      currentQuestion,
      userAnswer: index,
    });

    // ✅ PERFECT FEEDBACK FORMATTER - Handles your JSON perfectly
    const formatFeedback = (content: any): string => {
  try {
    // If string, try to parse JSON
    if (typeof content === "string") {
      const cleaned = content.replace(/```(?:json)?|```/g, "").trim();

      try {
        content = JSON.parse(cleaned);
      } catch {
        return cleaned; // normal text fallback
      }
    }

    const feedback = content;
    const correct = feedback.correct ?? isCorrect;

    if (correct) {
      return `🎉 ${feedback.feedback || "Correct!"}

${feedback.explanation || ""}`;
    } else {
      return `❌ ${feedback.feedback || "Not quite!"}

💡 Correct Answer: ${feedback.correct_answer || "See explanation"}

${feedback.explanation || ""}`;
    }
  } catch {
    return "Something went wrong while showing feedback.";
  }
};

    setMessages((prev) => [
      ...prev,
      {
        id: `feedback-${Date.now()}`,
        content: formatFeedback(data.content),
        isBot: true,
      },
    ]);

  } catch (error) {
    const fallbackFeedback = isCorrect
      ? `🎉 Correct! ${currentQuestion.explanation}`
      : `❌ Not quite! The answer was "${currentQuestion.options[currentQuestion.correctIndex]}".\n\n${currentQuestion.explanation}`;

    setMessages((prev) => [
      ...prev,
      {
        id: `feedback-${Date.now()}`,
        content: fallbackFeedback,
        isBot: true,
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const handleGetHint = async () => {
    if (!currentQuestion || isRevealed || hintsUsed >= 2) return;

    setIsLoading(true);
    setHintsUsed((prev) => prev + 1);

    try {
      const data = await callQuizApi("get_hint", { currentQuestion });

      setMessages((prev) => [
        ...prev,
        {
          id: `hint-${Date.now()}`,
          content: `💡 Hint: ${data.content}`,
          isBot: true,
        },
      ]);
    } catch (error) {
      toast({
        title: "Hint unavailable",
        description: "Couldn't get a hint right now. Try answering!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    generateQuestion();
  };

  const handleRestart = () => {
    setMessages([
      {
        id: "restart",
        content: "🔄 Quiz reset! Choose a new topic and let's go again!",
        isBot: true,
      },
    ]);
    setSelectedTopic("");
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
    setGameStarted(false);
    setHintsUsed(0);
  };
  return (
    <div className="flex flex-col h-full">
      <Confetti isActive={showConfetti} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            isBot={message.isBot}
          >
            {message.question && !isRevealed && currentQuestion?.question === message.question.question && (
              <div className="mt-4 space-y-2">
                {message.question.options.map((option, index) => (
                  <QuizOption
                    key={index}
                    option={option}
                    index={index}
                    isSelected={selectedAnswer === index}
                    isCorrect={currentQuestion.correctIndex === index}
                    isRevealed={isRevealed}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isLoading || isRevealed}
                  />
                ))}
              </div>
            )}
            {message.question && isRevealed && currentQuestion?.question === message.question.question && (
              <div className="mt-4 space-y-2">
                {message.question.options.map((option, index) => (
                  <QuizOption
                    key={index}
                    option={option}
                    index={index}
                    isSelected={selectedAnswer === index}
                    isCorrect={currentQuestion.correctIndex === index}
                    isRevealed={true}
                    onClick={() => {}}
                    disabled={true}
                  />
                ))}
              </div>
            )}
          </ChatBubble>
        ))}

        {isLoading && (
          <ChatBubble message="" isBot={true} isLoading={true} />
        )}

        <div ref={chatEndRef} />
      </div>

      {!gameStarted && (
        <div className="p-4 border-t border-border space-y-4">
          <TopicSelector
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
          />
          <Button
            onClick={handleStartQuiz}
            disabled={!selectedTopic}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz
          </Button>
        </div>
      )}

      {gameStarted && (
        <div className="p-4 border-t border-border flex gap-3">
          {!isRevealed && currentQuestion && (
            <Button
              onClick={handleGetHint}
              variant="outline"
              disabled={isLoading || hintsUsed >= 2}
              className="flex-1 h-12 border-primary/30 hover:bg-primary/10 hover:border-primary"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Hint ({2 - hintsUsed} left)
            </Button>
          )}
          
          {isRevealed && (
            <Button
              onClick={handleNextQuestion}
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Next Question
            </Button>
          )}

          <Button
            onClick={handleRestart}
            variant="outline"
            className="h-12 px-4 border-destructive/30 hover:bg-destructive/10 hover:border-destructive text-destructive"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
