import { useState, useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
import styles from './chatarea.module.scss';

export default function ChatArea() {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
          content: 'This is a simulated response from the AI assistant.',
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
          <div className={styles.chatAreaEmpty}>
            <h1 className={styles.welcomeTitle}>What can I help with?</h1>
            <div className={styles.inputSection}>
              <form onSubmit={handleSubmit} className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    placeholder="Message ChatGPT"
                    className={styles.input}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Mic className={styles.micButton} size={20} />
                </div>
              </form>
              <div className={styles.disclaimer}>
                ChatGPT can make mistakes. Consider checking important
                information.
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.messageContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.messageWrapper} ${
                  message.role === 'user'
                    ? styles.userMessage
                    : styles.aiMessage
                }`}
              >
                <div className={styles.message}>{message.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
