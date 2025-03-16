import { useState, useRef, memo, useCallback } from 'react';
import { HiPaperAirplane, HiXMark, HiPhoto } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { compressImage } from '../utils/imageUtils';
import styles from './InputContainer.module.scss';
import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';
import { chatService } from '~/services/chatService';

interface InputContainerProps {
  inChat: boolean;
  message: string;
  setMessage: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isLoading?: boolean;
  onImageAttach?: (imageData: string | null) => void;
  onVoiceMessageReceived?: (
    text: string,
    audioBase64: string,
    aiResponse: string,
  ) => void;
  currentConversationId?: string | null;
}

const InputContainer = memo(
  ({
    inChat = false,
    message,
    setMessage,
    handleKeyPress,
    handleSendMessage,
    inputRef,
    isLoading,
    onImageAttach,
    onVoiceMessageReceived,
    currentConversationId,
  }: InputContainerProps) => {
    const animationKey = inChat ? 'chat-input' : 'welcome-input';
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);

    // Function to handle voice recording completion
    const handleVoiceRecordingComplete = useCallback(
      async (audioBlob: Blob) => {
        if (!onVoiceMessageReceived) return;

        try {
          setIsProcessingVoice(true);
          toast.loading('Processing your voice message...', {
            id: 'voice-processing',
          });

          // Send the audio to the server for processing
          const response = await chatService.voiceChatWithAI(
            audioBlob,
            currentConversationId || undefined,
          );

          // Notify the parent component about the transcribed text, AI response text, and audio
          onVoiceMessageReceived(
            response.transcribedText,
            response.audio,
            response.response, // Pass the AI's text response
          );

          toast.dismiss('voice-processing');
          toast.success('Voice message processed');
        } catch (error) {
          console.error('Failed to process voice message:', error);
          toast.dismiss('voice-processing');
          toast.error('Failed to process voice message');

          // In case of error, still call onVoiceMessageReceived with an empty message
          // so the UI can show an error message
          if (onVoiceMessageReceived) {
            onVoiceMessageReceived(
              "I couldn't transcribe your message",
              '', // No audio in error case
              'Sorry, I encountered an error processing your voice message.', // Error message as AI response
            );
          }
        } finally {
          setIsProcessingVoice(false);
        }
      },
      [onVoiceMessageReceived, currentConversationId],
    );

    // Function to handle image processing
    const processImage = async (imageData: string) => {
      try {
        const loadingToast = toast.loading('Optimizing image...');
        const compressedImage = await compressImage(imageData, 800, 0.7);
        toast.dismiss(loadingToast);
        setAttachedImage(compressedImage);
        if (onImageAttach) {
          onImageAttach(compressedImage);
        }
      } catch (error) {
        toast.error('Failed to process image');
        console.error('Image processing error:', error);
      }
    };

    // Handle drag and drop events
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          processImage(imageData);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please drop an image file');
      }
    };

    // Handle paste event
    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            if (file.size > 5 * 1024 * 1024) {
              toast.error('Image size should be less than 5MB');
              return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
              const imageData = event.target?.result as string;
              processImage(imageData);
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        if (!file.type.startsWith('image/')) {
          toast.error('Only image files are allowed');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          processImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    };

    // Handle removing attached image
    const handleRemoveImage = () => {
      setAttachedImage(null);
      if (onImageAttach) {
        onImageAttach(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // Handle sending message with image
    const handleSendWithImage = () => {
      handleSendMessage();
      setAttachedImage(null);
      if (onImageAttach) {
        onImageAttach(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <motion.div
        key={animationKey}
        className={`${styles.inputContainer} ${
          isDragging ? styles.dragging : ''
        }`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: inChat ? 0.2 : 0.15,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          transition: { duration: 0.2 },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image preview area */}
        {attachedImage && (
          <div className={styles.imagePreview}>
            <img src={attachedImage} alt="Attached" />
            <motion.button
              className={styles.removeImageBtn}
              onClick={handleRemoveImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiXMark size={16} />
            </motion.button>
          </div>
        )}

        <textarea
          ref={inputRef}
          className={styles.messageInput}
          placeholder={
            inChat
              ? 'Type your message, paste an image, or use voice input...'
              : 'Message Your Clever AI Tutor, paste an image, or use voice input...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          rows={Math.min(Math.max(2, Math.ceil(message.split('\n').length)), 4)}
          disabled={isLoading || isProcessingVoice}
        />
        <div
          className={`${styles.inputActions} ${inChat ? styles.inChat : ''}`}
        >
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecordingComplete}
            isLoading={isLoading || isProcessingVoice}
          />

          <motion.button
            aria-label="Attach image"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isProcessingVoice}
          >
            <HiPhoto size={18} />
          </motion.button>
          <input
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
            onChange={handleFileInputChange}
            accept="image/*"
            aria-label="Upload image"
          />
          <motion.button
            className={styles.sendButton}
            onClick={attachedImage ? handleSendWithImage : handleSendMessage}
            aria-label="Send message"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={
              isLoading ||
              isProcessingVoice ||
              (!message.trim() && !attachedImage)
            }
          >
            {inChat ? (
              <HiPaperAirplane size={16} />
            ) : (
              <>
                <span>Send</span>
                <HiPaperAirplane size={16} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  },
);

InputContainer.displayName = 'InputContainer';

export default InputContainer;
