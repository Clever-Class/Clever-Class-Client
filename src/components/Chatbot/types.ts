/**
 * Common types used across Chatbot components
 */

/**
 * Represents a chat message in the UI
 */
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

/**
 * Subject option for the subject selector component
 */
export interface Subject {
  icon: JSX.Element;
  label: string;
}
