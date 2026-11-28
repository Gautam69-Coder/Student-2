import React, { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Copy, Check, Sparkles, BookOpen, FileText } from "lucide-react";
import { downloadFile } from "@/Utils/download";
import { formatDate } from "@/Utils/date";
import { useClipboard } from "@/Utils/clipboard";
import { MarkdownContent } from "@/Utils/MarkdownContent";
import { FilePreview } from "../../common/file-preview";
import { ImproveNoteModal } from "./improve-note";

export function NotePreviewModal({ note, onClose, onDownload, onRefresh }) {
    const { copied, copy } = useClipboard(2000);
    const [showImproveModal, setShowImproveModal] = useState(false);

    const hasFile = Boolean(
        note && note.fileType && note.fileType !== "NAN" && note.fileData && note.fileData !== "NAN"
    );

    const hasContent = Boolean(
        note &&
            note.content &&
            note.content !== "NAN" &&
            typeof note.content === "string" &&
            note.content.trim() !== ""
    );

    const isSplit = hasFile && hasContent;
    const isOpen = Boolean(note);

    const handleDownloadClick = () => {
        if (!note) return;
        if (hasFile) {
            if (onDownload) onDownload(note);
            else downloadFile(note.fileData, note.fileName || note.title);
        } else if (hasContent) {
            const blob = new Blob([note.content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const cleanTitle = (note.title || "note").trim().replace(/[/\\?%*:|"<>]/g, "-");
            a.download = `${cleanTitle}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleCopyClick = () => {
        if (note?.content) copy(note.content);
    };

    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && note && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 backdrop-blur-sm bg-black/50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-border bg-card text-card-foreground z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center flex-wrap justify-between p-4 sm:p-5 border-b border-border bg-secondary/40 shrink-0 gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2.5 rounded-xl shrink-0 border border-indigo-500/25 bg-indigo-500/10 text-primary">
                                    {hasFile ? (
                                        <FileText className="w-5 h-5" aria-hidden="true" />
                                    ) : (
                                        <BookOpen className="w-5 h-5" aria-hidden="true" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-xl font-bold truncate text-foreground">
                                        {note.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                        <span className="font-semibold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border">
                                            {note.section || "General"}
                                        </span>
                                        <span>·</span>
                                        <span className="tabular-nums">Uploaded: {formatDate(note.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-auto">
                                {hasContent && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setShowImproveModal(true)}
                                            className="inline-flex items-center gap-1.5 px-3.5 min-h-[38px] rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-95"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                            <span className="hidden sm:inline">AI Improve</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCopyClick}
                                            className="inline-flex items-center gap-1.5 px-3.5 min-h-[38px] rounded-xl text-xs font-bold border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                                                    <span className="text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                                                        Copied
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                                    <span className="hidden sm:inline">Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {(hasFile || hasContent) && (
                                    <button
                                        type="button"
                                        onClick={handleDownloadClick}
                                        className="inline-flex items-center gap-1.5 px-3.5 min-h-[38px] rounded-xl text-xs font-bold border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                                    >
                                        <Download className="w-4 h-4" aria-hidden="true" />
                                        <span className="hidden sm:inline">
                                            {hasFile ? "Download File" : "Download"}
                                        </span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    aria-label="Close note preview"
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {isSplit ? (
                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-background">
                                <div className="w-full md:w-1/2 h-[45vh] md:h-full p-4 flex flex-col justify-center items-center overflow-auto border-b md:border-b-0 md:border-r border-border">
                                    <FilePreview
                                        fileUrl={note.fileData}
                                        fileType={note.fileType}
                                        fileName={note.fileName}
                                        title={note.title}
                                        onDownload={handleDownloadClick}
                                    />
                                </div>

                                <div className="w-full md:w-1/2 h-[45vh] md:h-full p-4 sm:p-6 flex flex-col bg-card overflow-hidden" data-lenis-prevent>
                                    <div className="flex items-center justify-between mb-3 shrink-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Note Content
                                        </span>
                                    </div>

                                    {note?.isAiNote ? (
                                        <div className="flex-1 overflow-auto rounded-2xl border border-border p-5 bg-background select-text">
                                            <MarkdownContent content={note.content} />
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-auto whitespace-pre-wrap leading-relaxed text-sm text-foreground rounded-2xl border border-border p-5 bg-background select-text font-mono">
                                            {note.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : hasFile ? (
                            <div className="flex-1 overflow-auto p-6 flex justify-center items-center bg-background">
                                <FilePreview
                                    fileUrl={note.fileData}
                                    fileType={note.fileType}
                                    fileName={note.fileName}
                                    title={note.title}
                                    onDownload={handleDownloadClick}
                                />
                            </div>
                        ) : hasContent ? (
                            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-background" data-lenis-prevent>
                                {note?.isAiNote ? (
                                    <div className="rounded-2xl border border-border p-6 bg-card select-text max-w-4xl mx-auto">
                                        <MarkdownContent content={note.content} />
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap leading-relaxed text-sm text-foreground rounded-2xl border border-border p-6 bg-card select-text font-mono max-w-4xl mx-auto">
                                        {note.content}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                <FileText className="w-12 h-12 mb-3 opacity-50" aria-hidden="true" />
                                <p className="text-base font-bold text-foreground">No content available</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    This note does not have text or an uploaded file.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {showImproveModal && note && (
                <ImproveNoteModal
                    isOpen={showImproveModal}
                    onClose={() => {
                        setShowImproveModal(false);
                        onRefresh?.();
                    }}
                    note={note}
                />
            )}
        </AnimatePresence>,
        document.body
    );
}
