import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateNote } from "@/Api/api";
import { customMessage } from "@/Utils/customMessage";
import { theme } from "@/lib/theme";

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
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-900/60"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-xl rounded-2xl shadow-2xl border p-6 overflow-hidden bg-white z-10"
                    style={{
                        borderColor: theme.colors.lightGray,
                    }}
                >
                    <div className="flex justify-between items-center mb-6 bg-white">
                        <h2 className="text-xl font-bold text-zinc-900">Edit Note</h2>
                        <button
                            onClick={() => setEditNote(null)}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600">Title</label>
                            <input
                                type="text"
                                value={editNote.title}
                                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                                className="mt-1.5 w-full h-10 px-3 rounded-lg text-sm border outline-none"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600">Category/Section</label>
                            <input
                                type="text"
                                value={editNote.section}
                                onChange={(e) => setEditNote({ ...editNote, section: e.target.value })}
                                className="mt-1.5 w-full h-10 px-3 rounded-lg text-sm border outline-none"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                }}
                            />
                        </div>

                        {editNote.fileType === "NAN" && (
                            <div>
                                <label className="text-sm font-medium text-slate-600">Code / Snippet</label>
                                <textarea
                                    value={editNote.code}
                                    onChange={(e) => setEditNote({ ...editNote, code: e.target.value })}
                                    className="mt-1.5 w-full h-32 p-3 rounded-lg text-sm border outline-none font-mono"
                                    style={{
                                        borderColor: theme.colors.lightGray,
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setEditNote(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-indigo-100 cursor-pointer"
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
