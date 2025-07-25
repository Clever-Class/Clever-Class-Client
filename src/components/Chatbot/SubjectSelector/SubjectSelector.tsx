import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  HiClock,
  HiSquares2X2,
  HiBeaker,
  HiBookOpen,
  HiGlobeAlt,
  HiAcademicCap,
} from 'react-icons/hi2';
import { Subject } from '../types';
import styles from './SubjectSelector.module.scss';

interface SubjectSelectorProps {
  selectedSubject?: string | null;
  onSelectSubject?: (subject: string) => void;
  onSelect?: (subject: string) => void;
}

const subjects: Subject[] = [
  { icon: <HiClock />, label: 'History' },
  { icon: <HiSquares2X2 />, label: 'Math Tutor' },
  { icon: <HiBeaker />, label: 'Physics Guide' },
  { icon: <HiBookOpen />, label: 'Lit Analysis' },
  { icon: <HiGlobeAlt />, label: 'History Insights' },
  { icon: <HiAcademicCap />, label: 'Science Mentor' },
];

const SubjectSelector = memo(
  ({ selectedSubject, onSelectSubject, onSelect }: SubjectSelectorProps) => {
    // Use either onSelect or onSelectSubject callback
    const handleSubjectSelect = (subject: string) => {
      if (onSelect) {
        onSelect(subject);
      } else if (onSelectSubject) {
        onSelectSubject(subject);
      }
    };

    return (
      <div className={styles.subjectButtons}>
        {subjects.map((subject, index) => (
          <motion.button
            key={subject.label}
            className={`${styles.subjectButton} ${
              selectedSubject === subject.label ? styles.selected : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.05 + index * 0.03,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.15 },
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSubjectSelect(subject.label)}
          >
            {subject.icon}
            {subject.label}
          </motion.button>
        ))}
      </div>
    );
  },
);

SubjectSelector.displayName = 'SubjectSelector';

export default SubjectSelector;
