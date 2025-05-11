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
  audio?: string; // Base64 encoded audio data
  isNew?: boolean; // Flag to indicate if this is a new message for auto-play
  isStreaming?: boolean; // Flag to indicate if the message is currently streaming
  isError?: boolean; // Flag to indicate if this message is showing an error
}

/**
 * Subject option for the subject selector component
 */
export interface Subject {
  icon: React.ReactNode;
  label: string;
}
