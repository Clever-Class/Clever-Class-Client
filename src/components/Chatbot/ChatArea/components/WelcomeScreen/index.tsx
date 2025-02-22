import styles from './welcomescreen.module.scss';
import { ChatInput } from '../ChatInput';

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
  return (
    <div className={styles.chatAreaEmpty}>
      <h1 className={styles.welcomeTitle}>What can I help with?</h1>
      <div className={styles.inputSection}>
        <ChatInput
          input={input}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
        <div className={styles.disclaimer}>
          Clever AI Tutor can make mistakes. Consider checking important
          information.
        </div>
      </div>
    </div>
  );
}
