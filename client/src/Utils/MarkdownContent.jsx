import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React, { useState } from "react";
import {
    Check,
    Copy,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";


function CodeBlock({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeValue = String(children).replace(/\n$/, "");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeValue);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code: ", err);
        }
    };

    return (
        <div className="relative group rounded-xl overflow-hidden my-5 border border-slate-200/80 shadow-sm dark:border-slate-800">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-slate-300 select-none border-b border-slate-850">
                <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider">{language || "code"}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-lime-400" />
                            <span className="text-lime-400 font-semibold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy code</span>
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={language || "javascript"}
                PreTag="div"
                customStyle={{
                    borderRadius: "0",
                    padding: "16px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    margin: "0",
                    backgroundColor: "#0d0e12",
                    fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
                {...props}
            >
                {codeValue}
            </SyntaxHighlighter>
        </div>
    );
}

function MarkdownContent({ content, role }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: ({ children }) => <h1 className="text-xl font-bold text-slate-900 mt-5 mb-2.5 font-sans first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-slate-900 mt-4 mb-2 font-sans first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold text-slate-900 mt-3.5 mb-1.5 font-sans first:mt-0">{children}</h3>,
                h4: ({ children }) => <h4 className="text-sm font-bold text-slate-800 mt-3 mb-1 font-sans first:mt-0">{children}</h4>,
                p: ({ children }) => <p className="mb-3 leading-relaxed text-[15px] text-slate-800 font-sans last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-[15px] text-slate-800 marker:text-slate-400 font-sans">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-[15px] text-slate-800 marker:text-slate-400 font-sans">{children}</ol>,
                li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className="text-lime-600 hover:text-lime-700 transition-colors font-medium hover:underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                ),
                strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-slate-300 pl-4 my-4 italic text-slate-650 bg-slate-50 py-2 pr-4 rounded-r-lg">
                        {children}
                    </blockquote>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-5 rounded-xl border border-slate-250 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse text-[14px]">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                        {children}
                    </thead>
                ),
                tbody: ({ children }) => (
                    <tbody className="divide-y divide-slate-150 bg-white">
                        {children}
                    </tbody>
                ),
                tr: ({ children }) => (
                    <tr className="hover:bg-slate-50/50 transition-colors odd:bg-white even:bg-slate-50/20">
                        {children}
                    </tr>
                ),
                th: ({ children }) => (
                    <th className="px-4 py-3 font-semibold text-slate-900 border-b border-slate-200">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="px-4 py-3 text-slate-700 font-normal">
                        {children}
                    </td>
                ),
                code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;

                    return !isInline ? (
                        <CodeBlock className={className} {...props}>
                            {children}
                        </CodeBlock>
                    ) : (
                        <code
                            className={
                                role === "user"
                                    ? "bg-lime-500/20 px-1.5 py-0.5 rounded text-black font-semibold font-mono text-[13px]"
                                    : "bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[13px] border border-slate-200"
                            }
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                br: () => <br className="my-1" />,
                hr: () => <hr className="my-6 border-slate-200" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

export { MarkdownContent };