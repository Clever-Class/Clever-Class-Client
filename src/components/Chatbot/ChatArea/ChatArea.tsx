import { useState, useRef } from 'react';
import styles from './chatarea.module.scss';
import { MessageList } from './components/MessageList';
import { WelcomeScreen } from './components/WelcomeScreen';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'This is a simulated AI response.',
        },
      ]);
    }, 1000);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.mainContent}>
        {messages.length === 0 ? (
          <WelcomeScreen
            input={input}
            onInputChange={handleTextareaChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <MessageList
            messages={messages}
            input={input}
            onInputChange={handleTextareaChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
