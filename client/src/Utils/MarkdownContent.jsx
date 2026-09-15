import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React, { useMemo } from "react";
import {
    Check,
    Copy,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useClipboard } from "@/Utils/clipboard";

/**
 * Preprocesses raw LaTeX math strings into clean, human-readable Unicode expressions
 */
function cleanMathFormulas(text) {
    if (!text || typeof text !== "string") return "";
    return text
        .replace(/\\pm/g, "±")
        .replace(/\\times/g, "×")
        .replace(/\\cdot/g, "·")
        .replace(/\\le/g, "≤")
        .replace(/\\ge/g, "≥")
        .replace(/\\ne/g, "≠")
        .replace(/\\approx/g, "≈")
        .replace(/\\infty/g, "∞")
        .replace(/\\alpha/g, "α")
        .replace(/\\beta/g, "β")
        .replace(/\\theta/g, "θ")
        .replace(/\\pi/g, "π")
        .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
        .replace(/\[\s*([a-zA-Z0-9_{},^+\-*/=()\s±√.]+)\s*\]/g, (match, p1) => {
            if (p1.includes("=") || p1.includes("±") || p1.includes("√") || p1.includes("/")) {
                return `**${p1.trim()}**`;
            }
            return match;
        });
}

function CodeBlock({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeValue = String(children).replace(/\n$/, "");
    const { copied, copy } = useClipboard(2000);

    const handleCopy = () => {
        copy(codeValue);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden my-4 border border-slate-800 shadow-md bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] text-slate-300 select-none border-b border-slate-800">
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
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    style={oneDark}
                    language={language || "text"}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "#0d1117",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        fontFamily: "JetBrains Mono, Fira Code, monospace",
                    }}
                    wrapLongLines={false}
                    {...props}
                >
                    {codeValue}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

function MarkdownContent({ content, role }) {
    const isUser = role === "user";
    const processedContent = useMemo(() => cleanMathFormulas(content), [content]);

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: ({ children }) => (
                    <h1 className={`text-xl font-bold mt-5 mb-2.5 font-sans first:mt-0 ${isUser ? "text-white" : "text-slate-900"}`}>
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className={`text-lg font-bold mt-4 mb-2 font-sans first:mt-0 ${isUser ? "text-white" : "text-slate-900"}`}>
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className={`text-base font-bold mt-3.5 mb-1.5 font-sans first:mt-0 ${isUser ? "text-white" : "text-slate-900"}`}>
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className={`text-sm font-bold mt-3 mb-1 font-sans first:mt-0 ${isUser ? "text-white" : "text-slate-800"}`}>
                        {children}
                    </h4>
                ),
                p: ({ children }) => (
                    <p className={`mb-3 leading-relaxed text-[14.5px] font-sans last:mb-0 ${isUser ? "text-white" : "text-slate-800"}`}>
                        {children}
                    </p>
                ),
                ul: ({ children }) => (
                    <ul className={`list-disc pl-5 mb-3.5 space-y-1 text-[14.5px] font-sans ${isUser ? "text-white marker:text-white/80" : "text-slate-800 marker:text-slate-400"}`}>
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className={`list-decimal pl-5 mb-3.5 space-y-1 text-[14.5px] font-sans ${isUser ? "text-white marker:text-white/80" : "text-slate-800 marker:text-slate-400"}`}>
                        {children}
                    </ol>
                ),
                li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className={`${isUser ? "text-white underline" : "text-indigo-600 hover:text-indigo-700"} transition-colors font-medium hover:underline underline-offset-4`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                ),
                strong: ({ children }) => (
                    <strong className={`font-semibold ${isUser ? "text-white font-bold" : "text-slate-900"}`}>
                        {children}
                    </strong>
                ),
                em: ({ children }) => (
                    <em className={`italic ${isUser ? "text-white/90" : "text-slate-700"}`}>
                        {children}
                    </em>
                ),
                blockquote: ({ children }) => (
                    <blockquote className={`border-l-4 pl-4 my-4 italic py-2 pr-4 rounded-r-lg ${isUser ? "border-white/40 bg-white/10 text-white" : "border-indigo-300 bg-indigo-50/50 text-slate-700"}`}>
                        {children}
                    </blockquote>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-xl border border-slate-200/90 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse text-[13.5px]">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold text-xs tracking-wider uppercase select-none">
                        {children}
                    </thead>
                ),
                tbody: ({ children }) => (
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {children}
                    </tbody>
                ),
                tr: ({ children }) => (
                    <tr className="hover:bg-slate-50/60 transition-colors odd:bg-white even:bg-slate-50/30">
                        {children}
                    </tr>
                ),
                th: ({ children }) => (
                    <th className="px-4 py-3 font-semibold text-slate-800 text-left border-b border-slate-200">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="px-4 py-3 text-slate-700 align-top leading-relaxed border-b border-slate-100 last:border-b-0">
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
                                isUser
                                    ? "bg-white/20 text-white font-mono text-[13px] px-1.5 py-0.5 rounded-md font-medium"
                                    : "bg-slate-100 text-slate-800 font-mono text-[12.5px] px-1.5 py-0.5 rounded-md font-medium border border-slate-200/80 inline-block align-baseline"
                            }
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                br: () => <br className="my-1" />,
                hr: () => <hr className={`my-5 ${isUser ? "border-white/30" : "border-slate-200"}`} />,
            }}
        >
            {processedContent}
        </ReactMarkdown>
    );
}

export { MarkdownContent };