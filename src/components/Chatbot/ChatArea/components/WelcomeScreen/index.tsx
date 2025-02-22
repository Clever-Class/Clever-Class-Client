import { useState } from 'react';
import styles from './welcomescreen.module.scss';
import { ChatInput } from '../ChatInput';
import { TeacherTypeChips } from '../TeacherTypeChips';

interface WelcomeScreenProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WelcomeScreen({
  input,
  onInputChange,
  onSubmit,
}: WelcomeScreenProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className={styles.chatAreaEmpty}>
      <h1 className={styles.welcomeTitle}>What can I help with?</h1>
      <div className={styles.inputSection}>
        <ChatInput
          input={input}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
        <TeacherTypeChips
          onSelect={handleTypeSelect}
          selectedType={selectedType}
        />
        <div className={styles.disclaimer}>
          Clever AI Tutor can make mistakes. Consider checking important
          information.
        </div>
      </div>
    </div>
  );
}
