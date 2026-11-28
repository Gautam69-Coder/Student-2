import React, { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { improveNote, updateNoteText } from "@/Api/api";
import { DotLoader } from "@/Utils/loaders";
import { X, Sparkles, FileText, RefreshCw, Save, Send, Wand2 } from "lucide-react";
import { customMessage } from "@/Utils/customMessage";
import { MarkdownContent } from "@/Utils/MarkdownContent";

export function ImproveNoteModal({ isOpen = true, onClose, note }) {
    const [aiNote, setAiNote] = useState(null);
    const [input, setInput] = useState("");
    const [editNote, setEditNote] = useState(note?.content || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    if (typeof document === "undefined") return null;

    const quick = [
        "Fix Grammar & Polish",
        "Summarize Key Points",
        "Optimize and Clean Code",
        "Add Explanations",
    ];

    const handleSubmit = async () => {
        if (!input || !input.trim()) {
            return customMessage({ type: "error", content: "Prompt is Required" });
        }

        const prompt = "User Note: \n" + editNote.trim() + "\n prompt: \n" + input.trim();

        try {
            setIsLoading(true);
            const res = await improveNote({ prompt });
            setAiNote(res.data.data);
            setInput("");
        } catch (e) {
            console.error(e);
            customMessage({ type: "error", content: "Failed to generate improvement" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNote = async () => {
        try {
            setIsSaveLoading(true);
            await updateNoteText({ noteId: note._id, code: editNote, isAiNote: true });
            customMessage({ type: "success", content: "Note saved!" });
            onClose();
        } catch (e) {
            console.error(e);
            customMessage({ type: "error", content: "Failed to save note" });
        } finally {
            setIsSaveLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 backdrop-blur-sm bg-black/50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-6xl h-[92vh] max-h-[880px] rounded-3xl flex flex-col overflow-hidden border border-border bg-card text-card-foreground shadow-2xl z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border shrink-0 bg-secondary/40">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/25 bg-indigo-500/12 text-primary">
                                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight truncate text-foreground">
                                        AI Note Review & Improvement
                                    </h2>
                                    <p className="text-xs truncate max-w-[280px] sm:max-w-md text-muted-foreground">
                                        Compare and refine your study note with AI assistance
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Comparison Panels */}
                        <div className="flex-1 min-h-0 p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden bg-background">
                            {/* User Note */}
                            <div className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                            Your Note
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-primary">
                                        Editable
                                    </span>
                                </div>

                                <div className="flex-1 p-4 font-mono text-xs sm:text-sm leading-relaxed text-foreground" data-lenis-prevent>
                                    <textarea
                                        aria-label="Note content editor"
                                        className="w-full h-full resize-none bg-transparent border-0 outline-none text-foreground"
                                        value={editNote}
                                        onChange={(e) => setEditNote(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* AI Update */}
                            <div className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40 shrink-0">
                                    <div className="flex gap-1.5 items-center">
                                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                            AI Improved Output
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300">
                                        Read-Only
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4" data-lenis-prevent>
                                    {isLoading ? (
                                        <div className="w-full h-full flex justify-center items-center">
                                            <DotLoader color="#4F46E5" />
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-border p-4 bg-background space-y-3">
                                            {aiNote ? (
                                                <MarkdownContent content={aiNote} role="" />
                                            ) : (
                                                <>
                                                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                                                        Ready to improve your note
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        Choose a quick action below or type a custom instruction to polish formatting, explain concepts, or optimize code.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Prompt & Actions */}
                        <div className="p-4 sm:p-5 border-t border-border flex flex-col lg:flex-row lg:items-end justify-between gap-4 shrink-0 bg-card">
                            <div className="flex flex-col gap-2.5 flex-1">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar text-xs">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-1">
                                        Quick:
                                    </span>
                                    {quick.map((item, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-background text-foreground hover:bg-secondary transition-colors"
                                            onClick={() => setInput(item)}
                                        >
                                            <Wand2 className="w-3 h-3 text-primary" aria-hidden="true" />
                                            <span>{item}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Prompt AI (e.g. 'Format as bullet points', 'Explain step-by-step')..."
                                        aria-label="Prompt AI for note improvement"
                                        className="w-full min-h-[44px] px-4 pr-12 rounded-xl text-xs sm:text-sm border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-1.5 p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-95"
                                        title="Send prompt to AI"
                                        aria-label="Send prompt to AI"
                                        onClick={handleSubmit}
                                    >
                                        <Send className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 shrink-0">
                                <button
                                    type="button"
                                    disabled={!aiNote}
                                    className="inline-flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold border border-border bg-background text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                                    onClick={() => aiNote && setEditNote(aiNote)}
                                >
                                    <RefreshCw className="w-4 h-4 text-primary" aria-hidden="true" />
                                    <span>Apply AI Draft</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveNote}
                                    disabled={isSaveLoading}
                                    className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60"
                                >
                                    {isSaveLoading ? (
                                        <DotLoader color="#ffffff" size="20" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" aria-hidden="true" />
                                            <span>Save Note</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default ImproveNoteModal;
