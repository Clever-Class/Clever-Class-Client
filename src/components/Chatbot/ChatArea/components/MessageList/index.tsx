import { useEffect, useRef } from 'react';
import styles from './messagelist.module.scss';
import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages: Message[];
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MessageList({
  messages,
  input,
  onInputChange,
  onSubmit,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className={styles.messageContainer}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        className={`${styles.inputSection} ${styles.inputSectionFixed} ${styles.slideIn}`}
      >
        <ChatInput
          input={input}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </>
  );
}
