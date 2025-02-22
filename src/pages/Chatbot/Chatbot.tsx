import ChatArea from '~components/Chatbot/ChatArea/ChatArea';
import ChatHistory from '~components/Chatbot/ChatHistory/ChatHistory';

import styles from './Chatbot.module.scss';

export function Chatbot() {
  return (
    <div className={styles.chatContainer}>
      <ChatArea />
      <ChatHistory />
    </div>
  );
}
