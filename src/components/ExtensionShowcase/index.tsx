import React, { useEffect, useRef, useState } from 'react';
import styles from './ExtensionShowcase.module.scss';
import AddExtensionIcon from '../../assets/images/AddExtensionIcon';
import { 
  IoNotifications, 
  IoSettings, 
  IoFlash, 
  IoDocumentText,
  IoChatbubbles,
  IoCamera,
  IoBook
} from 'react-icons/io5';

export interface ExtensionShowcaseProps {
  className?: string;
}

const ExtensionShowcase: React.FC<ExtensionShowcaseProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Add a small debounce to prevent rapid triggering
        timeoutRef.current = setTimeout(() => {
          setIsVisible(entry.isIntersecting);
        }, 100);
      },
      {
        threshold: 0.3, // Trigger when 30% of component is visible
        rootMargin: '-50px 0px', // Add some margin for better timing
      }
    );

    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <div 
      ref={showcaseRef}
      className={`${styles.extensionShowcase} ${className || ''}`}
    >
      {/* Browser Window */}
      <div className={styles.browserWindow}>
        {/* Browser Header */}
        <div className={styles.browserHeader}>
          <div className={styles.browserControls}>
            <div className={styles.controlButton}></div>
            <div className={styles.controlButton}></div>
            <div className={styles.controlButton}></div>
          </div>
          <div className={styles.addressBar}>
            <div className={styles.addressBarContent}>
              <div className={styles.secureIcon}>🔒</div>
              <span className={styles.url}>classroom.youcanvas.com/u/0/c/NjA4NjE1...</span>
            </div>
          </div>
          <div className={styles.browserActions}>
            <div className={styles.extensionIcon}>
              <div className={`${styles.cleverClassIcon} ${isVisible ? styles.animate : ''}`}>It</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <div className={styles.courseName}>Advanced Mathematics</div>
            <div className={styles.assignment}>Quiz #3 - Calculus Integration</div>
          </div>

          <div className={styles.question}>
            <div className={styles.questionNumber}>Question 3</div>
            <div className={styles.questionText}>
              Find the derivative of f(x) = 3x³ + 2x² - 5x + 1
            </div>
            <div className={styles.options}>
              <div className={styles.option}>A. 9x² + 4x - 5</div>
              <div className={styles.option}>B. 6x² + 4x - 5</div>
              <div className={styles.option}>C. 9x² + 2x - 5</div>
              <div className={styles.option}>D. 3x² + 4x - 5</div>
            </div>
          </div>
        </div>

        {/* Extension Interface Overlay */}
        <div className={`${styles.extensionInterface} ${isVisible ? styles.animate : ''}`}>
          <div className={styles.extensionHeader}>
            <div className={styles.notificationIcon}>
              <IoNotifications />
            </div>
            <div className={styles.extensionTitle}>
              Itranscript
            </div>
            <div className={styles.settingsIcon}>
              <IoSettings />
            </div>
          </div>

          <div className={styles.extensionContent}>
            <div className={styles.featureButtons}>
              <div className={`${styles.featureButton} ${styles.active}`}>
                <div className={styles.featureButtonIcon}>It</div>
                <div className={styles.featureButtonName}>Magic</div>
                <div className={styles.featureButtonStatus}>Showing</div>
              </div>
              <div className={`${styles.featureButton} ${styles.inactive}`}>
                <div className={styles.featureButtonIcon}><IoDocumentText /></div>
                <div className={styles.featureButtonName}>Text Select</div>
                <div className={styles.featureButtonStatus}>Disabled</div>
              </div>
            </div>

            <div className={styles.toolsCircles}>
              <div className={styles.toolCircle}>
                <div className={`${styles.toolCircleIcon} ${styles.aiChat}`}>
                  <IoChatbubbles />
                </div>
                <div className={styles.toolCircleName}>AI Chat</div>
              </div>
              <div className={styles.toolCircle}>
                <div className={`${styles.toolCircleIcon} ${styles.snapshot}`}>
                  <IoCamera />
                </div>
                <div className={styles.toolCircleName}>Snapshot</div>
              </div>
              <div className={styles.toolCircle}>
                <div className={`${styles.toolCircleIcon} ${styles.notebook}`}>
                  <IoBook />
                </div>
                <div className={styles.toolCircleName}>Notebook</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionShowcase; 