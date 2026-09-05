import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Send, Sparkles, Code2, MessageCircle, } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import HighlightComponent from "react-highlight";
const Highlight = HighlightComponent.default || HighlightComponent;

import { aiCodeHelper } from "@/Api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { theme } from "@/lib/theme";
import { customMessage } from "@/Utils/customMessage";
import { useData } from "@/context/DataContext";
import { ApiKeyModal } from "@/components/common/ApiKeyModal";
import { copyToClipboard } from "@/Utils/clipboard";

import ChatInput from "@/components/common/chat-input";

function PanelTitle({ title, subtitle }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: theme.colors.limeDim }}
                >
                    <MessageCircle className="w-5 h-5" style={{ color: theme.colors.dark }} />
                </div>
                <div className="min-w-0">
                    <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                        {title}
                    </CardTitle>
                    <p className="text-[13px] font-medium mt-1 line-clamp-1" style={{ color: theme.colors.darkGray }}>
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
}

function MarkdownMessage({ content, sender }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className={sender === "user" ? "text-blue-100 hover:underline" : "text-blue-600 hover:underline"}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                ),
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                blockquote: ({ children }) => (
                    <blockquote
                        className={`border-l-4 pl-3 italic my-2 opacity-80 ${sender === "user" ? "border-blue-200" : "border-blue-300"
                            }`}
                    >
                        {children}
                    </blockquote>
                ),
                code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;

                    return !isInline ? (
                        <div className="relative group rounded-xl overflow-hidden my-4">
                            <div className="flex items-center justify-between px-4 py-2" style={{ background: "#111827" }}>
                                <span className="text-xs font-semibold text-white">{match[1]}</span>
                                <button
                                    onClick={async () => {
                                        const ok = await copyToClipboard(String(children).replace(/\n$/, ""));
                                        if (ok) customMessage({ type: "success", content: "Code copied to clipboard!" });
                                    }}
                                    className="text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    Copy
                                </button>
                            </div>
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    borderRadius: "0 0 8px 8px",
                                    padding: "12px",
                                    fontSize: "13px",
                                    margin: "0",
                                    backgroundColor: "#0d1117",
                                    border: "1px solid #1f2937",
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code
                            className={
                                sender === "user"
                                    ? "bg-blue-700 bg-opacity-40 px-2 py-1 rounded text-blue-100 text-sm font-mono"
                                    : "bg-zinc-700 bg-opacity-50 px-2 py-1 rounded text-orange-300 text-sm font-mono"
                            }
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                br: () => <br className="my-1" />,
                hr: () => <hr className="my-3 border-slate-300 dark:border-slate-600" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

export function AICodeHelper({ isOpen, onClose, title, code, section }) {
    const { user } = useData();
    const [copied, setCopied] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Code Helper. Ask me anything about this code.", sender: "bot" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && user && !user.apiKey) {
            setShowApiKeyModal(true);
        }
    }, [isOpen, user]);

    const displayCode = Array.isArray(code)
        ? code.map(item => `// --- ${item.languageName} ---\n${item.code}`).join('\n\n')
        : code || "";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);

        const context = {
            message: inputValue,
            code: displayCode,
            section: section,
            question: title,
        };

        try {
            const res = await aiCodeHelper(context);
            if (!res.data.message) {
                return customMessage({
                    type: "error",
                    content: `${res.data.message} !`
                });
            }
            setTimeout(() => {
                const botMessage = {
                    id: messages.length + 2,
                    text: res.data.data || "Sorry, I couldn't understand that. Could you please rephrase?",
                    sender: "bot",
                };
                setMessages((prev) => [...prev, botMessage]);
            }, 100);
            setInputValue("");
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: messages.length + 2,
                    text: "Sorry, something went wrong while generating a response.",
                    sender: "bot",
                },
            ]);
        }

        setInputValue("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClose = () => {
        setMessages([
            { id: 1, text: "Hello! I'm your AI Code Helper. Ask me anything about this code.", sender: "bot" },
        ]);
        setInputValue("");
        setCopied(false);
        onClose?.();
    };

    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center px-3 sm:px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                        style={{ background: "rgba(17,17,19,0.30)" }}
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-8xl h-[88vh] z-10 overflow-hidden rounded-2xl border shadow-2xl flex flex-col"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <div
                            className="flex items-start justify-between gap-4 p-4 sm:p-4 border-b"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: theme.colors.limeDim }}
                                    >
                                        <Sparkles className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                                            AI Code Helper
                                        </CardTitle>
                                        <p className="text-[13px] font-medium mt-1 line-clamp-1" style={{ color: theme.colors.darkGray }}>
                                            {title}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">


                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl transition-colors border hover:bg-slate-50"
                                    style={{
                                        background: theme.colors.white,
                                        color: theme.colors.darkGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                    aria-label="Close AI helper"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4  overflow-y-auto">
                            <Card
                                className="lg:col-span-3 rounded-2xl overflow-hidden p-0"
                                style={{
                                    background: theme.colors.white,
                                    borderColor: theme.colors.lightGray,
                                    boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                }}
                            >
                                <CardContent className="pt-0 h-full flex flex-col min-h-0 p-0 sm:p-4 p-1">
                                    <div
                                        className="flex-1 min-h-0 overflow-y-auto rounded-2xl border p-4 space-y-4"
                                        style={{
                                            background: theme.colors.softGray,
                                            borderColor: theme.colors.lightGray,
                                        }}
                                        data-lenis-prevent
                                    >
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={` px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.sender === "user"
                                                        ? "rounded-br-none"
                                                        : "rounded-bl-none border"
                                                        }`}
                                                    style={
                                                        message.sender === "user"
                                                            ? {
                                                                background: theme.colors.dark,
                                                                color: theme.colors.white,
                                                                boxShadow: "0 6px 0 rgba(17,17,19,0.14)",
                                                            }
                                                            : {
                                                                background: theme.colors.white,
                                                                color: theme.colors.dark,
                                                                borderColor: theme.colors.lightGray,
                                                            }
                                                    }
                                                >
                                                    <MarkdownMessage content={message.text} sender={message.sender} />
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>


                                    <div className="mt-4 flex gap-2">
                                        <ChatInput
                                            inputValue={inputValue}
                                            setInputValue={setInputValue}
                                            handleKeyPress={handleKeyPress}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-transform active:scale-[0.98] cursor-pointer"
                                            style={{
                                                background: theme.colors.lime,
                                                color: theme.colors.dark,
                                                borderColor: theme.colors.lime,
                                            }}
                                        >
                                            <Send className="w-4 h-4 fill-current" />
                                            Send
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="lg:col-span-2 rounded-2xl sm:block hidden overflow-y-auto"
                                style={{
                                    background: theme.colors.white,
                                    borderColor: theme.colors.lightGray,
                                    boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                }}
                            >
                                <CardHeader className="pb-3 ">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ background: theme.colors.limeDim }}
                                            >
                                                <Code2 className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                            </div>
                                            <div className="min-w-0">
                                                <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                                                    Code Preview
                                                </CardTitle>
                                                <p className="text-[13px] font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                                                    Selected snippet
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0" data-lenis-prevent>
                                    <div
                                        className="rounded-2xl overflow-hidden border"
                                        style={{ borderColor: theme.colors.lightGray }}
                                    >
                                        <Highlight className="javascript" >{displayCode}</Highlight>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            )}
            {showApiKeyModal && (
                <ApiKeyModal
                    isOpen={showApiKeyModal}
                    onClose={() => setShowApiKeyModal(false)}
                />
            )}
        </AnimatePresence>,
        document.body
    );
}
