import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, X, Sparkles, Layers, BookOpen, Plus } from "lucide-react";
import { createSection, deleteSection } from "@/Api/api";
import { getLenis } from "@/hooks/useLenis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatTile = ({ label, value }) => (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="text-lg font-extrabold mt-1 text-foreground tabular-nums">{value}</div>
    </div>
);

const AddSections = ({
    isOpen,
    onClose,
    uniqueSubjectSections = [],
    subjects = [],
    setUniqueSubjectSections = () => {},
}) => {
    const [newSubject, setNewSubject] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const lenis = getLenis();
        if (isOpen) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            lenis?.start();
            document.body.style.overflow = "";
        }

        return () => {
            getLenis()?.start();
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const subjectCount = useMemo(() => subjects?.length || 0, [subjects]);
    const sectionCount = useMemo(() => uniqueSubjectSections?.length || 0, [uniqueSubjectSections]);

    const handleAddSection = async () => {
        const trimmed = newSubject.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await createSection(trimmed);
            setUniqueSubjectSections([...uniqueSubjectSections, res.data]);
            setNewSubject("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId);
            setUniqueSubjectSections(uniqueSubjectSections.filter((section) => section._id !== sectionId));
        } catch (error) {
            console.error(error);
        }
    };

    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-5xl h-[86vh] overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col"
                    >
                        <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-border bg-secondary/40">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/12 border border-indigo-500/25 text-primary flex items-center justify-center shrink-0">
                                    <Layers className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                                        Manage Subjects
                                    </h2>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                        Create and organize subject sections for your library
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                                aria-label="Close manage subjects modal"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-background" data-lenis-prevent>
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                                <Card className="xl:col-span-2 rounded-2xl py-0">
                                    <CardHeader className="p-5 pb-3">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-primary flex items-center justify-center shrink-0">
                                                <Plus className="w-5 h-5" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-foreground">
                                                    Add New Subject
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Create a section for notes and practicals
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-2 space-y-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="add-sec-name" className="block text-xs font-bold text-foreground">
                                                Subject Name
                                            </label>
                                            <input
                                                id="add-sec-name"
                                                type="text"
                                                placeholder="e.g. Machine Learning"
                                                value={newSubject}
                                                onChange={(e) => setNewSubject(e.target.value)}
                                                className="w-full px-4 min-h-[44px] rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddSection}
                                            disabled={isSubmitting || !newSubject.trim()}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 min-h-[44px] font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4" aria-hidden="true" />
                                            {isSubmitting ? "Creating..." : "Create Subject"}
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <StatTile label="Total Sections" value={sectionCount} />
                                            <StatTile label="Related Items" value={subjectCount} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="xl:col-span-3 rounded-2xl overflow-hidden py-0">
                                    <CardHeader className="p-5 pb-3 border-b border-border">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                <BookOpen className="w-5 h-5" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-foreground">
                                                    Existing Sections
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Review or remove sections you no longer need
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[540px] border-separate border-spacing-0">
                                                <thead>
                                                    <tr className="bg-secondary/40">
                                                        <Th>Sr No.</Th>
                                                        <Th>Section</Th>
                                                        <Th>Items</Th>
                                                        <Th className="text-right">Actions</Th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {uniqueSubjectSections.map((sub, idx) => (
                                                        <tr key={sub._id || idx} className="border-t border-border hover:bg-secondary/40 transition-colors">
                                                            <Td className="font-bold text-muted-foreground tabular-nums">{idx + 1}</Td>
                                                            <Td className="font-semibold text-foreground">{sub.name}</Td>
                                                            <Td className="text-muted-foreground tabular-nums">
                                                                {subjects.filter((s) => s.section === sub.name).length || 0}
                                                            </Td>
                                                            <Td className="text-right">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card text-destructive hover:bg-destructive/10 transition-colors"
                                                                    onClick={() => handleDeleteSection(sub._id)}
                                                                    aria-label={`Delete ${sub.name}`}
                                                                >
                                                                    <Trash className="w-4 h-4" aria-hidden="true" />
                                                                </button>
                                                            </Td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {!uniqueSubjectSections.length && (
                                            <div className="p-10 text-center">
                                                <Sparkles className="w-9 h-9 mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
                                                <div className="text-sm font-bold text-foreground">No sections yet</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Create your first subject to organize materials.
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

function Th({ children, className = "" }) {
    return (
        <th className={`px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border ${className}`}>
            {children}
        </th>
    );
}

function Td({ children, className = "" }) {
    return <td className={`px-5 py-3.5 align-middle text-sm border-b border-border ${className}`}>{children}</td>;
}

export default AddSections;
