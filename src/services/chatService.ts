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
  image?: string; // Optional image data as base64 string
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
  chatWithAI: async (
    message: string,
    conversationId?: string,
    imageData?: string | null,
  ) => {
    const token = Cookies.get('userToken');

    if (!token) throw new Error('User not authenticated');

    const payload: any = { message, conversationId };

    // Add image data if provided
    if (imageData) {
      payload.image = imageData;
    }

    const response = await api.ccServer.post(`/chatbot/chat`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
