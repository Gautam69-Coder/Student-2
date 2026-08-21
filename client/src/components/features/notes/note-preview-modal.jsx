import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { theme } from "@/lib/theme";
import { downloadFile } from "@/Utils/download";
import { formatDate } from "@/Utils/date";

export function NotePreviewModal({ note, onClose, onDownload }) {
    const isOpen = !!note && note.fileType !== "NAN";

    const handleDownloadClick = () => {
        if (!note) return;
        if (onDownload) {
            onDownload(note);
        } else {
            downloadFile(note.fileData, note.fileName || note.title);
        }
    };

    return (
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border z-10"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <div
                            className="flex justify-between items-center p-4 sm:p-6 border-b bg-white"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900" style={{ color: theme.colors.dark }}>
                                    {note.title}
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1 font-medium">
                                    {note.section} • Uploaded: {formatDate(note.createdAt)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownloadClick}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 cursor-pointer"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl transition-colors cursor-pointer"
                                    style={{
                                        background: theme.colors.softGray,
                                        color: theme.colors.darkGray,
                                    }}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-6 flex justify-center" style={{ background: theme.colors.softGray }}>
                            {note.fileType?.startsWith("image/") ? (
                                <img
                                    src={note.fileData}
                                    alt={note.title}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-xl"
                                />
                            ) : note.fileType === "application/pdf" ? (
                                <iframe
                                    src={note.fileData}
                                    className="w-full h-full rounded-2xl border bg-white"
                                    style={{ borderColor: theme.colors.lightGray }}
                                    title={note.title}
                                />
                            ) : (
                                <div className="text-center p-12 bg-white rounded-2xl border border-zinc-200 shadow-xs max-w-md my-auto">
                                    <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-zinc-950 font-bold mb-2">Preview Unavailable</p>
                                    <p className="text-zinc-400 text-sm mb-6">
                                        This file type cannot be displayed directly in-browser. Please download it to view.
                                    </p>
                                    <button
                                        onClick={handleDownloadClick}
                                        className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
                                    >
                                        Download to View
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
