import React, { useMemo } from "react";
import { normalizeWord, tokenize } from "../../utils/tokenize";

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
  
  const renderWords = (text: string, keyPrefix = ''): React.ReactNode[] => {
    const tokens = tokenize(text);
    const isPhraseToken: boolean[] = new Array(tokens.length).fill(false);

    const tryMatch = (startIdx: number, parts: string[]): number[] | null => {
      const indices: number[] = [];
      let p = 0;
      let j = startIdx;
      while (j < tokens.length && p < parts.length) {
        if (!tokens[j].isWord) {
          j++;
          continue;
        }
        const low = tokens[j].lower || normalizeWord(tokens[j].text);
        if (low !== parts[p]) return null;
        indices.push(j);
        p++;
        j++;
      }
      return p === parts.length ? indices : null;
    };

    for (let i = 0; i < tokens.length; i++) {
      if (!tokens[i].isWord) continue;
      for (const parts of phrases) {
        if (parts.length < 2) continue;
        const startLow = tokens[i].lower || normalizeWord(tokens[i].text);
        if (startLow !== parts[0]) continue;
        const matchIdxs = tryMatch(i, parts);
        if (matchIdxs) {
          for (const idx of matchIdxs) isPhraseToken[idx] = true;
        }
      }
    }

    return tokens.map((t, tokenIndex) => {
      if (!t.isWord) {
        return <span key={`${keyPrefix}-${tokenIndex}`}>{t.text}</span>;
      }
      const low = t.lower || normalizeWord(t.text);
      const isUnknown = unknownSet.has(low);
      const isPhrasePart = isPhraseToken[tokenIndex] === true;
      
      return (
        <span
          key={`${keyPrefix}-${tokenIndex}`}
          className={`word-token relative inline-block px-1 py-0.5 mx-0.5 rounded-lg cursor-pointer transition-all duration-200 group ${
            isUnknown
              ? "bg-yellow-200 dark:bg-yellow-700/40 text-yellow-900 dark:text-yellow-100 font-semibold shadow-lg border border-yellow-300 dark:border-yellow-600"
              : "hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-900 dark:hover:text-blue-100 hover:shadow-md"
          } ${isPhrasePart ? "underline decoration-green-500 decoration-2 underline-offset-4" : ""}`}
          data-lower={low}
          data-word={t.text}
          data-phrase-part={isPhrasePart ? "true" : undefined}
          onClick={onWordClick}
        >
          {t.text}
          {!isUnknown && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Clic para traducir
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
            </span>
          )}
          {isUnknown && (
            <span className="absolute -top-2 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
          )}
        </span>
      );
    });
  };

  const parsedContent = useMemo(() => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';
  let inList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto">
            <code className="text-sm font-mono">{codeContent.trim()}</code>
          </pre>
        );
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Lists
    if (line.match(/^[-*+]\s+/)) {
      const listItem = line.replace(/^[-*+]\s+/, '');
      listItems.push(listItem);
      inList = true;
      
      // Check if next line is not a list item
      if (i === lines.length - 1 || !lines[i + 1].match(/^[-*+]\s+/)) {
        elements.push(
          <ul key={`list-${i}`} className="list-disc list-inside my-4 space-y-2">
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
        'text-3xl font-bold',
        'text-2xl font-bold', 
        'text-xl font-semibold',
        'text-lg font-semibold',
        'text-base font-medium',
        'text-sm font-medium'
      ];
      
      const headerElement = React.createElement(
        `h${level}`,
        {
          key: `h${level}-${i}`,
          className: `${sizeClasses[level - 1]} my-4`
        },
        renderInlineMarkdown(text)
      );
      
      elements.push(headerElement);
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const quoteText = line.substring(1).trim();
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 dark:text-gray-300">
          {renderInlineMarkdown(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$|^\*\*\*+$|^___+$/)) {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-gray-300 dark:border-gray-600" />);
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
      elements.push(<div key={`space-${i}`} className="h-4" />);
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
            <code key={`inline-code-${keyCounter++}`} className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">
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
          parts.push(
            <strong key={`bold-${keyCounter++}`}>
              {renderWords(boldMatch[1], `bold-${keyCounter}`)}
            </strong>
          );
          remaining = remaining.substring(boldMatch[0].length);
          matched = true;
          continue;
        }

        // Italic
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
          parts.push(
            <em key={`italic-${keyCounter++}`}>
              {renderWords(italicMatch[1], `italic-${keyCounter}`)}
            </em>
          );
          remaining = remaining.substring(italicMatch[0].length);
          matched = true;
          continue;
        }

        // Links
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a 
              key={`link-${keyCounter++}`}
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
            >
              {renderWords(linkMatch[1], `link-${keyCounter}`)}
            </a>
          );
          remaining = remaining.substring(linkMatch[0].length);
          matched = true;
          continue;
        }

        // Regular text until next markdown element
        if (!matched) {
          const nextSpecial = remaining.search(/`|\*\*|\*|\[/);
          const chunk = nextSpecial === -1 ? remaining : remaining.substring(0, nextSpecial);
          if (chunk) {
            parts.push(...renderWords(chunk, `text-${keyCounter++}`));
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
      <div className="absolute -top-6 left-0 right-0 flex justify-center">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-full px-4 py-2 text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Haz clic en cualquier palabra para traducirla</span>
        </div>
      </div>

      {/* Área de texto principal */}
      <div
        id="reader-text"
        className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-8 leading-relaxed text-lg sm:text-xl select-text bg-gradient-to-b from-transparent via-white/50 to-transparent"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none">
          {parsedContent}
        </div>
      </div>

      {/* Información del progreso */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Palabras conocidas</span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Palabras por aprender ({unknownSet.size})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
