import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Code2 } from "lucide-react";
import { aiCodeHelper } from "@/Api/api";
import { MarkdownContent } from "@/Utils/MarkdownContent";
import HighlightComponent from "react-highlight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customMessage } from "@/Utils/customMessage";
import { useData } from "@/context/DataContext";
import { ApiKeyModal } from "@/components/common/ApiKeyModal";
import ChatInput from "@/components/common/chat-input";

const Highlight = HighlightComponent.default || HighlightComponent;

export function AICodeHelper({ isOpen, onClose, title, code, section }) {
    const { user } = useData();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Code Helper. Ask me anything about this code.", sender: "bot" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && user && !user.apiKey) {
            setShowApiKeyModal(true);
        }
    }, [isOpen, user]);

    const displayCode = Array.isArray(code)
        ? code.map((item) => `// --- ${item.languageName} ---\n${item.code}`).join("\n\n")
        : code || "";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        const userText = inputValue;
        setMessages((prev) => [...prev, { id: prev.length + 1, text: userText, sender: "user" }]);
        setInputValue("");
        setIsLoading(true);

        try {
            const res = await aiCodeHelper({
                message: userText,
                code: displayCode,
                section,
                question: title,
            });
            if (!res?.data?.data && !res?.data?.message) {
                return customMessage({ type: "error", content: "Failed to generate response!" });
            }
            const botText = res?.data?.data || res?.data?.message || "Sorry, could you rephrase that?";
            setMessages((prev) => [...prev, { id: prev.length + 1, text: botText, sender: "bot" }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { id: prev.length + 1, text: "Sorry, something went wrong while generating a response.", sender: "bot" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClose = () => {
        setMessages([{ id: 1, text: "Hello! I'm your AI Code Helper. Ask me anything about this code.", sender: "bot" }]);
        setInputValue("");
        onClose?.();
    };

    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/55"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-6xl h-[86vh] z-10 overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between gap-4 p-4 sm:px-6 border-b border-border bg-secondary/40">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/12 border border-indigo-500/25 text-primary">
                                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-bold text-foreground">AI Code Helper</h2>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{title}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                aria-label="Close AI helper"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 overflow-hidden">
                            <Card className="lg:col-span-3 rounded-2xl overflow-hidden py-0 flex flex-col min-h-0">
                                <CardContent className="p-4 h-full flex flex-col min-h-0">
                                    <div
                                        className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-border bg-background p-4 space-y-4"
                                        data-lenis-prevent
                                    >
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                                        message.sender === "user"
                                                            ? "rounded-br-none bg-primary text-primary-foreground"
                                                            : "rounded-bl-none border border-border bg-card text-card-foreground"
                                                    }`}
                                                >
                                                    <MarkdownContent
                                                        content={message.text}
                                                        role={message.sender === "user" ? "user" : "assistant"}
                                                    />
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

                                    <div className="mt-4 flex gap-2">
                                        <ChatInput
                                            inputValue={inputValue}
                                            setInputValue={setInputValue}
                                            handleKeyPress={handleKeyPress}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSendMessage}
                                            disabled={isLoading || !inputValue.trim()}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 min-h-[44px] font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" aria-hidden="true" />
                                            )}
                                            Send
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2 rounded-2xl hidden lg:flex flex-col overflow-hidden py-0 min-h-0">
                                <CardHeader className="p-4 border-b border-border flex flex-row items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <Code2 className="w-4 h-4" aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-sm font-bold text-foreground">Code Preview</CardTitle>
                                        <p className="text-xs text-muted-foreground">Selected snippet</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 overflow-y-auto flex-1" data-lenis-prevent>
                                    <div className="rounded-xl overflow-hidden border border-border bg-[#0D1117]">
                                        <Highlight className="javascript">{displayCode}</Highlight>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            )}
            {showApiKeyModal && (
                <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
            )}
        </AnimatePresence>,
        document.body
    );
}
