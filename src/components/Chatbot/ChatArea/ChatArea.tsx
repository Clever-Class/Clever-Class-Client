import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Paperclip } from 'lucide-react';
import styles from './chatarea.module.scss';
import { Avatar, AvatarFallback, AvatarImage } from '~components/ui/avatar';

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
          content: `could u please deisign the chatbot page like this with my colors. in the left we already have the sidebar so u don't need to do anything in left. but in the right keep the chat histories like chat gpt there. and please design it like a pro front end engineer. and please use moduler scss. please make the design similar to this and also please don't forget to add the history of the chat. for reference I gave u two image but my chat history will appear on right side`,
        },
        {
          role: 'assistant',
          content: `could u please deisign the chatbot page like this with my colors. in the left we already have the sidebar so u don't need to do anything in left. but in the right keep the chat histories like chat gpt there. and please design it like a pro front end engineer. and please use moduler scss. please make the design similar to this and also please don't forget to add the history of the chat. for reference I gave u two image but my chat history will appear on right side`,
        },
        {
          role: 'assistant',
          content: `could u please deisign the chatbot page like this with my colors. in the left we already have the sidebar so u don't need to do anything in left. but in the right keep the chat histories like chat gpt there. and please design it like a pro front end engineer. and please use moduler scss. please make the design similar to this and also please don't forget to add the history of the chat. for reference I gave u two image but my chat history will appear on right side`,
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
                  {/* Text Input */}
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    placeholder="Message Your Clever AI Tutor"
                    className={styles.input}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />

                  {/* Media Input Buttons */}
                  <div className={styles.mediaInputButtons}>
                    <Mic className={styles.micButton} size={30} />
                    <div className={styles.attachButton}>
                      <input
                        type="file"
                        id="file-upload"
                        aria-label="Upload file"
                      />
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
              <div className={styles.disclaimer}>
                Clever AI Tutor can make mistakes. Consider checking important
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
                <div className={styles.profilePicture}>
                  <Avatar>
                    {message.role === 'user' ? (
                      <AvatarFallback style={{ color: 'black' }}>
                        CC
                      </AvatarFallback>
                    ) : (
                      <AvatarImage src="https://github.com/shadcn.png" />
                    )}
                  </Avatar>
                </div>
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
