import React from 'react';
import styles from './SectionTitle.module.scss';
import clsx from 'clsx';

interface SectionTitleProps {
  title: string;
  pill?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  pill,
  className,
}) => (
  <div className={clsx(styles.sectionTitleWrapper, className)}>
    <h2 className={styles.sectionGradientTitle}>{title}</h2>
    <div className={styles.decorativeLine}></div>
  </div>
);

export default SectionTitle;
