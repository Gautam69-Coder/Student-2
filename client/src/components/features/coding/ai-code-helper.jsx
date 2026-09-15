import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Send, Sparkles, Code2, MessageCircle, } from "lucide-react";
import { aiCodeHelper } from "@/Api/api";
import { MarkdownContent } from "@/Utils/MarkdownContent";
import HighlightComponent from "react-highlight";
const Highlight = HighlightComponent.default || HighlightComponent;
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

export function AICodeHelper({ isOpen, onClose, title, code, section }) {
    const { user } = useData();
    const [copied, setCopied] = useState(false);
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
        ? code.map(item => `// --- ${item.languageName} ---\n${item.code}`).join('\n\n')
        : code || "";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;
        if (user && !user.apiKey) {
            setShowApiKeyModal(true);
            return;
        }

        const userText = inputValue;
        const userMessage = {
            id: messages.length + 1,
            text: userText,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        const context = {
            message: userText,
            code: displayCode,
            section: section,
            question: title,
        };

        try {
            const res = await aiCodeHelper(context);
            if (!res?.data?.data && !res?.data?.message) {
                return customMessage({
                    type: "error",
                    content: "Failed to generate response!"
                });
            }
            const botText = res?.data?.data || res?.data?.message || "Sorry, I couldn't understand that. Could you please rephrase?";
            const botMessage = {
                id: messages.length + 2,
                text: botText,
                sender: "bot",
            };
            setMessages((prev) => [...prev, botMessage]);
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
                                className="lg:col-span-3 rounded-r-2xl rounded-l-none overflow-hidden p-0"
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
                                                    <MarkdownContent
                                                        content={message.text}
                                                        role={message.sender === "user" ? "user" : "assistant"}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-start"
                                            >
                                                <div className="px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 bg-white shadow-sm flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                                </div>
                                            </motion.div>
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
                                            onClick={handleSendMessage}
                                            disabled={isLoading || !inputValue.trim()}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                background: theme.colors.lime,
                                                color: theme.colors.dark,
                                                borderColor: theme.colors.lime,
                                            }}
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4 fill-current" />
                                            )}
                                            Send
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="lg:col-span-2 rounded-l-2xl rounded-r-none sm:block hidden overflow-y-auto"
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
