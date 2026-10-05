import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    X,
    Copy,
    Check,
    Sparkles,
    BookOpen,
    FileText,
} from "lucide-react";
import { theme } from "@/lib/theme";
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
        note &&
        note.fileType &&
        note.fileType !== "NAN" &&
        note.fileData &&
        note.fileData !== "NAN"
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

    const wordCount = useMemo(() => {
        if (!hasContent) return 0;
        return note.content.trim().split(/\s+/).filter(Boolean).length;
    }, [hasContent, note?.content]);

    const readTime = useMemo(() => {
        return Math.max(1, Math.ceil(wordCount / 200));
    }, [wordCount]);

    const handleDownloadClick = () => {
        if (!note) return;
        if (hasFile) {
            if (onDownload) {
                onDownload(note);
            } else {
                downloadFile(note.fileData, note.fileName || note.title);
            }
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
        if (note?.content) {
            copy(note.content);
        }
    };

    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && note && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 backdrop-blur-sm cursor-pointer"
                        style={{ background: "rgba(17,17,19,0.35)" }}
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border z-10"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 25px 50px -12px rgba(17, 17, 19, 0.25), 0 10px 0 rgba(17,17,19,0.05)",
                        }}
                    >
                        {/* Header Bar */}
                        <div
                            className="flex items-center justify-between p-4 sm:p-5 border-b bg-white shrink-0 gap-3"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="p-2.5 rounded-xl shrink-0 border"
                                    style={{
                                        background: hasFile ? theme.colors.limeDim : "rgba(99,102,241,0.08)",
                                        borderColor: theme.colors.lightGray,
                                        color: hasFile ? theme.colors.dark : "#4F46E5",
                                    }}
                                >
                                    {hasFile ? (
                                        <FileText className="w-5 h-5" />
                                    ) : (
                                        <BookOpen className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h2
                                        className="text-lg sm:text-xl font-bold truncate tracking-tight"
                                        style={{ color: theme.colors.dark }}
                                    >
                                        {note.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                                        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                            {note.section || "General"}
                                        </span>
                                        <span>•</span>
                                        <span>Uploaded: {formatDate(note.createdAt)}</span>
                                        {hasContent && !hasFile && (
                                            <>
                                                <span>•</span>
                                                <span className="text-slate-400 font-medium">
                                                    ~{readTime} min read
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {hasContent && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setShowImproveModal(true)}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm active:scale-95 cursor-pointer"
                                            title="Improve note with AI"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">AI Assistant</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCopyClick}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-slate-50 cursor-pointer"
                                            style={{
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                                background: theme.colors.white,
                                            }}
                                            title="Copy note content"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-emerald-600 hidden sm:inline">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
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
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors hover:bg-slate-50 cursor-pointer"
                                        style={{
                                            background: hasFile ? theme.colors.dark : theme.colors.white,
                                            color: hasFile ? "#fff" : theme.colors.dark,
                                            borderColor: hasFile ? theme.colors.dark : theme.colors.lightGray,
                                        }}
                                        title={hasFile ? "Download file" : "Download note text"}
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">
                                            {hasFile ? "Download File" : "Download"}
                                        </span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-100"
                                    style={{
                                        background: theme.colors.softGray,
                                        color: theme.colors.darkGray,
                                    }}
                                    aria-label="Close note preview"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {isSplit ? (
                            <div className="flex-1 flex flex-col md:flex-row overflow-hidden" style={{ background: theme.colors.softGray }}>
                                {/* Left Pane: File Preview */}
                                <div
                                    className="w-full md:w-1/2 h-[45vh] md:h-full p-4 flex flex-col justify-center items-center overflow-auto border-b md:border-b-0 md:border-r"
                                    style={{ borderColor: theme.colors.lightGray }}
                                >
                                    <FilePreview
                                        fileUrl={note.fileData}
                                        fileType={note.fileType}
                                        fileName={note.fileName}
                                        title={note.title}
                                        onDownload={handleDownloadClick}
                                    />
                                </div>

                                {/* Right Pane: Note Content (Formatted Reader) */}
                                <div className="w-full md:w-1/2 h-[45vh] md:h-full p-4 sm:p-6 flex flex-col bg-white overflow-hidden">
                                    <div className="flex items-center justify-between mb-3 shrink-0">
                                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                            Note Content
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleCopyClick}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors hover:bg-slate-50 cursor-pointer"
                                            style={{
                                                borderColor: theme.colors.lightGray,
                                                color: theme.colors.dark,
                                                background: theme.colors.white,
                                            }}
                                        >
                                            {copied ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>

                                    <div
                                        className="flex-1 overflow-auto rounded-2xl border p-5 bg-slate-50/60 select-text"
                                        style={{ borderColor: theme.colors.lightGray }}
                                    >
                                        <MarkdownContent content={note.content} />
                                    </div>
                                </div>
                            </div>
                        ) : hasFile ? (
                            /* File-Only View */
                            <div
                                className="flex-1 overflow-auto p-6 flex justify-center items-center"
                                style={{ background: theme.colors.softGray }}
                            >
                                <FilePreview
                                    fileUrl={note.fileData}
                                    fileType={note.fileType}
                                    fileName={note.fileName}
                                    title={note.title}
                                    onDownload={handleDownloadClick}
                                />
                            </div>
                        ) : hasContent ? (
                            /* Pure Note / Formatted Reader View */
                            <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-50/40">
                                <div
                                    className="max-w-4xl mx-auto rounded-2xl border bg-white p-6 sm:p-10 shadow-xs"
                                    style={{ borderColor: theme.colors.lightGray }}
                                >
                                    <MarkdownContent content={note.content} />
                                </div>
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                                <FileText className="w-12 h-12 mb-3 text-slate-300" />
                                <p className="text-base font-bold text-slate-600">No content available</p>
                                <p className="text-xs text-slate-400 mt-1">This note does not have text or an uploaded file.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* AI Assistant Modal */}
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
