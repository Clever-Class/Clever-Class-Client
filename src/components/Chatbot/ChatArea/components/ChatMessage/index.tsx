import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';
import styles from './chatmessage.module.scss';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={`${styles.messageWrapper} ${
        role === 'user' ? styles.userMessage : styles.aiMessage
      }`}
    >
      <div className={styles.profilePicture}>
        <Avatar>
          {role === 'user' ? (
            <AvatarFallback style={{ color: 'black' }}>CC</AvatarFallback>
          ) : (
            <AvatarImage src="https://github.com/shadcn.png" />
          )}
        </Avatar>
      </div>
      <div className={styles.message}>{content}</div>
    </div>
  );
}
