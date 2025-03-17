import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import styles from './FormattedMessage.module.scss';
import { Components } from 'react-markdown';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
}) => {
  // Preprocess content to handle edge cases
  const preprocessContent = (text: string) => {
    let processed = text;

    // Convert LaTeX-style math to markdown-compatible format
    // Convert \[ ... \] to $$...$$
    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$1$$');

    // Convert \( ... \) to $...$
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$');

    // Fix inline math expressions that are broken across lines
    processed = processed.replace(/(\$[^$\n]+)(?:\n)([^$\n]+\$)/g, '$1 $2');

    // Improve subscript/superscript handling
    // Ensure proper spacing around subscripts and superscripts
    processed = processed.replace(
      /([a-zA-Z])(_|\^)(\{[^}]+\}|[a-zA-Z0-9])/g,
      '$1 $2$3',
    );

    // Ensure v_0^2 or similar patterns are properly formatted
    processed = processed.replace(/v_0\^2/g, 'v_{0}^{2}');
    processed = processed.replace(/v\^2_0/g, 'v^{2}_{0}');

    // Fix common physics subscript patterns
    processed = processed.replace(/([a-zA-Z])_([0-9])/g, '$1_{$2}');
    processed = processed.replace(/([a-zA-Z])\^([0-9])/g, '$1^{$2}');

    // Fix headers with no space after hash
    processed = processed.replace(/(^|\n)(#{1,6})([^\s#])/g, '$1$2 $3');

    // Ensure ordered lists have proper formatting
    processed = processed.replace(/(\n\s*)(\d+)\.(?!\s)/g, '$1$2. ');

    // Fix extra spacing between headers and lists
    processed = processed.replace(
      /(^|\n)(#{1,6}[^\n]+)\n+(\s*[-*+]|\s*\d+\.)/g,
      '$1$2\n$3',
    );

    // Fix spacing in ordered lists
    processed = processed.replace(/(\n\s*)(\d+\.\s+)([^\n]+)/g, '$1$2$3');

    return processed;
  };

  // Define components object separately with type assertion
  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 className={styles.heading1} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className={styles.heading2} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className={styles.heading3} {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 className={styles.heading4} {...props} />
    ),
    h5: ({ node, ...props }: any) => (
      <h5 className={styles.heading5} {...props} />
    ),
    h6: ({ node, ...props }: any) => (
      <h6 className={styles.heading6} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (inline) {
        return (
          <code className={styles.inlineCode} {...props}>
            {children}
          </code>
        );
      }

      return (
        <div className={styles.codeBlockWrapper}>
          {language && <div className={styles.codeLanguage}>{language}</div>}
          <SyntaxHighlighter
            language={language || 'text'}
            style={vscDarkPlus as any}
            PreTag="div"
            className={styles.codeBlock}
            showLineNumbers={language !== 'text' && language !== ''}
            wrapLongLines={true}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
    strong: ({ node, ...props }: any) => (
      <strong className={styles.boldText} {...props} />
    ),
    em: ({ node, ...props }: any) => (
      <em className={styles.italicText} {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className={styles.orderedList} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className={styles.unorderedList} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className={styles.listItem} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className={styles.paragraph} {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className={styles.blockquote} {...props} />
    ),
    div: ({ node, ...props }: any) => {
      // Check if this is a math block (katex-display class added by rehype-katex)
      if (props.className?.includes('katex-display')) {
        return (
          <div
            className={`${props.className} ${styles.mathBlock}`}
            {...props}
          />
        );
      }
      return <div {...props} />;
    },
  } as Components;

  return (
    <div className={styles.formattedMessage}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {preprocessContent(content)}
      </ReactMarkdown>
    </div>
  );
};
