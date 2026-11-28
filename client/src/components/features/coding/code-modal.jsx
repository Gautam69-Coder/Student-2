import React, { useCallback, useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Sparkles, Code2 } from "lucide-react";
import CodeTabs from "@/components/features/practicals/practical-code-tab";
import { AICodeHelper } from "@/components/features/coding/ai-code-helper";
import { CardContent } from "@/components/ui/card";
import { useClipboard } from "@/Utils/clipboard";

export function CodeModal({ isOpen, onClose, title, code, section }) {
    const { copied, copy } = useClipboard(2000);
    const [showModalCodeHelper, setShowModalCodeHelper] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const tabs = useMemo(() => {
        if (Array.isArray(code)) {
            return code.map((item) => ({
                label: item.languageName || "Default",
                code: item.code || "",
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

    const handleCopy = useCallback(() => copy(activeCode), [activeCode, copy]);
    const handleOpenCodeHelper = useCallback(() => setShowModalCodeHelper(true), []);
    const handleCloseCodeHelper = useCallback(() => setShowModalCodeHelper(false), []);

    if (typeof document === "undefined") return null;

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
                        className="relative w-full max-w-5xl max-h-[88vh] z-10 overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col"
                    >
                        <div className="flex items-start justify-between gap-4 p-5 border-b border-border bg-secondary/40">
                            <div className="min-w-0 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/12 border border-indigo-500/25 text-primary flex items-center justify-center shrink-0">
                                    <Code2 className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-extrabold text-foreground">Code Preview</h3>
                                    <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">
                                        {title}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleOpenCodeHelper}
                                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-4 min-h-[38px] text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.98]"
                                >
                                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                    AI Assistant
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-1.5 rounded-xl px-4 min-h-[38px] text-xs font-bold border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                    )}
                                    {copied ? "Copied!" : "Copy"}
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    aria-label="Close code preview"
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                            <CardContent className="p-0 relative">
                                <button
                                    type="button"
                                    onClick={handleOpenCodeHelper}
                                    className="sm:hidden absolute right-3 top-2 z-10 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold bg-primary text-primary-foreground"
                                >
                                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                                    AI Helper
                                </button>
                                <CodeTabs
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    layoutId="modalActiveTabUnderline"
                                />
                            </CardContent>
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
