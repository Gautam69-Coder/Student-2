import React, { useCallback, useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Sparkles, Code2 } from "lucide-react";
import CodeTabs from "@/components/features/practicals/practical-code-tab";
import { AICodeHelper } from "@/components/features/coding/ai-code-helper";
import { Card, CardContent } from "/components/ui/card";
import { theme } from "@/lib/theme";

export function CodeModal({ isOpen, onClose, title, code, section }) {
    const [copied, setCopied] = useState(false);
    const [showModalCodeHelper, setShowModalCodeHelper] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const tabs = useMemo(() => {
        if (Array.isArray(code)) {
            return code.map(item => ({
                label: item.languageName || "Default",
                code: item.code || ""
            }));
        }
        return [{ label: "Default", code: code || "" }];
    }, [code]);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(0);
        }
    }, [isOpen, code]);

    const activeCode = tabs[activeTab]?.code || "";

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(activeCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [activeCode]);

    const handleOpenCodeHelper = useCallback(() => {
        setShowModalCodeHelper(true);
    }, []);

    const handleCloseCodeHelper = useCallback(() => {
        setShowModalCodeHelper(false);
    }, []);

    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 backdrop-blur-sm  z-50 flex items-center justify-center px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 "
                        style={{ background: "rgba(17,17,19,0.25)" }}
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[88vh] z-10 overflow-hidden rounded-2xl border shadow-2xl flex flex-col"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <div
                            className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: theme.colors.limeDim }}
                                    >
                                        <Code2 className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black" style={{ color: theme.colors.dark }}>
                                            Code Preview
                                        </h3>
                                        <p className="text-sm font-medium mt-1 truncate" style={{ color: theme.colors.darkGray }}>
                                            {title}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={handleOpenCodeHelper}
                                    className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                    style={{
                                        background: theme.colors.lime,
                                        color: theme.colors.dark,
                                        borderColor: theme.colors.lime,
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 fill-current opacity-85" />
                                    AI Assistant
                                </button>

                                <button
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors border hover:bg-slate-50"
                                    style={{
                                        background: theme.colors.white,
                                        color: theme.colors.dark,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4" style={{ color: "#16A34A" }} />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                    {copied ? "Copied!" : "Copy"}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl transition-colors border hover:bg-slate-50"
                                    style={{
                                        background: theme.colors.white,
                                        color: theme.colors.darkGray,
                                        borderColor: theme.colors.lightGray,
                                    }}
                                    aria-label="Close code preview"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto " data-lenis-prevent>
                            <div
                                className=" overflow-hidden border-0"
                                style={{
                                    background: "#0d1117",
                                    boxShadow: "0 10px 0 rgba(17,17,19,0.08)",
                                }}
                            >
                                <CardContent className="p-0 relative">
                                    <button
                                        onClick={handleOpenCodeHelper}
                                        className="sm:hidden absolute right-4 top-[10px] z-10 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                        style={{
                                            background: theme.colors.lime,
                                            color: theme.colors.dark,
                                            borderColor: theme.colors.lime,
                                        }}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 fill-current opacity-85" />
                                        AI Assistant
                                    </button>
                                    <CodeTabs
                                        tabs={tabs}
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                        layoutId="modalActiveTabUnderline"
                                    />
                                </CardContent>
                            </div>
                        </div>
                    </motion.div>

                    <AICodeHelper
                        isOpen={showModalCodeHelper}
                        onClose={handleCloseCodeHelper}
                        title={title}
                        code={activeCode}
                        section={section}
                    />
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
