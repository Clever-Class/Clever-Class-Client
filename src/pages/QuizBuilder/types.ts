export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResultsData {
  score: number;
  totalQuestions: number;
  correctAnswers: number[];
  incorrectAnswers: Record<number, { selected: number; explanation: string }>;
}

export interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export interface QuizSettingsProps {
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  timeLimit: number;
  setTimeLimit: (limit: number) => void;
}

export interface QuizTestProps {
  questions: QuizQuestion[];
  answers: Record<number, number>;
  onAnswerSelect: (questionIndex: number, answerIndex: number) => void;
  onSubmit: () => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onTimeUp: () => void;
}

export interface QuizResultsProps {
  results: QuizResultsData;
  questions: QuizQuestion[];
  onRetakeQuiz: () => void;
}
