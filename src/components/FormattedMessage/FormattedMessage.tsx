import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import styles from './FormattedMessage.module.scss';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
}) => {
  const renderContent = () => {
    const segments = content.split(
      /(\$\$.*?\$\$|\$.*?\$|```.*?```|\\\[.*?\\\]|\\\(.*?\\\))/s,
    );

    return segments.map((segment, index) => {
      // Block math ($$...$$)
      if (segment.startsWith('$$') && segment.endsWith('$$')) {
        const math = segment.slice(2, -2).trim();
        return (
          <div key={index} className={styles.blockMath}>
            <BlockMath math={math} />
          </div>
        );
      }

      // Block math \[ ... \]
      if (segment.startsWith('\\[') && segment.endsWith('\\]')) {
        const math = segment.slice(2, -2).trim();
        return (
          <div key={index} className={styles.blockMath}>
            <BlockMath math={math} />
          </div>
        );
      }

      // Inline math \( ... \)
      if (segment.startsWith('\\(') && segment.endsWith('\\)')) {
        const math = segment.slice(2, -2).trim();
        return <InlineMath key={index} math={math} />;
      }

      // Inline math ($...$)
      if (segment.startsWith('$') && segment.endsWith('$')) {
        const math = segment.slice(1, -1).trim();
        return <InlineMath key={index} math={math} />;
      }

      // Code blocks (```...```)
      if (segment.startsWith('```') && segment.endsWith('```')) {
        const code = segment.slice(3, -3).trim();
        const [language, ...codeLines] = code.split('\n');
        const codeContent = codeLines.join('\n');

        return (
          <div key={index} className={styles.codeBlock}>
            {language && <div className={styles.codeLanguage}>{language}</div>}
            <pre>
              <code>{codeContent || language}</code>
            </pre>
          </div>
        );
      }

      // Regular text (with line breaks)
      return segment.split('\n').map((line, i) => (
        <React.Fragment key={`${index}-${i}`}>
          {line}
          {i < segment.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return <div className={styles.formattedMessage}>{renderContent()}</div>;
};
