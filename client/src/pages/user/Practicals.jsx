
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';
import { PracticalCard } from '@/components/features/practicals/practical-card';
import { SEO } from '@/components/common/SEO';
import { DashboardLayout } from "@/components/layout/layout";
import { FlaskConical } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useData } from '@/context/DataContext';
import { canAccessPracticals } from '@/Utils/vesCheck';

export function Practicals() {
    const { practicals, subjects, user } = useData();
    const location = useLocation();

    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedPracticalNo, setSelectedPracticalNo] = useState("");

    // Set default subject when subjects load or when navigating from Home
    useEffect(() => {
        if (location.state?.selectedSubject) {
            setSelectedSubject(location.state.selectedSubject);
        } else if (subjects && subjects.length > 0 && !selectedSubject) {
            const firstSubject = subjects[0].name || subjects[0];
            setSelectedSubject(firstSubject);
        }
    }, [subjects, location.state, selectedSubject]);

    // Get unique practical numbers based on selected subject
    const availablePracticals = useMemo(() => {
        if (!selectedSubject) return [];
        return practicals.filter(p => p.section === selectedSubject);
    }, [selectedSubject, practicals]);

    // sorting logically (numeric or string)
    const uniquePracticalNumbers = useMemo(() => {
        return [...new Set(availablePracticals.map(p => p.practicalNumber))]
            .sort((a, b) => a.toString().localeCompare(b.toString(), undefined, { numeric: true }));
    }, [availablePracticals]);

    // Select first practical number when numbers are available
    useEffect(() => {
        if (uniquePracticalNumbers.length > 0) {
            setSelectedPracticalNo(uniquePracticalNumbers[0]);
        }
    }, [uniquePracticalNumbers]);

    const filteredPracticals = practicals.filter(p => {
        if (!selectedSubject) return false;
        const matchesSubject = p.section === selectedSubject;
        const matchesNumber = p.practicalNumber === selectedPracticalNo;
        return matchesSubject && matchesNumber;
    });

    if (!canAccessPracticals(user)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!selectedSubject && subjects.length > 0) {
        return null; // or loading state
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <SEO
                title="  Practicals Solutions | Student Hub"
                description="Comprehensive and   practical solutions for Mumbai students. Access verified code and implementation guides."
                url="/dashboard/practicals"
            />
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Home-like Header Card */}
                    <div
                        className="rounded-2xl border"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 10px 0 rgba(17,17,19,0.04)",
                        }}
                    >
                        <div className="p-5 sm:p-6 lg:p-8">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span
                                            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-black uppercase tracking-[0.18em] bg-indigo-50/50 text-indigo-700 border-indigo-150"
                                        >
                                            <FlaskConical className="w-4 h-4 text-indigo-650" />
                                            Practicals
                                        </span>
                                        <span
                                            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold"
                                            style={{
                                                background: theme.colors.white,
                                                color: theme.colors.dark,
                                                borderColor: theme.colors.lightGray,
                                            }}
                                        >
                                            Verified code & implementation guides
                                        </span>
                                    </div>

                                    <h1
                                        className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
                                        style={{ color: theme.colors.dark }}
                                    >
                                        Choose your practical
                                    </h1>
                                    <p
                                        className="mt-3 max-w-3xl text-sm sm:text-base leading-7"
                                        style={{ color: theme.colors.darkGray }}
                                    >
                                        Filter by subject and practical number, then open each question to view starter code.
                                    </p>
                                </div>
                            </div>

                            {/* Subject Filter Tabs */}
                            {subjects.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-sm font-semibold" style={{ color: theme.colors.darkGray }}>SUBJECT</span>
                                        <div className="h-[1px] flex-1" style={{ background: theme.colors.lightGray }} />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
                                        {subjects.map((subject, index) => {
                                            const subjectName = subject.name || subject;
                                            const isActive = selectedSubject === subjectName;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => { setSelectedSubject(subjectName); }}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${isActive
                                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {subjectName}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Practical Number Selector */}
                            {uniquePracticalNumbers.length > 0 && (
                                <div className="mt-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-sm font-semibold" style={{ color: theme.colors.darkGray }}>PRACTICAL NO</span>
                                        <div className="h-[1px] flex-1" style={{ background: theme.colors.lightGray }} />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto ">
                                        {uniquePracticalNumbers.map((num, index) => {
                                            const isActive = selectedPracticalNo === num;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedPracticalNo(num)
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-nowrap text-sm font-bold transition-all flex items-center justify-center border ${isActive
                                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Practical Cards */}
                    <div className="space-y-4">
                        {filteredPracticals.map((practical, index) => (
                            <PracticalCard
                                key={index}
                                practical={practical}
                            />
                        ))}
                        {filteredPracticals.length === 0 && (
                            <div className="text-center py-20" style={{ color: theme.colors.darkGray }}>
                                No practicals found for the selected criteria.
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </motion.div>
    );
}
