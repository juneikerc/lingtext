import React, { useMemo } from "react";

import {
  ReaderContentShell,
  ReaderEmptyState,
  ReaderHelpFloatingLink,
  ReaderModeIndicator,
  ReaderProgressFooter,
} from "./ReaderLayout";
import ReaderWordTokens from "./ReaderWordTokens";

interface MarkdownReaderTextProps {
  content: string;
  unknownSet: Set<string>;
  phrases: string[][];
  onWordClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export default function MarkdownReaderText({
  content,
  unknownSet,
  phrases,
  onWordClick,
}: MarkdownReaderTextProps) {
  // Guard against undefined content
  if (!content) {
    return <ReaderEmptyState />;
  }

  const parsedContent = useMemo(() => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let inList = false;
    let listItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${i}`}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto"
            >
              <code className="text-sm font-mono">{codeContent.trim()}</code>
            </pre>
          );
          codeContent = "";
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        continue;
      }

      // Lists
      if (line.match(/^[-*+]\s+/)) {
        const listItem = line.replace(/^[-*+]\s+/, "");
        listItems.push(listItem);
        inList = true;

        // Check if next line is not a list item
        if (i === lines.length - 1 || !lines[i + 1].match(/^[-*+]\s+/)) {
          elements.push(
            <ul
              key={`list-${i}`}
              className="list-disc list-inside my-4 space-y-2"
            >
              {listItems.map((item, idx) => (
                <li key={idx} className="ml-4">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        continue;
      }

      // Headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        const sizeClasses = [
          "text-3xl font-bold",
          "text-2xl font-bold",
          "text-xl font-semibold",
          "text-lg font-semibold",
          "text-base font-medium",
          "text-sm font-medium",
        ];

        const headerElement = React.createElement(
          `h${level}`,
          {
            key: `h${level}-${i}`,
            className: `${sizeClasses[level - 1]} my-4`,
          },
          renderInlineMarkdown(text)
        );

        elements.push(headerElement);
        continue;
      }

      // Blockquotes
      if (line.startsWith(">")) {
        const quoteText = line.substring(1).trim();
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 dark:text-gray-300"
          >
            {renderInlineMarkdown(quoteText)}
          </blockquote>
        );
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+$|^\*\*\*+$|^___+$/)) {
        elements.push(
          <hr
            key={`hr-${i}`}
            className="my-6 border-gray-300 dark:border-gray-600"
          />
        );
        continue;
      }

      // Regular paragraphs
      if (line.trim()) {
        elements.push(
          <p key={`p-${i}`} className="mb-4">
            {renderInlineMarkdown(line)}
          </p>
        );
      } else if (i > 0 && lines[i - 1].trim()) {
        // Empty line for spacing
        elements.push(<div key={`space-${i}`} className="h-0" />);
      }
    }

    // Render inline markdown (bold, italic, links, code)
    function renderInlineMarkdown(text: string): React.ReactNode[] {
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let keyCounter = 0;

      while (remaining) {
        let matched = false;

        // Inline code
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          parts.push(
            <code
              key={`inline-code-${keyCounter++}`}
              className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono"
            >
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.substring(codeMatch[0].length);
          matched = true;
          continue;
        }

        // Bold
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          const tokenKey = `bold-${keyCounter++}`;
          parts.push(
            <strong key={tokenKey}>
              <ReaderWordTokens
                text={boldMatch[1]}
                unknownSet={unknownSet}
                phrases={phrases}
                onWordClick={onWordClick}
                keyPrefix={tokenKey}
              />
            </strong>
          );
          remaining = remaining.substring(boldMatch[0].length);
          matched = true;
          continue;
        }

        // Italic
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
          const tokenKey = `italic-${keyCounter++}`;
          parts.push(
            <em key={tokenKey}>
              <ReaderWordTokens
                text={italicMatch[1]}
                unknownSet={unknownSet}
                phrases={phrases}
                onWordClick={onWordClick}
                keyPrefix={tokenKey}
              />
            </em>
          );
          remaining = remaining.substring(italicMatch[0].length);
          matched = true;
          continue;
        }

        // Links
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const tokenKey = `link-${keyCounter++}`;
          parts.push(
            <a
              key={tokenKey}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
            >
              <ReaderWordTokens
                text={linkMatch[1]}
                unknownSet={unknownSet}
                phrases={phrases}
                onWordClick={onWordClick}
                keyPrefix={tokenKey}
              />
            </a>
          );
          remaining = remaining.substring(linkMatch[0].length);
          matched = true;
          continue;
        }

        // Regular text until next markdown element
        if (!matched) {
          const nextSpecial = remaining.search(/`|\*\*|\*|\[/);
          const chunk =
            nextSpecial === -1
              ? remaining
              : remaining.substring(0, nextSpecial);
          if (chunk) {
            const tokenKey = `text-${keyCounter++}`;
            parts.push(
              <ReaderWordTokens
                key={tokenKey}
                text={chunk}
                unknownSet={unknownSet}
                phrases={phrases}
                onWordClick={onWordClick}
                keyPrefix={tokenKey}
              />
            );
            remaining = remaining.substring(chunk.length);
          } else {
            // Single character that didn't match any pattern
            parts.push(remaining[0]);
            remaining = remaining.substring(1);
          }
        }
      }

      return parts;
    }

    return elements;
  }, [content, phrases, unknownSet, onWordClick]);

  return (
    <div className="relative">
      {/* Indicador de modo de lectura */}
      <ReaderModeIndicator />

      {/* Área de texto principal */}
      <ReaderContentShell contentClassName="prose prose-lg dark:prose-invert max-w-none">
        {parsedContent}
      </ReaderContentShell>

      {/* Información del progreso */}
      <ReaderProgressFooter unknownCount={unknownSet.size} />
      <ReaderHelpFloatingLink />
    </div>
  );
}
