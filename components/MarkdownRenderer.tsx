"use client";

import React from "react";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * Simple Markdown Renderer
 * Renders markdown content dengan styling yang baik
 * Support: headings, bold, italic, lists, code blocks, links, horizontal rules
 */
export default function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    const renderMarkdown = (text: string) => {
        const lines = text.split("\n");
        const elements: JSX.Element[] = [];
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeBlockLanguage = "";

        lines.forEach((line, index) => {
            // Code blocks
            if (line.trim().startsWith("```")) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLanguage = line.trim().substring(3).trim();
                    codeBlockContent = [];
                } else {
                    inCodeBlock = false;
                    elements.push(
                        <pre
                            key={`code-${index}`}
                            className="bg-muted p-4 rounded-lg overflow-x-auto my-4 border border-border"
                        >
                            <code
                                className={`text-sm ${
                                    codeBlockLanguage
                                        ? `language-${codeBlockLanguage}`
                                        : ""
                                }`}
                            >
                                {codeBlockContent.join("\n")}
                            </code>
                        </pre>
                    );
                    codeBlockContent = [];
                    codeBlockLanguage = "";
                }
                return;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                return;
            }

            // Horizontal rule
            if (line.trim() === "---" || line.trim() === "***") {
                elements.push(
                    <hr key={`hr-${index}`} className="my-6 border-border" />
                );
                return;
            }

            // Headings
            if (line.startsWith("# ")) {
                elements.push(
                    <h1
                        key={`h1-${index}`}
                        className="text-4xl font-heading font-bold mt-8 mb-4 text-balance"
                    >
                        {renderInlineMarkdown(line.substring(2))}
                    </h1>
                );
                return;
            }
            if (line.startsWith("## ")) {
                elements.push(
                    <h2
                        key={`h2-${index}`}
                        className="text-3xl font-heading font-bold mt-6 mb-3 text-balance"
                    >
                        {renderInlineMarkdown(line.substring(3))}
                    </h2>
                );
                return;
            }
            if (line.startsWith("### ")) {
                elements.push(
                    <h3
                        key={`h3-${index}`}
                        className="text-2xl font-heading font-semibold mt-5 mb-2 text-balance"
                    >
                        {renderInlineMarkdown(line.substring(4))}
                    </h3>
                );
                return;
            }
            if (line.startsWith("#### ")) {
                elements.push(
                    <h4
                        key={`h4-${index}`}
                        className="text-xl font-heading font-semibold mt-4 mb-2"
                    >
                        {renderInlineMarkdown(line.substring(5))}
                    </h4>
                );
                return;
            }

            // Unordered list
            if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                elements.push(
                    <li key={`li-${index}`} className="ml-6 my-2">
                        {renderInlineMarkdown(line.trim().substring(2))}
                    </li>
                );
                return;
            }

            // Ordered list
            const orderedListMatch = line.trim().match(/^(\d+)\.\s(.+)$/);
            if (orderedListMatch) {
                elements.push(
                    <li key={`oli-${index}`} className="ml-6 my-2 list-decimal">
                        {renderInlineMarkdown(orderedListMatch[2])}
                    </li>
                );
                return;
            }

            // Blockquote
            if (line.trim().startsWith("> ")) {
                elements.push(
                    <blockquote
                        key={`quote-${index}`}
                        className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                    >
                        {renderInlineMarkdown(line.trim().substring(2))}
                    </blockquote>
                );
                return;
            }

            // Regular paragraph (skip empty lines)
            if (line.trim()) {
                elements.push(
                    <p key={`p-${index}`} className="my-4 text-pretty">
                        {renderInlineMarkdown(line)}
                    </p>
                );
            } else {
                elements.push(<br key={`br-${index}`} />);
            }
        });

        return elements;
    };

    const renderInlineMarkdown = (text: string): React.ReactNode => {
        let result: React.ReactNode[] = [];
        let currentText = text;
        let key = 0;

        // Bold **text** or __text__
        const boldRegex = /(\*\*|__)(.*?)\1/g;
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push(
                    <span key={`text-${key++}`}>
                        {processItalicAndCode(
                            text.substring(lastIndex, match.index)
                        )}
                    </span>
                );
            }
            result.push(
                <strong key={`bold-${key++}`} className="font-bold">
                    {processItalicAndCode(match[2])}
                </strong>
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            result.push(
                <span key={`text-${key++}`}>
                    {processItalicAndCode(text.substring(lastIndex))}
                </span>
            );
        }

        return result.length > 0 ? result : text;
    };

    const processItalicAndCode = (text: string): React.ReactNode => {
        let result: React.ReactNode[] = [];
        let key = 0;

        // Italic *text* or _text_
        const italicRegex = /(\*|_)(.*?)\1/g;
        let lastIndex = 0;
        let match;

        while ((match = italicRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push(
                    <span key={`text-${key++}`}>
                        {processCode(text.substring(lastIndex, match.index))}
                    </span>
                );
            }
            result.push(
                <em key={`italic-${key++}`} className="italic">
                    {processCode(match[2])}
                </em>
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            result.push(
                <span key={`text-${key++}`}>
                    {processCode(text.substring(lastIndex))}
                </span>
            );
        }

        return result.length > 0 ? result : text;
    };

    const processCode = (text: string): React.ReactNode => {
        let result: React.ReactNode[] = [];
        let key = 0;

        // Inline code `code`
        const codeRegex = /`([^`]+)`/g;
        let lastIndex = 0;
        let match;

        while ((match = codeRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push(
                    <span key={`text-${key++}`}>
                        {processLinks(text.substring(lastIndex, match.index))}
                    </span>
                );
            }
            result.push(
                <code
                    key={`code-${key++}`}
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border"
                >
                    {match[1]}
                </code>
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            result.push(
                <span key={`text-${key++}`}>
                    {processLinks(text.substring(lastIndex))}
                </span>
            );
        }

        return result.length > 0 ? result : text;
    };

    const processLinks = (text: string): React.ReactNode => {
        let result: React.ReactNode[] = [];
        let key = 0;

        // Links [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push(
                    <span key={`text-${key++}`}>
                        {text.substring(lastIndex, match.index)}
                    </span>
                );
            }
            result.push(
                <a
                    key={`link-${key++}`}
                    href={match[2]}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {match[1]}
                </a>
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            result.push(
                <span key={`text-${key++}`}>{text.substring(lastIndex)}</span>
            );
        }

        return result.length > 0 ? result : text;
    };

    return (
        <div className={`markdown-content ${className}`}>
            {renderMarkdown(content)}
        </div>
    );
}
