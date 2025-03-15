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
    // First, split content by math and code blocks
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

      // Process regular text segments
      return (
        <React.Fragment key={index}>
          {processTextWithLists(segment)}
        </React.Fragment>
      );
    });
  };

  // Process text, including lists
  const processTextWithLists = (text: string) => {
    // Split text into chunks based on double newlines (paragraph breaks)
    const paragraphs = text.split(/\n\s*\n/);

    return paragraphs.map((paragraph, paragraphIndex) => {
      // Check if this is a list (starts with * or -) or ordered list (starts with 1., 2., etc.)
      if (/^(?:\s*[-*+]|\s*\d+\.)\s+/.test(paragraph.trim())) {
        return processListItems(paragraph, paragraphIndex);
      }

      // Regular paragraph
      return (
        <p key={`p-${paragraphIndex}`}>
          {paragraph.split('\n').map((line, lineIndex) => (
            <React.Fragment key={`line-${paragraphIndex}-${lineIndex}`}>
              {processMarkdown(line)}
              {lineIndex < paragraph.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  // Process list items
  const processListItems = (paragraph: string, paragraphIndex: number) => {
    const lines = paragraph.split('\n');
    const isOrderedList = /^\s*\d+\.\s+/.test(lines[0]);

    // Group the lines into list items (handling multi-line list items)
    const listItems: string[] = [];
    let currentItem = '';

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Check if this is a new list item
      if (
        isOrderedList
          ? /^\d+\.\s+/.test(trimmedLine)
          : /^[-*+]\s+/.test(trimmedLine)
      ) {
        if (currentItem) {
          listItems.push(currentItem);
        }
        // Remove the list marker (* or 1. etc)
        currentItem = isOrderedList
          ? trimmedLine.replace(/^\d+\.\s+/, '')
          : trimmedLine.replace(/^[-*+]\s+/, '');
      } else if (trimmedLine) {
        // This is a continuation of the previous list item
        currentItem += ' ' + trimmedLine;
      }
    });

    // Add the last item
    if (currentItem) {
      listItems.push(currentItem);
    }

    // Render the appropriate list element
    const ListComponent = isOrderedList ? 'ol' : 'ul';

    return (
      <ListComponent key={`list-${paragraphIndex}`}>
        {listItems.map((item, itemIndex) => (
          <li key={`item-${paragraphIndex}-${itemIndex}`}>
            {processMarkdown(item)}
          </li>
        ))}
      </ListComponent>
    );
  };

  // Function to process Markdown-style formatting
  const processMarkdown = (text: string) => {
    const formattedContent = [];
    let lastIndex = 0;
    let currentIndex = 0;

    // Regular expression for bold (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;

    // Regular expression for italic (*text*)
    const italicRegex = /(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g;

    // Regular expression for inline code (`text`)
    const inlineCodeRegex = /`([^`]+)`/g;

    // Process bold text
    let boldMatch;
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      if (boldMatch.index > lastIndex) {
        formattedContent.push(text.substring(lastIndex, boldMatch.index));
      }

      formattedContent.push(
        <strong key={`bold-${currentIndex}`} className={styles.boldText}>
          {boldMatch[1]}
        </strong>,
      );

      lastIndex = boldMatch.index + boldMatch[0].length;
      currentIndex++;
    }

    // If there's no bold formatting or there's remaining text after the last bold match
    if (lastIndex === 0 || lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);

      // Process italic text in the remaining content
      const italicMatches = [...remainingText.matchAll(italicRegex)];

      if (italicMatches.length > 0) {
        let italicLastIndex = 0;

        italicMatches.forEach((italicMatch, i) => {
          if (italicMatch.index > italicLastIndex) {
            formattedContent.push(
              remainingText.substring(italicLastIndex, italicMatch.index),
            );
          }

          formattedContent.push(
            <em
              key={`italic-${currentIndex}-${i}`}
              className={styles.italicText}
            >
              {italicMatch[1]}
            </em>,
          );

          italicLastIndex = italicMatch.index + italicMatch[0].length;
        });

        if (italicLastIndex < remainingText.length) {
          // Process inline code in the remaining text
          const inlineCodeText = remainingText.substring(italicLastIndex);
          const codeMatches = [...inlineCodeText.matchAll(inlineCodeRegex)];

          if (codeMatches.length > 0) {
            let codeLastIndex = 0;

            codeMatches.forEach((codeMatch, i) => {
              if (codeMatch.index > codeLastIndex) {
                formattedContent.push(
                  inlineCodeText.substring(codeLastIndex, codeMatch.index),
                );
              }

              formattedContent.push(
                <code
                  key={`code-${currentIndex}-${i}`}
                  className={styles.inlineCode}
                >
                  {codeMatch[1]}
                </code>,
              );

              codeLastIndex = codeMatch.index + codeMatch[0].length;
            });

            if (codeLastIndex < inlineCodeText.length) {
              formattedContent.push(inlineCodeText.substring(codeLastIndex));
            }
          } else {
            formattedContent.push(inlineCodeText);
          }
        }
      } else {
        // Process inline code if no italic formatting
        const codeMatches = [...remainingText.matchAll(inlineCodeRegex)];

        if (codeMatches.length > 0) {
          let codeLastIndex = 0;

          codeMatches.forEach((codeMatch, i) => {
            if (codeMatch.index > codeLastIndex) {
              formattedContent.push(
                remainingText.substring(codeLastIndex, codeMatch.index),
              );
            }

            formattedContent.push(
              <code
                key={`code-${currentIndex}-${i}`}
                className={styles.inlineCode}
              >
                {codeMatch[1]}
              </code>,
            );

            codeLastIndex = codeMatch.index + codeMatch[0].length;
          });

          if (codeLastIndex < remainingText.length) {
            formattedContent.push(remainingText.substring(codeLastIndex));
          }
        } else {
          formattedContent.push(remainingText);
        }
      }
    }

    // If no Markdown was found, return the original text
    return formattedContent.length > 0 ? formattedContent : text;
  };

  return <div className={styles.formattedMessage}>{renderContent()}</div>;
};
