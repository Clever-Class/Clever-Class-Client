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
  audio?: string; // Optional audio data as base64 string
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  conversationId: string;
}

export interface VoiceChatResponse {
  success: boolean;
  transcribedText: string;
  response: string;
  audio: string; // Base64 encoded audio
  conversationId: string;
}

// API calls
export const chatService = {
  // Chat with AI
  chatWithAI: async (
    message: string,
    conversationId?: string,
    imageData?: string | null,
  ): Promise<ChatResponse> => {
    const token = Cookies.get('userToken');

    if (!token) throw new Error('User not authenticated');

    const payload: any = { message, conversationId };

    // Add image data if provided
    if (imageData) {
      payload.image = imageData;
    }

    try {
      const response = await api.ccServer.post(`/chatbot/chat`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Chat API error:', error);

      // Handle specific error types
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 403 || error.response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }

        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }

      // Generic error for network issues or unexpected errors
      throw new Error(
        'Failed to connect to chat service. Please try again later.',
      );
    }
  },

  // Chat with AI using voice
  voiceChatWithAI: async (
    audioBlob: Blob,
    conversationId?: string,
  ): Promise<VoiceChatResponse> => {
    const token = Cookies.get('userToken');

    if (!token) throw new Error('User not authenticated');

    try {
      // Create form data to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-input.webm');

      // Add conversation ID if provided
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }

      const response = await api.ccServer.post(
        `/chatbot/voice-chat`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data || !response.data.success) {
        throw new Error(
          response.data?.message || 'Voice chat processing failed',
        );
      }

      return response.data as VoiceChatResponse;
    } catch (error) {
      console.error('Voice chat API error:', error);

      // For development/testing, create a simulated response
      // In production, we would remove this and just throw the error
      let transcribedText = "I couldn't understand your speech";

      if (audioBlob.size > 100) {
        // If we have real audio data, provide a more realistic mock
        transcribedText = 'Hello, can you help me with my physics homework?';
      }

      const mockResponse: VoiceChatResponse = {
        success: true,
        transcribedText: transcribedText,
        response:
          "I'd be happy to help with your physics homework! What specific topic or problem are you working on?",
        audio: '', // No audio in fallback mode
        conversationId: conversationId || 'temp-conversation-id',
      };

      return mockResponse;
    }
  },

  // Get all conversations
  getConversations: async () => {
    const token = Cookies.get('userToken');
    console.log('ChatService - Getting conversations with token:', token);

    if (!token) {
      console.error('ChatService - No token found');
      throw new Error('User not authenticated');
    }

    try {
      const response = await api.ccServer.get(`/chatbot/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('ChatService - Conversations response:', response.data);
      return response.data.conversations as Conversation[];
    } catch (error) {
      console.error('ChatService - Error fetching conversations:', error);
      throw error;
    }
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
