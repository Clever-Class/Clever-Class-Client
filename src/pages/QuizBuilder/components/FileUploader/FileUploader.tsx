import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './FileUploader.module.scss';

// Define interface locally
interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onFileUpload(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onFileUpload(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <motion.div
      className={`${styles.uploadContainer} ${
        dragActive ? styles.dragActive : ''
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    >
      <input
        ref={inputRef}
        type="file"
        className={styles.hiddenInput}
        accept=".pdf"
        onChange={handleChange}
        aria-label="Upload PDF file"
      />

      {selectedFile ? (
        <div className={styles.fileInfo}>
          <motion.div
            className={styles.fileIconWrapper}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FileText className={styles.uploadIcon} />
          </motion.div>
          <motion.p
            className={styles.fileName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {selectedFile.name}
          </motion.p>
          <motion.p
            className={styles.fileSize}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </motion.p>
          <motion.button
            type="button"
            className={styles.upgradeButton}
            onClick={handleButtonClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Choose a different file
          </motion.button>
        </div>
      ) : (
        <div className={styles.uploadContent}>
          <motion.div
            className={styles.iconWrapper}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Upload className={styles.uploadIcon} />
          </motion.div>
          <motion.p
            className={styles.uploadTitle}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Drag & drop your PDF file here
          </motion.p>
          <motion.p
            className={styles.uploadDescription}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            or use the button below to browse files
          </motion.p>
          <motion.button
            type="button"
            className={styles.upgradeButton}
            onClick={handleButtonClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Browse Files
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
