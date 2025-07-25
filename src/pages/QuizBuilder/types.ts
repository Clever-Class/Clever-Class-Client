export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface QuestionResult {
  questionId: number;
  question: string;
  options: string[];
  userAnswerIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
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
  answers: QuizAnswer[];
  answerMap?: Record<number, number>;
  onAnswerSelect: (questionIndex: number, answerIndex: number) => void;
  onSubmit: () => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  onTimeUp: () => void;
  quizId?: string;
  sessionIndex?: number;
}

export interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: QuizAnswer[];
  userAnswerMap?: Record<number, number>;
  score: number;
  onRetake: () => void;
  detailedResults?: Record<number, boolean>;
  questionResults?: QuestionResult[];
}

export interface QuizAnswer {
  questionId: number;
  answerIndex: number;
}

export interface QuizSession {
  startedAt: string;
  completedAt?: string;
  timeLimit: number; // in minutes
  timeRemaining: number; // in seconds
  answers: QuizAnswer[]; // Array of answer objects matching backend
  answerMap?: Record<number, number>; // For easier frontend usage
  score?: number;
  isCompleted: boolean;
  detailedResults?: Record<number, boolean>; // questionIndex -> isCorrect
  questionResults?: QuestionResult[]; // Detailed results with question data
}

export interface Quiz {
  _id: string;
  title: string;
  topic: string;
  numQuestions: number;
  timeLimit: number;
  sessions: QuizSession[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
  quizId?: string; // This is for backend compatibility
}

export interface QuizState {
  currentQuiz: QuizWithQuestions | null;
  currentSession: {
    sessionIndex: number;
    session: QuizSession;
  } | null;
}
