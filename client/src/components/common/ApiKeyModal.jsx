import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Shield } from "lucide-react";
import { saveApiKey } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { theme } from "@/lib/theme";
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
            const res = await saveApiKey(apiKeyInput); // Note: server takes { data: apiKeyInput } inside saveApiKey, wait! Let's check how saveApiKey is defined
            // Wait, saveApiKey is: (data) => api.post('/save-apikey', { data })
            // So calling saveApiKey(apiKeyInput) sends { data: apiKeyInput } which is exactly correct!
            if (res.data) {
                // Update local context user state
                if (setUser && user) {
                    setUser({ ...user, apiKey: apiKeyInput });
                }
                customMessage({
                    type: "success",
                    content: "API Key updated successfully!"
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
                        className="absolute inset-0 bg-slate-900/40"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg z-10 overflow-hidden rounded-3xl border shadow-2xl flex flex-col"
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(16px)",
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
                                    <Key size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Connect Groq API</h3>
                                    <p className="text-xs text-slate-500 font-medium">Power your AI experience with Groq.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-emerald-800">API Key Required</h4>
                                    <p className="text-xs text-emerald-600 mt-1">Please add your Groq API key to start using AI helper features. You can generate one from the Groq console.</p>
                                </div>
                            </div>

                            {apiKeyError && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {apiKeyError}
                                </div>
                            )}
                        </div>

                        {/* Input Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                                    className="block w-full pl-10 pr-3 py-2.5 border text-black border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-mono"
                                />
                            </div>
                            <button
                                onClick={handleSaveApiKey}
                                disabled={savingApiKey || !apiKeyInput.trim()}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all disabled:opacity-50 min-w-[110px] cursor-pointer"
                            >
                                {savingApiKey ? 'Saving...' : 'Save Key'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
