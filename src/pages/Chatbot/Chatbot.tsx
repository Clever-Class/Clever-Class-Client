import styles from './Chatbot.module.scss';
import ChatArea from '~components/Chatbot/ChatArea/ChatArea';
import ChatHistory from '~components/Chatbot/ChatHistory/ChatHistory';

export function Chatbot() {
  return (
    <div className={styles.chatContainer}>
      <ChatArea />
      <ChatHistory />
    </div>
  );
}
