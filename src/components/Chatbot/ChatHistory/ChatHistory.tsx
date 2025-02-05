import { MessageCircle } from 'lucide-react';
import styles from './chathistory.module.scss';

interface HistorySection {
  title: string;
  items: Array<{
    id: string;
    title: string;
    active?: boolean;
  }>;
}

const historySections: HistorySection[] = [
  {
    title: 'Today',
    items: [
      { id: '1', title: 'Getting started with AI', active: true },
      { id: '2', title: 'Python programming help' },
    ],
  },
  {
    title: 'Yesterday',
    items: [
      { id: '3', title: 'Database optimization' },
      { id: '4', title: 'React components' },
    ],
  },
  {
    title: 'Previous 7 Days',
    items: [
      { id: '5', title: 'API integration' },
      { id: '6', title: 'Performance testing' },
    ],
  },
];

export default function ChatHistory() {
  return (
    <div className={styles.historyPanel}>
      {historySections.map((section) => (
        <div key={section.title} className={styles.historySection}>
          <h3>{section.title}</h3>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`${styles.historyItem} ${
                item.active ? styles.historyItemActive : ''
              }`}
            >
              <MessageCircle size={16} />
              <span className="truncate">{item.title}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
