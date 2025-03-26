import Cookies from 'js-cookie';
import { api } from '~api';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string;
}

class NoteService {
  // Get all notes for the current user
  async getUserNotes(): Promise<Note[]> {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('User not authenticated');

      const response = await api.ccServer.get('/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }

  // Get a specific note by ID
  async getNoteById(noteId: string): Promise<Note> {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('User not authenticated');

      const response = await api.ccServer.get(`/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  }

  // Create a new note
  async createNote(data: { title?: string; content?: string }): Promise<Note> {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('User not authenticated');

      const response = await api.ccServer.post('/notes', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  // Update a note
  async updateNote(
    noteId: string,
    data: { title?: string; content?: string },
  ): Promise<Note> {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('User not authenticated');

      const response = await api.ccServer.put(`/notes/${noteId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  // Delete a note
  async deleteNote(noteId: string): Promise<{ message: string }> {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('User not authenticated');

      const response = await api.ccServer.delete(`/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}

export const noteService = new NoteService();
