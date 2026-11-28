import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { PracticalCard } from "@/components/features/practicals/practical-card";
import { SEO } from "@/components/common/SEO";
import { DashboardLayout } from "@/components/layout/layout";
import { FlaskConical } from "lucide-react";
import { useData } from "@/context/DataContext";
import { usePracticals } from "@/hooks/usePracticals";
import { useSubjects } from "@/hooks/useSubjects";
import { canAccessPracticals } from "@/Utils/vesCheck";

export function Practicals() {
    const { user } = useData();
    const { practicals } = usePracticals();
    const { subjects } = useSubjects();
    const location = useLocation();

    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedPracticalNo, setSelectedPracticalNo] = useState("");

    useEffect(() => {
        if (location.state?.selectedSubject) {
            setSelectedSubject(location.state.selectedSubject);
        } else if (subjects && subjects.length > 0 && !selectedSubject) {
            const firstSubject = subjects[0].name || subjects[0];
            setSelectedSubject(firstSubject);
        }
    }, [subjects, location.state, selectedSubject]);

    const availablePracticals = useMemo(() => {
        if (!selectedSubject) return [];
        return practicals.filter((p) => p.section === selectedSubject);
    }, [selectedSubject, practicals]);

    const uniquePracticalNumbers = useMemo(() => {
        return [...new Set(availablePracticals.map((p) => p.practicalNumber))].sort((a, b) =>
            a.toString().localeCompare(b.toString(), undefined, { numeric: true })
        );
    }, [availablePracticals]);

    useEffect(() => {
        if (uniquePracticalNumbers.length > 0) {
            setSelectedPracticalNo(uniquePracticalNumbers[0]);
        }
    }, [uniquePracticalNumbers]);

    const filteredPracticals = practicals.filter((p) => {
        if (!selectedSubject) return false;
        return p.section === selectedSubject && p.practicalNumber === selectedPracticalNo;
    });

    if (!canAccessPracticals(user)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!selectedSubject && subjects.length > 0) {
        return null;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <SEO
                title="Practicals Solutions | Student Hub"
                description="Comprehensive practical solutions for students. Access verified code and implementation guides."
                url="/dashboard/practicals"
            />
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header Card */}
                    <div className="surface-card rounded-3xl p-5 sm:p-8">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                                    <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                                    Practicals Vault
                                </span>
                                <span className="inline-flex items-center rounded-full border border-border bg-background px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                                    Verified code & implementation guides
                                </span>
                            </div>

                            <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                Choose your practical
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                                Filter by subject and practical number, then inspect the starter code, preview attachments, or ask the AI Helper.
                            </p>
                        </div>

                        {/* Subject Filter Tabs */}
                        {subjects.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Subject
                                    </span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar w-full">
                                    {subjects.map((subject, index) => {
                                        const subjectName = subject.name || subject;
                                        const isActive = selectedSubject === subjectName;
                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setSelectedSubject(subjectName)}
                                                className={`px-4 min-h-[38px] rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                                                    isActive
                                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                        : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                                                }`}
                                            >
                                                {subjectName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Practical Number Selector */}
                        {uniquePracticalNumbers.length > 0 && (
                            <div className="mt-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Practical No.
                                    </span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                    {uniquePracticalNumbers.map((num, index) => {
                                        const isActive = selectedPracticalNo === num;
                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setSelectedPracticalNo(num)}
                                                className={`px-4 min-h-[38px] rounded-full text-nowrap text-xs font-bold font-mono transition-all border ${
                                                    isActive
                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                                        : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Practical Cards */}
                    <div className="space-y-4">
                        {filteredPracticals.map((practical, index) => (
                            <PracticalCard key={index} practical={practical} />
                        ))}
                        {filteredPracticals.length === 0 && (
                            <div className="surface-card rounded-2xl text-center py-16 text-sm font-medium text-muted-foreground">
                                No practicals found for the selected criteria.
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </motion.div>
    );
}
