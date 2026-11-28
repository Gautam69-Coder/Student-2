import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Shield } from "lucide-react";
import { saveApiKey } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { useData } from "@/context/DataContext";

export function ApiKeyModal({ isOpen, onClose }) {
    const { user, setUser } = useData();
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [savingApiKey, setSavingApiKey] = useState(false);
    const [apiKeyError, setApiKeyError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setApiKeyInput("");
            setApiKeyError("");
        }
    }, [isOpen]);

    const handleSaveApiKey = async () => {
        setSavingApiKey(true);
        setApiKeyError("");
        try {
            const res = await saveApiKey(apiKeyInput);
            if (res.data) {
                if (setUser && user) {
                    setUser({ ...user, apiKey: apiKeyInput });
                }
                customMessage({
                    type: "success",
                    content: "API Key updated successfully!",
                });
                onClose();
            }
        } catch (e) {
            setApiKeyError(e?.response?.data?.error || e?.message || "Failed to save API key");
        } finally {
            setSavingApiKey(false);
        }
    };

    if (typeof document === "undefined" || !isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-lg z-10 overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col"
                    >
                        <div className="px-6 py-5 border-b border-border bg-emerald-500/10 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-600 rounded-xl text-white">
                                    <Key size={18} aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Connect Groq API</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Power your AI assistant and code helper with Groq.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close modal"
                                className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">API Key Required</h4>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                        Add your Groq API key to unlock AI code reviews, study explanations, and note improvements.
                                    </p>
                                </div>
                            </div>

                            {apiKeyError && (
                                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-semibold flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                    {apiKeyError}
                                </div>
                            )}
                        </div>

                        <div className="p-5 bg-secondary/40 border-t border-border flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <Key className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                                <input
                                    type="password"
                                    aria-label="Groq API key"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                                    className="block w-full pl-10 pr-3 min-h-[44px] border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSaveApiKey}
                                disabled={savingApiKey || !apiKeyInput.trim()}
                                className="w-full sm:w-auto px-5 min-h-[44px] rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 min-w-[110px]"
                            >
                                {savingApiKey ? "Saving..." : "Save Key"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
