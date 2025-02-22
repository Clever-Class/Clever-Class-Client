import { useRef } from 'react';
import { ArrowUp, Mic, Paperclip } from 'lucide-react';
import styles from './chatinput.module.scss';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ input, onInputChange, onSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          placeholder="Message Your Clever AI Tutor"
          className={styles.input}
          rows={1}
          onKeyDown={handleKeyDown}
        />

        <div className={styles.mediaInputButtons}>
          <Mic className={styles.micButton} size={30} />
          <div className={styles.attachButton}>
            <input type="file" id="file-upload" aria-label="Upload file" />
            <Paperclip size={20} />
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.sendButton} ${styles.sendButtonCustom}`}
          aria-label="Send message"
        >
          <div className={styles.sendIcon}>
            <ArrowUp size={20} />
          </div>
        </button>
      </div>
    </form>
  );
}
