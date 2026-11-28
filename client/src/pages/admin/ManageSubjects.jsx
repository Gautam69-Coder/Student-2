import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Plus } from "lucide-react";
import { createSection, deleteSection } from "@/Api/api";
import { useTitle } from "@/hooks/useTitle";
import { customMessage } from "@/Utils/customMessage";

export function ManageSubjects({ subjects, uniqueSubjectSections, setUniqueSubjectSections }) {
    useTitle("Manage Subjects");
    const [newSubject, setNewSubject] = useState("");

    const handleAddSection = async (sectionName) => {
        if (!sectionName || !sectionName.trim()) {
            customMessage({ type: "error", content: "Subject name cannot be empty." });
            return;
        }
        try {
            const res = await createSection(sectionName.trim());
            const addedItem = res.data?.data || res.data;
            setUniqueSubjectSections((prev) => [...(Array.isArray(prev) ? prev : []), addedItem]);
            setNewSubject("");
            customMessage({ type: "success", content: "Subject created!" });
        } catch (error) {
            console.error(error);
            customMessage({ type: "error", content: "Failed to create subject." });
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId);
            setUniqueSubjectSections((prev) =>
                (Array.isArray(prev) ? prev : []).filter((section) => section._id !== sectionId)
            );
            customMessage({ type: "success", content: "Subject removed." });
        } catch (error) {
            console.error(error);
        }
    };

    const list = Array.isArray(uniqueSubjectSections)
        ? uniqueSubjectSections
        : uniqueSubjectSections?.data || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Manage Subjects</h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Create and organize subject sections across notes and practicals.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 surface-card rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-base text-foreground">Add New Subject</h3>
                    <div className="space-y-2">
                        <label htmlFor="new-subject" className="text-xs font-bold text-foreground">
                            Subject Name
                        </label>
                        <input
                            id="new-subject"
                            type="text"
                            placeholder="e.g. Machine Learning"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            className="w-full px-4 min-h-[44px] rounded-xl bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => handleAddSection(newSubject)}
                        className="w-full min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        Create Subject
                    </button>
                </div>

                <div className="lg:col-span-8 surface-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-secondary/40">
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Sr No.
                                    </th>
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Sections
                                    </th>
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Notes Count
                                    </th>
                                    <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((sub, idx) => (
                                    <tr key={sub._id || idx} className="border-b border-border hover:bg-secondary/40 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-muted-foreground tabular-nums">
                                            {idx + 1}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm text-foreground">{sub.name}</td>
                                        <td className="px-6 py-4 font-semibold text-sm text-muted-foreground tabular-nums">
                                            {subjects.filter((s) => s.section === sub.name).length || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                aria-label={`Delete ${sub.name}`}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                onClick={() => handleDeleteSection(sub._id)}
                                            >
                                                <Trash className="w-4 h-4" aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
