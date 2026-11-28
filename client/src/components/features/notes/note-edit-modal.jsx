import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateNote } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";

export function NoteEditModal({ editNote, setEditNote, onRefresh }) {
    if (!editNote) return null;

    const handleSave = async () => {
        try {
            const res = await updateNote(editNote._id, {
                title: editNote.title,
                section: editNote.section,
                code: editNote.code,
            });
            if (res.data.success) {
                customMessage({ content: "Note updated successfully", type: "success" });
                setEditNote(null);
                onRefresh?.();
            }
        } catch (error) {
            console.error("Failed to update note:", error);
            customMessage({ content: "Failed to update note", type: "error" });
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditNote(null)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="relative w-full max-w-xl rounded-3xl shadow-2xl border border-border p-6 overflow-hidden bg-card text-card-foreground z-10"
                >
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-extrabold text-foreground">Edit Note</h2>
                        <button
                            type="button"
                            onClick={() => setEditNote(null)}
                            aria-label="Close edit modal"
                            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
                        >
                            <X className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="edit-note-title" className="text-xs font-bold text-foreground">
                                Title
                            </label>
                            <input
                                id="edit-note-title"
                                type="text"
                                value={editNote.title}
                                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                                className="w-full min-h-[42px] px-3.5 rounded-xl text-sm border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="edit-note-sec" className="text-xs font-bold text-foreground">
                                Category / Section
                            </label>
                            <input
                                id="edit-note-sec"
                                type="text"
                                value={editNote.section}
                                onChange={(e) => setEditNote({ ...editNote, section: e.target.value })}
                                className="w-full min-h-[42px] px-3.5 rounded-xl text-sm border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {editNote.fileType === "NAN" && (
                            <div className="space-y-1.5">
                                <label htmlFor="edit-note-code" className="text-xs font-bold text-foreground">
                                    Code / Snippet
                                </label>
                                <textarea
                                    id="edit-note-code"
                                    value={editNote.code}
                                    onChange={(e) => setEditNote({ ...editNote, code: e.target.value })}
                                    className="w-full h-36 p-3.5 rounded-xl text-sm border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring font-mono"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2.5 pt-3">
                            <button
                                type="button"
                                onClick={() => setEditNote(null)}
                                className="px-5 min-h-[42px] rounded-xl text-xs font-bold border border-border bg-background hover:bg-secondary text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-5 min-h-[42px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold transition-colors shadow-sm shadow-indigo-500/20"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
