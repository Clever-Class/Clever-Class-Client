import { useState, useRef, useEffect } from 'react';
import {
  History as HistoryIcon,
  Clock,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './History.module.scss';
import { Conversation } from '~/services/chatService';
import { chatService } from '~/services/chatService';
import toast from 'react-hot-toast';

interface HistoryProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  currentConversationId: string | null;
  refetchConversations: () => void;
}

export const History = ({
  conversations = [],
  onSelectConversation,
  currentConversationId,
  refetchConversations,
}: HistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Debug logging
  console.log('History component rendering', {
    conversationsCount: conversations.length,
    currentConversationId,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }

      // Close delete confirmation dialog if clicked outside
      if (
        deleteConfirmId &&
        confirmDialogRef.current &&
        !confirmDialogRef.current.contains(event.target as Node)
      ) {
        setDeleteConfirmId(null);
      }
    };

    if (isOpen || deleteConfirmId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, deleteConfirmId]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId);
    setIsOpen(false); // Close the panel on mobile after selection
  };

  // Show delete confirmation
  const handleShowDeleteConfirm = (
    conversationId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent triggering the parent click
    setDeleteConfirmId(conversationId);
  };

  // Delete a conversation
  const handleDeleteConversation = async (conversationId: string) => {
    if (isDeleting) return; // Prevent multiple clicks

    try {
      setIsDeleting(true);
      await chatService.deleteConversation(conversationId);

      // If the deleted conversation was the current one, reset the state
      if (conversationId === currentConversationId) {
        onSelectConversation('');
      }

      refetchConversations();
      toast.success('Conversation deleted');
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      toast.error('Failed to delete conversation');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null); // Close the confirmation dialog
    }
  };

  // Handle canceling deletion
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  // Get relative time string
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  // Animation variants for consistent animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  // Animation settings for panel
  const panelTransition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.85,
  };

  // Button animation settings
  const buttonRotateTransition = {
    duration: 0.25,
    ease: [0.2, 0.65, 0.3, 0.9],
  };

  // Icon animation settings
  const iconTransition = {
    duration: 0.15,
    ease: 'backOut',
  };

  // Add a helper function to find the conversation title
  const getConversationTitle = (id: string) => {
    const conversation = conversations.find((c) => c._id === id);
    return conversation ? conversation.title : 'Conversation';
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={`${styles.historyButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle history"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={buttonRotateTransition}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'close' : 'history'}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={iconTransition}
            >
              {isOpen ? <X size={24} /> : <HistoryIcon size={24} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={panelRef}
              className={styles.historyPanel}
              initial={{ opacity: 0, x: 280 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 280 }}
              transition={panelTransition}
            >
              <motion.div
                className={styles.historyHeader}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                >
                  Conversation History
                </motion.h3>
              </motion.div>

              <motion.div
                className={styles.historyList}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {conversations.length === 0 ? (
                  <motion.div
                    className={styles.noConversations}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    No conversations yet. Start chatting to create one!
                  </motion.div>
                ) : (
                  conversations.map((conversation, index) => (
                    <motion.div
                      key={conversation._id}
                      className={`${styles.historyItem} ${
                        currentConversationId === conversation._id
                          ? styles.active
                          : ''
                      }`}
                      variants={itemVariants}
                      whileHover={{
                        x: 4,
                        transition: { duration: 0.15 },
                      }}
                      onClick={() => handleSelectConversation(conversation._id)}
                    >
                      <div className={styles.historyIcon}>
                        <Clock size={18} />
                      </div>
                      <div className={styles.historyContent}>
                        <div className={styles.historyTitle}>
                          {conversation.title}
                        </div>
                        <div className={styles.historyTime}>
                          {getRelativeTime(conversation.updatedAt)}
                        </div>
                      </div>
                      <div className={styles.historyActions}>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) =>
                            handleShowDeleteConfirm(conversation._id, e)
                          }
                          aria-label="Delete conversation"
                          disabled={isDeleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog - Moved outside of history items */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className={styles.confirmationContainer}>
            <motion.div
              className={styles.globalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleCancelDelete}
            />
            <motion.div
              ref={confirmDialogRef}
              className={styles.globalConfirmDialog}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                duration: 0.2,
                type: 'spring',
                stiffness: 500,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.confirmIcon}>
                <AlertTriangle size={20} />
              </div>
              <div className={styles.confirmMessage}>
                <p>Are you sure you want to delete this conversation?</p>
                <strong className={styles.confirmTitle}>
                  {getConversationTitle(deleteConfirmId)}
                </strong>
              </div>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelButton}
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmButton}
                  onClick={() => handleDeleteConversation(deleteConfirmId)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
