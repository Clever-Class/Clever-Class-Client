import styles from './teachertypechips.module.scss';

interface TeacherTypeChipsProps {
  onSelect: (type: string) => void;
  selectedType: string | null;
}

export function TeacherTypeChips({
  onSelect,
  selectedType,
}: TeacherTypeChipsProps) {
  const teacherTypes = [
    { id: 'math', label: 'Math Tutor', icon: '📐' },
    { id: 'physics', label: 'Physics Guide', icon: '⚛️' },
    { id: 'literature', label: 'Lit Analysis', icon: '📖' },
    { id: 'history', label: 'History Insights', icon: '🗺️' },
    { id: 'science', label: 'Science Mentor', icon: '🔍' },
  ];

  return (
    <div className={styles.chipContainer}>
      {teacherTypes.map((type) => (
        <button
          key={type.id}
          className={`${styles.chip} ${
            selectedType === type.id ? styles.selected : ''
          }`}
          onClick={() => onSelect(type.id)}
        >
          <span className={styles.icon}>{type.icon}</span>
          <span className={styles.label}>{type.label}</span>
        </button>
      ))}
    </div>
  );
}
