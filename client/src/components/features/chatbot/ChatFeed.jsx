import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    Minimize2,
    Maximize2,
    Sliders,
    Brain,
    Bot,
    User,
    Send,
    Clock,
    FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/Utils/MarkdownContent";
import ChatInput from "@/components/common/chat-input";

export function ChatFeed({
    activeChat,
    systemPrompt,
    attachedNotesCount,
    attachedPracticalsCount,
    isFullscreen,
    setIsFullscreen,
    isRightPanelOpen,
    setIsRightPanelOpen,
    isLoadingResponse,
    onSend,
}) {
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages, isLoadingResponse]);

    const handleSendLocal = () => {
        if (!inputMessage.trim() || isLoadingResponse) return;
        onSend(inputMessage.trim());
        setInputMessage("");
    };

    const suggestions = [
        {
            title: "Explain OSI Layers",
            text: "Explain the OSI Model layers and highlight the Transport layer's key duties.",
            icon: Clock,
        },
        {
            title: "React State Hook",
            text: "Show me a React component demonstrating useState and useEffect lifecycle hook updates.",
            icon: FileText,
        },
        {
            title: "Explain Recursion",
            text: "Break down how recursion works in coding with simple analogies and code.",
            icon: Brain,
        },
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
            {/* Header info */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-10 select-none">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                             <span>{activeChat?.title || "AI Chatbot"}</span>
                             <Badge
                                 variant="outline"
                                 className="bg-indigo-50 text-indigo-600 text-[10px] font-bold border-indigo-100 uppercase tracking-widest px-1.5 py-0.5"
                             >
                                 {systemPrompt}
                             </Badge>
                        </div>
                        <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                            <Brain className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                                Context attached: {attachedNotesCount + attachedPracticalsCount} files
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all text-slate-400 cursor-pointer"
                        title={isFullscreen ? "Minimize" : "Maximize"}
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                        className={`flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer ${
                            isRightPanelOpen
                                ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                                : "bg-transparent text-slate-400"
                        }`}
                        title="Context Settings"
                    >
                        <Sliders className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 relative min-h-0">
                <div
                    className="absolute inset-0 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50"
                    data-lenis-prevent
                >
                    {(!activeChat?.messages || activeChat.messages.length <= 1) && (
                        <div className="max-w-2xl mx-auto py-10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
                                <Sparkles className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                Welcome to AI Chatbot
                            </h2>
                            <p className="text-slate-400 text-sm max-w-md mb-8">
                                Supercharge your study workspace. Attach key lecture notes and lab sheets, choose
                                context rules, and chat with AI.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                                {suggestions.map((sug, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => onSend(sug.text)}
                                        className="p-4 bg-white border border-slate-200 hover:border-indigo-500/30 rounded-xl cursor-pointer hover:bg-slate-50/50 transition-all flex flex-col justify-between h-32 group"
                                    >
                                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            <sug.icon className="w-3.5 h-3.5 text-indigo-600" />
                                            {sug.title}
                                        </div>
                                        <div className="text-slate-400 text-xs mt-2 line-clamp-3">
                                            "{sug.text}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeChat?.messages && activeChat.messages.length > 1 && (
                        <div className="max-w-5xl mx-auto space-y-6">
                            {activeChat.messages.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        {/* {!isUser && (
                                            <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center shrink-0">
                                                <Bot className="w-4 h-4 text-lime-600" />
                                            </div>
                                        )} */}

                                        <div
                                            className={`max-w-[95%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                                isUser
                                                    ? "bg-indigo-600 text-white font-semibold rounded-tr-none shadow-lg shadow-indigo-100"
                                                    : "bg-white border border-slate-200 text-slate-800 "
                                            }`}
                                        >
                                            {isUser ? (
                                                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                            ) : (
                                                <MarkdownContent content={msg.content} role={msg.role} />
                                            )}
                                        </div>

                                        {isUser && (
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-slate-600" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {isLoadingResponse && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-4 justify-start"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="bg-white border border-slate-200 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                                        <span className="ml-1 font-semibold text-indigo-600/80">
                                            Analyzing attached context...
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Message input footer */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 focus-within:border-indigo-500 transition-colors">
                        <ChatInput
                            inputValue={inputMessage}
                            setInputValue={setInputMessage}
                            handleKeyPress={(e) => e.key === "Enter" && handleSendLocal()}
                        />
                    </div>
                    <button
                        onClick={handleSendLocal}
                        disabled={!inputMessage.trim() || isLoadingResponse}
                        className="flex items-center justify-center w-12 h-12 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all active:scale-95 shrink-0 cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
