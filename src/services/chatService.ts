import Cookies from 'js-cookie';
import { api } from '~api';

// Types
export interface ChatMessage {
  _id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// API calls
export const chatService = {
  // Chat with AI
  chatWithAI: async (message: string, conversationId?: string) => {
    const token = Cookies.get('userToken');

    if (!token) throw new Error('User not authenticated');

    const response = await api.ccServer.post(
      `/chatbot/chat`,
      { message, conversationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const token = Cookies.get('userToken');
    if (!token) throw new Error('User not authenticated');

    const response = await api.ccServer.get(`/chatbot/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.conversations as Conversation[];
  },

  // Get messages for a specific conversation
  getConversationMessages: async (conversationId: string) => {
    const token = Cookies.get('userToken');
    if (!token) throw new Error('User not authenticated');

    const response = await api.ccServer.get(
      `/chatbot/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.messages as ChatMessage[];
  },

  // Update conversation title
  updateConversationTitle: async (conversationId: string, title: string) => {
    const token = Cookies.get('userToken');
    if (!token) throw new Error('User not authenticated');

    const response = await api.ccServer.patch(
      `/chatbot/conversations/${conversationId}`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.conversation;
  },

  // Delete conversation
  deleteConversation: async (conversationId: string) => {
    const token = Cookies.get('userToken');
    if (!token) throw new Error('User not authenticated');

    const response = await api.ccServer.delete(
      `/chatbot/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};
