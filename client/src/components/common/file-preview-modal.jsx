import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { theme } from "@/lib/theme";
import { downloadFile } from "@/Utils/download";
import { FilePreview } from "./file-preview";

export function FilePreviewModal({ isOpen, onClose, fileUrl, fileType, fileName, title, subtitle, onDownload }) {
    if (typeof document === "undefined") return null;

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            downloadFile(fileUrl, fileName || title || "file");
        }
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
                        className="absolute inset-0 backdrop-blur-sm"
                        style={{ background: "rgba(17,17,19,0.25)" }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="relative w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border z-10"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            className="flex justify-between items-center p-4 sm:p-5 border-b bg-white shrink-0"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-black text-zinc-900 truncate" style={{ color: theme.colors.dark }}>
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-xs text-zinc-400 mt-1 font-medium truncate">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 cursor-pointer"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Download File</span>
                                    <span className="sm:hidden">Download</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl transition-colors border hover:bg-slate-50 cursor-pointer"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.darkGray,
                                    }}
                                    aria-label="Close document preview"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-auto p-6 flex justify-center items-center" style={{ background: theme.colors.softGray }}>
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
