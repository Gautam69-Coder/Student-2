import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Sparkles,
    FileText,
    Copy,
    RefreshCw,
    Save,
    Send,
    Wand2,
    AlignLeft,
    Zap,
    Lightbulb,
    Cpu,
} from "lucide-react";
import { theme } from "@/lib/theme";

export function ImproveNoteModal({ isOpen = true, onClose, note }) {
    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 backdrop-blur-sm cursor-pointer"
                        style={{ background: "rgba(17,17,19,0.25)" }}
                    />

                    {/* Main Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-6xl h-[92vh] max-h-[900px] rounded-2xl flex flex-col overflow-hidden border shadow-2xl z-10"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 25px 50px -12px rgba(17, 17, 19, 0.25), 0 10px 0 rgba(17,17,19,0.05)",
                        }}
                    >
                        {/* Top Header Bar */}
                        <div
                            className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0 bg-white"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border"
                                    style={{
                                        background: theme.colors.limeDim,
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.dark,
                                    }}
                                >
                                    <Sparkles className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base sm:text-lg font-bold tracking-tight truncate" style={{ color: theme.colors.dark }}>
                                            AI Note Review & Improvement
                                        </h2>

                                    </div>
                                    <p className="text-xs truncate max-w-[280px] sm:max-w-md font-medium mt-0.5" style={{ color: theme.colors.darkGray }}>
                                        Comparing original note with AI-enhanced version
                                    </p>
                                </div>
                            </div>

                            {/* Header Close Button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl transition-colors border hover:bg-slate-50 cursor-pointer"
                                style={{
                                    background: theme.colors.white,
                                    color: theme.colors.darkGray,
                                    borderColor: theme.colors.lightGray,
                                }}
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main Comparison Section (Left: User Note, Right: AI Update Note) */}
                        <div
                            className="flex-1 min-h-0 p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 overflow-hidden"
                            style={{ background: theme.colors.softGray }}
                        >
                            {/* LEFT PANEL: User Note */}
                            <div
                                className="flex flex-col h-full rounded-2xl border overflow-hidden shadow-xs"
                                style={{
                                    background: theme.colors.white,
                                    borderColor: theme.colors.lightGray,
                                }}
                            >
                                <div
                                    className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-slate-50/70"
                                    style={{ borderColor: theme.colors.lightGray }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-4 h-4 shrink-0" style={{ color: theme.colors.darkGray }} />
                                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.dark }}>
                                            User Note
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors hover:bg-slate-100 cursor-pointer"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.dark,
                                        }}
                                        title="Copy User Note"
                                    >
                                        <Copy className="w-3.5 h-3.5" style={{ color: theme.colors.darkGray }} />
                                        <span className="text-[11px]">Copy</span>
                                    </button>
                                </div>

                                <div
                                    className="flex-1 overflow-y-auto p-4 select-text font-mono text-[13px] leading-relaxed text-slate-800 space-y-2"
                                    data-lenis-prevent
                                >
                                    <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] sm:text-[13px] text-slate-800 leading-6">
                                       {note.content }
                                    </pre>
                                </div>
                            </div>

                            {/* RIGHT PANEL: AI Update Note */}
                            <div
                                className="flex flex-col h-full rounded-2xl border overflow-hidden shadow-xs relative"
                                style={{
                                    background: theme.colors.white,
                                    borderColor: theme.colors.lightGray,
                                }}
                            >
                                <div
                                    className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-slate-50/70"
                                    style={{ borderColor: theme.colors.lightGray }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                                            AI Update Note
                                        </span>
                                        <span className="text-[11px]  font-bold px-2 rounded-2xl border border-lime-600 tracking-wider text-lime-500">
                                            Ready-Only
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2">


                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors hover:bg-slate-100 cursor-pointer"
                                            style={{
                                                background: theme.colors.white,
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                            }}
                                            title="Copy AI Note"
                                        >
                                            <Copy className="w-3.5 h-3.5" style={{ color: theme.colors.darkGray }} />
                                            <span className="text-[11px]">Copy</span>
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="flex-1 overflow-y-auto p-4 select-text space-y-4"
                                    data-lenis-prevent
                                >
                                    <div className="rounded-xl border p-4 bg-slate-50 space-y-3" style={{ borderColor: theme.colors.lightGray }}>
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-indigo-600" />
                                            AI Improved & Optimized Note
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Modernized syntax using functional array reducers, added comprehensive JSDoc type annotations, and safe input validation.
                                        </p>
                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* Bottom Row Section */}
                        <div
                            className="p-4 sm:p-5 border-t sm:flex justify-between gap-4 sm:gap-5  shrink-0 bg-white"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            {/* Prompt Section */}
                            <div className="flex flex-col gap-2 w">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        Quick:
                                    </span>
                                    <button
                                        type="button"
                                        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer hover:bg-slate-50"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        <Wand2 className="w-3 h-3 text-indigo-600" />
                                        <span>Fix Grammar & Polish</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer hover:bg-slate-50"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        <AlignLeft className="w-3 h-3 text-indigo-600" />
                                        <span>Summarize Key Points</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer hover:bg-slate-50"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        <Zap className="w-3 h-3 text-indigo-600" />
                                        <span>Optimize & Clean Code</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer hover:bg-slate-50"
                                        style={{
                                            background: theme.colors.white,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.dark,
                                        }}
                                    >
                                        <Lightbulb className="w-3 h-3 text-indigo-600" />
                                        <span>Add Explanations</span>
                                    </button>
                                </div>

                                <div className="relative flex items-center mb-2 sm:mb-0">
                                    <input
                                        type="text"
                                        placeholder="Prompt AI (e.g. 'Format as bullet points', 'Fix code performance', 'Explain step-by-step')..."
                                        className="w-full h-10 px-3.5 pr-11 rounded-xl text-xs sm:text-sm border outline-none transition-colors"
                                        style={{
                                            background: theme.colors.softGray,
                                            borderColor: theme.colors.lightGray,
                                            color: theme.colors.dark,
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer active:scale-90 shadow-xs"
                                        title="Send prompt to AI"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 self-end pt-1 sm:pt-0">
                                <button
                                    type="button"
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.dark,
                                    }}
                                >
                                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                                    <span>Update Note</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100 cursor-pointer"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save Note</span>
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
