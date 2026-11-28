import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { downloadFile } from "@/Utils/download";
import { FilePreview } from "./file-preview";

export function FilePreviewModal({
    isOpen,
    onClose,
    fileUrl,
    fileType,
    fileName,
    title,
    subtitle,
    onDownload,
}) {
    if (typeof document === "undefined") return null;

    const handleDownload = () => {
        if (onDownload) onDownload();
        else downloadFile(fileUrl, fileName || title || "file");
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 backdrop-blur-sm bg-black/50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        className="relative w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-border bg-card text-card-foreground z-10"
                    >
                        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-border bg-secondary/40 shrink-0 gap-3">
                            <div className="min-w-0">
                                <h2 className="text-base sm:text-xl font-extrabold text-foreground truncate">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 min-h-[40px] rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    <span className="hidden sm:inline">Download File</span>
                                    <span className="sm:hidden">Download</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    aria-label="Close document preview"
                                >
                                    <X className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-6 flex justify-center items-center bg-background">
                            <FilePreview
                                fileUrl={fileUrl}
                                fileType={fileType}
                                fileName={fileName}
                                title={title}
                                onDownload={handleDownload}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
