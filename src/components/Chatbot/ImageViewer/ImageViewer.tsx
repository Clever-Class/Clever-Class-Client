import { memo } from 'react';
import styles from './ImageViewer.module.scss';

interface ImageViewerProps {
  imageSrc: string | null;
  onClose: () => void;
}

const ImageViewer = memo(({ imageSrc, onClose }: ImageViewerProps) => {
  if (!imageSrc) return null;

  return (
    <div className={styles.imageViewerOverlay} onClick={onClose}>
      <div className={styles.imageViewer}>
        <img src={imageSrc} alt="Enlarged view" />
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close image view"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
