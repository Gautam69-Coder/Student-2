import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "/components/ui/shine-border";
import { aiAssistant } from "@/Api/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sparkles, X, Send, Minimize2, PencilLine, Maximize2, CloudFog } from "lucide-react";
import { theme } from "@/lib/theme";
import { customMessage } from "@/Utils/customMessage";
import { useData } from "@/context/DataContext";
import { ApiKeyModal } from "@/components/common/ApiKeyModal";

function MarkdownContent({ content, role }) {
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
                    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-300 pl-3 italic my-2 opacity-80">
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
                                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ""))}
                                    className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
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
                                role === "user"
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

export function AIAssistant() {
    const { user } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi there! I'm your study assistant. Need help with any concepts today?" },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return;
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        const nextMessages = [...messages, { role: "user", content: message }];
        setMessages(nextMessages);
        setMessage("");

        try {
            const res = await aiAssistant(message);
            if (!res.data.message) {
                setMessages((prev) => [...prev, { role: "assistant", content: res.data.message }]);
                return customMessage({
                    type: "error",
                    content: `${res.data.message} !`
                });
            }
            setMessages((prev) => [...prev, { role: "assistant", content: res.data.data }]);

        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong while generating a response." },
            ]);
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                            scale: { duration: 0.2 },
                        }}
                        onClick={() => setIsOpen(true)}
                        className="fixed sm:bottom-8 backdrop-blur-sm bottom-25 sm:right-8 right-4 z-50 w-14 h-14 rounded-2xl border shadow-lg shadow-indigo-200/50 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                    >
                        <Sparkles className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`fixed  sm:bottom-8 bottom-25 sm:right-8 right-4 z-50 rounded-2xl border shadow-2xl transition-all flex flex-col overflow-hidden ${isMaximized ? "w-[90vw] h-[80vh] sm:bottom-[5vh] bottom-[10vh] right-[5vw]" : "sm:w-[420px] w-[93%] h-[80vh] sm:h-[82vh]"
                        }`}
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                    }}
                >
                    <div
                        className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b"
                        style={{ borderColor: theme.colors.lightGray }}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50 border border-indigo-100"
                            >
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-[16px]" style={{ color: theme.colors.dark }}>
                                    Study Assistant
                                </h3>
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: theme.colors.darkGray }}>
                                    Online
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-xl border hover:bg-slate-50 transition-colors"
                                style={{
                                    background: theme.colors.white,
                                    color: theme.colors.darkGray,
                                    borderColor: theme.colors.lightGray,
                                }}
                                onClick={() => setIsMaximized(!isMaximized)}
                                aria-label={isMaximized ? "Minimize assistant" : "Maximize assistant"}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-xl border hover:bg-slate-50 transition-colors"
                                style={{
                                    background: theme.colors.white,
                                    color: theme.colors.darkGray,
                                    borderColor: theme.colors.lightGray,
                                }}
                                onClick={() => setIsOpen(false)}
                                aria-label="Close assistant"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area - Edge-to-Edge */}
                    <div className="flex-1 min-h-0 flex flex-col bg-slate-50">
                        {/* Messages List */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            data-lenis-prevent
                        >
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "rounded-br-none bg-indigo-600 text-white shadow-md shadow-indigo-100 font-semibold"
                                                : "rounded-bl-none border border-slate-200 bg-white text-slate-800"
                                        }`}
                                    >
                                        <MarkdownContent content={msg.content} role={msg.role} />
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex gap-2">
                                <div className="relative flex-1 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                                    <ShineBorder shineColor={["rgb(99, 102, 241)", "rgb(79, 70, 229)", "rgb(243, 244, 246)"]} />
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        placeholder="Ask a question..."
                                        className="w-full h-full px-4 text-sm outline-none bg-transparent text-slate-900 placeholder-slate-500"
                                    />
                                </div>
                                <button
                                    className="flex items-center justify-center w-11 h-11 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-transform active:scale-[0.98] shadow-md shadow-indigo-100 cursor-pointer shrink-0"
                                    onClick={handleSend}
                                    aria-label="Send message"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            {showApiKeyModal && (
                <ApiKeyModal
                    isOpen={showApiKeyModal}
                    onClose={() => setShowApiKeyModal(false)}
                />
            )}
        </>
    );
}
