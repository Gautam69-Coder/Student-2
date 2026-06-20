import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, X, Sparkles, Layers, BookOpen, Plus } from "lucide-react";
import { createSection, deleteSection } from "@/Api/api";
import { getLenis } from "@/hooks/useLenis";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { theme } from "@/lib/theme";

const StatTile = ({ label, value }) => {
    return (
        <div
            className="rounded-2xl border px-4 py-3"
            style={{
                background: theme.colors.softGray,
                borderColor: theme.colors.lightGray,
            }}
        >
            <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                {label}
            </div>
            <div className="text-lg font-bold mt-1" style={{ color: theme.colors.dark }}>
                {value}
            </div>
        </div>
    );
};

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
                        className="absolute inset-0"
                        style={{ background: "rgba(17,17,19,0.30)" }}
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        className="relative z-10 w-full max-w-6xl h-[88vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                        }}
                    >
                        <div
                            className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b"
                            style={{ borderColor: theme.colors.lightGray }}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: theme.colors.limeDim }}
                                >
                                    <Layers className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-black" style={{ color: theme.colors.dark }}>
                                        Manage Subjects
                                    </h2>
                                    <p className="text-sm font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                                        Create and organize subject sections for your practicals
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl border transition-colors hover:bg-slate-50 shrink-0"
                                style={{
                                    background: theme.colors.white,
                                    color: theme.colors.darkGray,
                                    borderColor: theme.colors.lightGray,
                                }}
                                aria-label="Close manage subjects modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6" data-lenis-prevent>
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
                                <Card
                                    className="xl:col-span-2 rounded-2xl"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                    }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ background: theme.colors.limeDim }}
                                            >
                                                <Plus className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                                                    Add New Subject
                                                </CardTitle>
                                                <p className="text-[13px] font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                                                    Create a section that can later hold practicals
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2" style={{ color: theme.colors.dark }}>
                                                    Subject Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Machine Learning"
                                                    value={newSubject}
                                                    onChange={(e) => setNewSubject(e.target.value)}
                                                    className="w-full px-4 h-12 rounded-xl border outline-none transition-colors"
                                                    style={{
                                                        background: theme.colors.softGray,
                                                        borderColor: theme.colors.lightGray,
                                                        color: theme.colors.dark,
                                                    }}
                                                />
                                            </div>

                                            <button
                                                onClick={handleAddSection}
                                                disabled={isSubmitting || !newSubject.trim()}
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                                                style={{
                                                    background: theme.colors.lime,
                                                    color: theme.colors.dark,
                                                    boxShadow: "0 8px 0 rgba(17,17,19,0.14)",
                                                }}
                                            >
                                                <Plus className="w-4 h-4" />
                                                {isSubmitting ? "Creating..." : "Create Subject"}
                                            </button>

                                            <div className="grid grid-cols-2 gap-3">
                                                <StatTile label="Total Sections" value={sectionCount} />
                                                <StatTile label="Related Practicals" value={subjectCount} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="xl:col-span-3 rounded-2xl overflow-hidden"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                                    }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ background: theme.colors.limeDim }}
                                            >
                                                <BookOpen className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                                                    Existing Sections
                                                </CardTitle>
                                                <p className="text-[13px] font-medium mt-1" style={{ color: theme.colors.darkGray }}>
                                                    Review and remove sections you no longer need
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[640px] border-separate border-spacing-0">
                                                <thead>
                                                    <tr style={{ background: theme.colors.softGray }}>
                                                        <Th>Sr No.</Th>
                                                        <Th>Section</Th>
                                                        <Th>Practical Notes</Th>
                                                        <Th className="text-right">Actions</Th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {uniqueSubjectSections.map((sub, idx) => (
                                                        <tr
                                                            key={sub._id || idx}
                                                            className="border-t border-slate-100 hover:bg-lime-50/60 transition-colors"
                                                        >
                                                            <Td className="font-bold text-slate-500">{idx + 1}</Td>
                                                            <Td className="font-semibold text-slate-900">{sub.name}</Td>
                                                            <Td className="text-slate-500">
                                                                {subjects.filter((s) => s.section === sub.name).length || 0}
                                                            </Td>
                                                            <Td className="text-right">
                                                                <button
                                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors hover:bg-red-50"
                                                                    style={{
                                                                        background: theme.colors.white,
                                                                        borderColor: theme.colors.lightGray,
                                                                        color: "#DC2626",
                                                                    }}
                                                                    onClick={() => handleDeleteSection(sub._id)}
                                                                    aria-label={`Delete ${sub.name}`}
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </Td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {!uniqueSubjectSections.length && (
                                            <div
                                                className="rounded-2xl border p-8 text-center mt-4"
                                                style={{
                                                    background: theme.colors.softGray,
                                                    borderColor: theme.colors.lightGray,
                                                }}
                                            >
                                                <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: theme.colors.darkGray }} />
                                                <div className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                                    No sections yet
                                                </div>
                                                <div className="text-sm mt-1" style={{ color: theme.colors.darkGray }}>
                                                    Create your first subject to start organizing practicals.
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
        <th
            className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500 ${className}`}
        >
            {children}
        </th>
    );
}

function Td({ children, className = "" }) {
    return <td className={`px-5 py-4 align-middle text-sm ${className}`}>{children}</td>;
}

export default AddSections;
