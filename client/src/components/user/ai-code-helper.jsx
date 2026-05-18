import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Send } from "lucide-react";
import Highlight from "react-highlight";
import "highlight.js/styles/atom-one-dark.css"
import { aiCodeHelper } from "@/Api/api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TypingAnimation } from "/components/ui/typing-animation"



export function AICodeHelper({ isOpen, onClose, title, code, section }) {
    const [copied, setCopied] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Code Helper. Ask me anything about this code.", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim()) {
            const userMessage = {
                id: messages.length + 1,
                text: inputValue,
                sender: "user"
            };
            setMessages([...messages, userMessage]);

            const context = {
                message: inputValue,
                code: code,
                section: section,
                question: title
            }

            // Call the AI code helper API
            const res = await aiCodeHelper(context);

            console.log(res.data)

            // Simulate bot response
            setTimeout(() => {
                const botMessage = {
                    id: messages.length + 2,
                    text: res.data || "Sorry, I couldn't understand that. Could you please rephrase?",
                    sender: "bot"
                };
                setMessages(prev => [...prev, botMessage]);
            }, 800);

            setInputValue("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (typeof document === 'undefined') return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed  inset-0 z-50 flex items-center justify-center px-2 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full h-[80vh] sm:h-full max-w-9xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Code Helper</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{title}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold transition-all"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={() => {
                                        setMessages([{ id: 1, text: "Hello! I'm your AI Code Helper. Ask me anything about this code.", sender: "bot" }])
                                        onClose()
                                    }}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Main Content - Two Column Layout */}
                        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                            {/* Left Side - Chat */}
                            <div className="w-full  flex flex-col bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4" data-lenis-prevent>
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`px-4 py-3 rounded-lg ${message.sender === "user"
                                                    ? "bg-blue-600 max-w-xl font-semibold text-white rounded-br-none"
                                                    : "max-w-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 dark:text-white text-slate-900"
                                                    }`}
                                            >
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                    components={{
                                                        // Headings
                                                        h1: ({ node, children }) => <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>,
                                                        h2: ({ node, children }) => <h2 className="text-base font-bold mt-2 mb-2">{children}</h2>,
                                                        h3: ({ node, children }) => <h3 className="text-sm font-bold mt-2 mb-2">{children}</h3>,

                                                        // Paragraphs with proper spacing
                                                        p: ({ node, children }) => <p className="mb-2 leading-relaxed">{children}</p>,

                                                        // Lists
                                                        ul: ({ node, children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                        ol: ({ node, children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                        li: ({ node, children }) => <li className="text-sm">{children}</li>,

                                                        // Links
                                                        a: ({ node, href, children }) => (
                                                            <a href={href} className={message.sender === "user" ? "text-blue-100 hover:underline" : "text-blue-600 hover:underline"} target="_blank" rel="noopener noreferrer">
                                                                {children}
                                                            </a>
                                                        ),

                                                        // Emphasis
                                                        strong: ({ node, children }) => <strong className="font-bold">{children}</strong>,
                                                        em: ({ node, children }) => <em className="italic">{children}</em>,

                                                        // Blockquotes
                                                        blockquote: ({ node, children }) => (
                                                            <blockquote className={`border-l-4 pl-3 italic my-2 opacity-80 ${message.sender === "user" ? "border-blue-200" : "border-blue-300"}`}>
                                                                {children}
                                                            </blockquote>
                                                        ),

                                                        // Code blocks and inline code
                                                        code({ node, className, children, inline, ...props }) {
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            const isInline = !match;

                                                            return !isInline ? (
                                                                <div className="relative group rounded-lg overflow-hidden my-4">
                                                                    <div className="flex justify-between items-center px-4 py-2 bg-zinc-800 text-xs text-white">
                                                                        <span className="font-semibold">{match[1]}</span>
                                                                        <button
                                                                            onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                                            className="hover:text-blue-300 transition-colors text-xs font-medium"
                                                                        >
                                                                            Copy
                                                                        </button>
                                                                    </div>
                                                                    <SyntaxHighlighter
                                                                        style={oneDark}
                                                                        language={match[1]}
                                                                        PreTag="div"
                                                                        customStyle={{
                                                                            borderRadius: '0 0 6px 6px',
                                                                            padding: '12px',
                                                                            fontSize: '13px',
                                                                            margin: '0',
                                                                            backgroundColor: '#1e1e2e',
                                                                            border: '1px solid #404050',
                                                                        }}
                                                                        {...props}
                                                                    >
                                                                        {String(children).replace(/\n$/, '')}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                            ) : (
                                                                <code className={message.sender === "user" ? "bg-blue-700 bg-opacity-40 px-2 py-1 rounded text-blue-100 text-sm font-mono" : "bg-zinc-700 bg-opacity-50 px-2 py-1 rounded text-orange-300 text-sm font-mono"} {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },

                                                        // Line breaks
                                                        br: () => <br className="my-1" />,

                                                        // Horizontal line
                                                        hr: () => <hr className="my-3 border-slate-300 dark:border-slate-600" />,
                                                    }}
                                                >

                                                   
                                                        {message.text}
                                                    
                                                </ReactMarkdown>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <div className="flex gap-2">
                                        <textarea
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ask about the code..."
                                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm resize-none max-h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                            rows="2"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors self-end"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Code Preview */}
                            <div className="hidden lg:flex lg:w-3/5 flex-col bg-[#0d1117] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="flex-1 overflow-y-auto p-4" data-lenis-prevent>
                                    <Highlight className="javascript">
                                        {code}
                                    </Highlight>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
