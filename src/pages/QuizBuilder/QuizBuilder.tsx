import React, { useState } from 'react';
import styles from './QuizBuilder.module.scss';
import { FileUploader } from './components/FileUploader';
import { QuizSettings } from './components/QuizSettings';
import { QuizTest } from './components/QuizTest';
import { QuizResults } from './components/QuizResults';
import { QuizQuestion } from './types';
import { api } from '~api';

export const QuizBuilder = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10); // in minutes
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [testActive, setTestActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setActiveTab('settings');
  };

  const handleStartTest = async () => {
    try {
      setIsLoading(true);

      // Create form data
      const formData = new FormData();
      if (file) formData.append('pdfFile', file);
      formData.append('numQuestions', numQuestions.toString());

      // Call API to generate questions
      const response = await api.ccServer.post('/quiz/generate', formData);

      if (response.status !== 200) throw new Error('Failed to generate quiz');

      const data = response.data;
      setQuestions(data.questions);
      setTimeRemaining(timeLimit * 60); // Convert to seconds
      setTestActive(true);
      setActiveTab('test');
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex,
    });
  };

  const handleSubmitTest = async () => {
    try {
      setIsLoading(true);

      // Calculate score
      let correctCount = 0;
      questions.forEach((question, index) => {
        const selectedAnswer = answers[index];
        const correctAnswer = question.correctAnswerIndex;

        if (selectedAnswer === correctAnswer) {
          correctCount++;
        }
      });

      const finalScore = correctCount / questions.length;
      setScore(finalScore);
      setActiveTab('results');
      setTestActive(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  const handleRetakeQuiz = () => {
    setActiveTab('settings');
    setAnswers({});
    setScore(0);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Upload Study Material</h2>
              <p className={styles.cardDescription}>
                Upload a PDF file containing the study material. Our AI will
                generate quiz questions based on this content.
              </p>
            </div>
            <div className={styles.cardContent}>
              <FileUploader onFileUpload={handleFileUpload} />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quiz Settings</h2>
              <p className={styles.cardDescription}>
                Configure your quiz parameters.
              </p>
            </div>
            <div className={styles.cardContent}>
              <QuizSettings
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                timeLimit={timeLimit}
                setTimeLimit={setTimeLimit}
              />
            </div>
            <div className={styles.cardFooter}>
              <button
                onClick={handleStartTest}
                disabled={isLoading}
                className={`${styles.button} ${styles.primary}`}
              >
                {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
              </button>
            </div>
          </div>
        );
      case 'test':
        return (
          <QuizTest
            questions={questions}
            answers={answers}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmitTest}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            onTimeUp={handleTimeUp}
          />
        );
      case 'results':
        return (
          <QuizResults
            questions={questions}
            userAnswers={answers}
            score={score}
            onRetake={handleRetakeQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.quizContainer}>
      {' '}
      <h1 className={styles.title}>AI Quiz Builder</h1>
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'upload' ? styles.active : ''
          } ${testActive ? styles.disabled : ''}`}
          onClick={() => !testActive && setActiveTab('upload')}
        >
          Upload
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'settings' ? styles.active : ''
          } ${!file || testActive ? styles.disabled : ''}`}
          onClick={() => file && !testActive && setActiveTab('settings')}
        >
          Settings
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'test' ? styles.active : ''
          } ${questions.length === 0 || !testActive ? styles.disabled : ''}`}
          onClick={() =>
            questions.length > 0 && testActive && setActiveTab('test')
          }
        >
          Test
        </div>
        <div
          className={`${styles.tabItem} ${
            activeTab === 'results' ? styles.active : ''
          } ${score === 0 && activeTab !== 'results' ? styles.disabled : ''}`}
          onClick={() => score > 0 && setActiveTab('results')}
        >
          Results
        </div>
      </div>
      <div className={styles.quizArea}>{renderContent()}</div>
    </div>
  );
};
