import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/ui/shine-border";
import { aiAssistant } from "@/Api/api";
import { Sparkles, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { customMessage } from "@/Utils/customMessage";
import { useData } from "@/context/DataContext";
import { ApiKeyModal } from "@/components/common/ApiKeyModal";
import { MarkdownContent } from "@/Utils/MarkdownContent";

export function AIAssistant() {
    const { user } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi there! I'm your study assistant. Need help with any concepts or code today?" },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        const userText = message;
        setMessages((prev) => [...prev, { role: "user", content: userText }]);
        setMessage("");
        setIsLoading(true);

        try {
            const res = await aiAssistant(userText);
            if (!res?.data?.message && !res?.data?.data) {
                setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I could not generate a response." }]);
                return customMessage({
                    type: "error",
                    content: "Failed to generate a response!",
                });
            }
            const reply = res?.data?.data || res?.data?.message;
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong while generating a response." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        type="button"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setIsOpen(true)}
                        aria-label="Open AI Study Assistant"
                        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl border border-indigo-400/30 shadow-xl shadow-indigo-500/25 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                    >
                        <Sparkles className="w-6 h-6" aria-hidden="true" />
                    </motion.button>
                )}
            </AnimatePresence>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`fixed z-50 rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col overflow-hidden ${
                        isMaximized
                            ? "inset-4 sm:inset-8"
                            : "bottom-24 sm:bottom-6 right-4 sm:right-6 sm:w-[420px] w-[calc(100vw-2rem)] h-[75vh] max-h-[680px]"
                    }`}
                >
                    <div className="flex items-center justify-between gap-4 p-4 border-b border-border bg-secondary/40">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/12 border border-indigo-500/25 text-primary">
                                <Sparkles className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm text-foreground">Study Assistant</h3>
                                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                            <button
                                type="button"
                                className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                onClick={() => setIsMaximized(!isMaximized)}
                                aria-label={isMaximized ? "Minimize assistant" : "Maximize assistant"}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close assistant"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col bg-background">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" data-lenis-prevent="true">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                            msg.role === "user"
                                                ? "rounded-br-none bg-primary text-primary-foreground font-medium"
                                                : "rounded-bl-none border border-border bg-card text-card-foreground"
                                        }`}
                                    >
                                        <MarkdownContent content={msg.content} role={msg.role} />
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 rounded-2xl rounded-bl-none border border-border bg-card flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3.5 bg-card border-t border-border">
                            <div className="flex gap-2">
                                <div className="relative flex-1 min-h-[44px] rounded-xl overflow-hidden bg-background border border-input focus-within:ring-2 focus-within:ring-ring transition-all">
                                    <ShineBorder shineColor={["rgb(99, 102, 241)", "rgb(16, 185, 129)"]} />
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                                        placeholder={isLoading ? "Thinking..." : "Ask a question..."}
                                        aria-label="Ask AI study assistant"
                                        disabled={isLoading}
                                        className="w-full h-full min-h-[44px] px-4 text-sm outline-none bg-transparent text-foreground placeholder:text-muted-foreground disabled:opacity-60"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shrink-0 disabled:opacity-50"
                                    onClick={handleSend}
                                    disabled={isLoading || !message.trim()}
                                    aria-label="Send message"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            {showApiKeyModal && (
                <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
            )}
        </>
    );
}
