import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown } from 'react-icons/hi2';
import styles from './FaqSection.module.scss';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'What is Clever Class and how does it work?',
    answer:
      'Clever Class is an AI-powered learning assistant that helps you understand and learn from any educational content. It uses advanced AI to analyze your materials, provide explanations, generate practice questions, and create personalized study guides.',
  },
  {
    question: 'How can Clever Class help with my studies?',
    answer:
      'Clever Class enhances your learning by providing instant explanations, generating practice questions, creating summaries, and offering interactive study tools. It helps you better understand complex topics and retain information more effectively.',
  },
  {
    question: 'Is Clever Class compatible with my learning materials?',
    answer:
      'Yes! Clever Class works with various types of educational content including textbooks, lecture notes, articles, and online courses. It can process text, images, and even handwritten notes to provide comprehensive learning support.',
  },
  {
    question: 'What makes Clever Class different from other learning tools?',
    answer:
      'Clever Class combines advanced AI technology with a user-friendly interface to provide personalized learning experiences. It adapts to your learning style, offers real-time feedback, and helps you focus on areas where you need the most support.',
  },
  {
    question: 'How secure is my data with Clever Class?',
    answer:
      'We take data security seriously. All your data is encrypted, stored securely, and never shared with third parties. We comply with educational privacy standards and give you full control over your data.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Got questions?</span>
          <h2 className={styles.title}>Frequently asked questions</h2>
        </div>

        <div className={styles.faqList}>
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${
                openIndex === index ? styles.active : ''
              }`}
            >
              <button
                className={styles.faqButton}
                onClick={() => toggleFaq(index)}
                type="button"
              >
                <span className={styles.question}>{faq.question}</span>
                <motion.div
                  className={styles.icon}
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <HiChevronUp size={24} />
                  ) : (
                    <HiChevronDown size={24} />
                  )}
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    className={styles.answerWrapper}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2, ease: 'easeInOut' },
                    }}
                  >
                    <p className={styles.answer}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
