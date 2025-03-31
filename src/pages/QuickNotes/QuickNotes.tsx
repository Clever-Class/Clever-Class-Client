import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { debounce } from 'lodash';
import {
  FileText,
  Plus,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Save,
  Trash2,
  FileEdit,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

import { noteService } from '~/services/noteService';

import styles from './QuickNotes.module.scss';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string;
}

// Toolbar button component
const ToolbarButton = ({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title: string;
}) => (
  <button
    onClick={onClick}
    className={`${styles.toolbarButton} ${isActive ? styles.active : ''}`}
    title={title}
  >
    {icon}
  </button>
);

export const QuickNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('Untitled Note');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      StarterKit.configure({
        document: false,
        paragraph: false,
        bold: false,
        italic: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your notes here...',
      }),
    ],
    content: '',
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      debouncedSave(content);
    },
  });

  // Debounced save function for auto-saving
  const debouncedSave = useCallback(
    debounce((content: string, noteTitle?: string) => {
      if (selectedNote) {
        saveNote(content, noteTitle);
      }
    }, 1500),
    [selectedNote],
  );

  // Load all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Update editor content when selected note changes
  useEffect(() => {
    if (selectedNote && editor) {
      setTitle(selectedNote.title);
      editor.commands.setContent(selectedNote.content);
    }
  }, [selectedNote, editor]);

  // Display save message for 3 seconds
  useEffect(() => {
    if (saveMessage) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [saveMessage]);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const notesData = await noteService.getUserNotes();
      setNotes(notesData);

      // Select the most recently updated note if available
      // if (notesData.length > 0) {
      //   setSelectedNote(notesData[0]);
      // }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save the current note
  const saveNote = async (content: string, noteTitle?: string) => {
    try {
      setIsSaving(true);

      if (selectedNote) {
        // Update existing note
        const updatedNote = await noteService.updateNote(selectedNote._id, {
          title: noteTitle || title,
          content,
        });

        // Update notes list with the updated note
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === updatedNote._id ? updatedNote : note,
          ),
        );

        setSelectedNote(updatedNote);
      }
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Create a new note
  const createNewNote = async () => {
    try {
      setIsLoading(true);
      const newNote = await noteService.createNote({
        title: 'Untitled Note',
        content: '',
      });

      // Add new note to the list and select it
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setSelectedNote(newNote);
      setTitle('Untitled Note');

      if (editor) {
        editor.commands.setContent('');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create new note');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete the current note
  const deleteNote = async () => {
    if (!selectedNote) return;

    const confirm = window.confirm(
      'Are you sure you want to delete this note?',
    );
    if (!confirm) return;

    try {
      setIsLoading(true);
      await noteService.deleteNote(selectedNote._id);

      // Remove note from list
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== selectedNote._id),
      );

      // Select another note if available
      if (notes.length > 1) {
        const nextNote = notes.find((note) => note._id !== selectedNote._id);
        if (nextNote) {
          setSelectedNote(nextNote);
        } else {
          setSelectedNote(null);
          if (editor) {
            editor.commands.setContent('');
          }
        }
      } else {
        setSelectedNote(null);
        if (editor) {
          editor.commands.setContent('');
        }
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    } finally {
      setIsLoading(false);
    }
  };

  // Save note manually
  const handleManualSave = () => {
    if (editor && selectedNote) {
      const content = editor.getHTML();
      saveNote(content);
    }
  };

  // Update title and save
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Clear any existing timeout
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }

    // Set a new timeout to save after user stops typing
    titleDebounceRef.current = setTimeout(() => {
      if (selectedNote && editor) {
        const content = editor.getHTML();
        debouncedSave(content, newTitle);
      }
    }, 1000);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.quickNotesContainer}>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarHeader}>
          <h2>Quick Notes</h2>
          <button
            className={styles.newNoteButton}
            onClick={createNewNote}
            disabled={isLoading}
          >
            <Plus size={16} />
            New Note
          </button>
        </div>

        <div className={styles.notesList}>
          {isLoading && notes.length === 0 ? (
            <div className={styles.loading}>Loading notes...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : notes.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={48} opacity={0.6} />
              <p>No notes yet</p>
              <button onClick={createNewNote}>
                <Plus size={16} />
                Create your first note
              </button>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className={`${styles.noteItem} ${
                  selectedNote?._id === note._id ? styles.selectedNote : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <h3>
                  <FileText size={16} style={{ marginRight: '8px' }} />
                  {note.title}
                </h3>
                <p className={styles.noteDate}>
                  {new Date(note.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.editorContainer}>
        {selectedNote ? (
          <>
            <div className={styles.editorHeader}>
              <div className={styles.titleInputWrapper}>
                <FileEdit size={18} style={{ opacity: 0.7 }} />
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className={styles.titleInput}
                  placeholder="Note Title"
                />
              </div>

              <div className={styles.editorActions}>
                <button
                  className={styles.saveButton}
                  onClick={handleManualSave}
                  disabled={isSaving}
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={deleteNote}
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            {saveMessage && (
              <div
                className={`${styles.saveMessage} ${
                  saveMessage.includes('Failed') ? styles.error : styles.success
                }`}
              >
                {saveMessage}
              </div>
            )}

            <div className={styles.toolbar}>
              {editor && (
                <>
                  <div className={styles.toolbarGroup}>
                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      isActive={editor.isActive('bold')}
                      icon={<BoldIcon size={16} />}
                      title="Bold"
                    />
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      isActive={editor.isActive('italic')}
                      icon={<ItalicIcon size={16} />}
                      title="Italic"
                    />
                  </div>

                  <div className={styles.toolbarGroup}>
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                      isActive={editor.isActive('heading', { level: 1 })}
                      icon={<Heading1 size={16} />}
                      title="Heading 1"
                    />
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      isActive={editor.isActive('heading', { level: 2 })}
                      icon={<Heading2 size={16} />}
                      title="Heading 2"
                    />
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                      }
                      isActive={editor.isActive('heading', { level: 3 })}
                      icon={<Heading3 size={16} />}
                      title="Heading 3"
                    />
                  </div>

                  <div className={styles.toolbarGroup}>
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                      isActive={editor.isActive('bulletList')}
                      icon={<List size={16} />}
                      title="Bullet List"
                    />
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                      isActive={editor.isActive('orderedList')}
                      icon={<ListOrdered size={16} />}
                      title="Ordered List"
                    />
                  </div>
                </>
              )}
            </div>

            <div className={styles.editorContent}>
              <EditorContent editor={editor} className={styles.contentEditor} />
            </div>
          </>
        ) : (
          <div className={styles.noNoteSelected}>
            <FileText size={64} opacity={0.6} />
            <p>Select a note or create a new one</p>
            <button onClick={createNewNote}>
              <Plus size={16} />
              Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
