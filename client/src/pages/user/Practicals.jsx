
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { PracticalCard } from '../../components/user/practical-card';
import { SEO } from '@/components/common/SEO';
import AddSections from '@/components/user/add-sections';
import { DashboardLayout, DashboardSidebar } from '@/components/dashboard';
import { FileText, Users, MessageSquare, FlaskConical, Code2, Info, Home } from 'lucide-react';
import { theme } from '@/lib/theme';

export function Practicals({ practicals, subjects, setPracticalUploadOpen, requireAuth }) {
    const location = useLocation();
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedPracticalNo, setSelectedPracticalNo] = useState("");
    const [showAddSection, setShowAddSection] = useState(false);
    const [uniqueSubjectSections, setUniqueSubjectSections] = useState(subjects);
    const [searchQuery, setSearchQuery] = useState("");
    const [isBell, setIsBell] = useState(false);

    const navItems = [
        { label: "Home", icon: Home, path: "/dashboard" },
        { label: "Notes", icon: FileText, path: "/dashboard/notes" },
        { label: "Practicals", icon: FlaskConical, path: "/dashboard/practicals", active: true },
        { label: "Practice", icon: Code2, path: "/dashboard/coding-practice" },
        { label: "Community", icon: Users, path: "/dashboard/community" },
        { label: "Feedback", icon: MessageSquare, path: "/dashboard/feedback" },
        { label: "About", icon: Info, path: "/dashboard/about" },
    ];





    // Set default subject when subjects load or when navigating from Home
    useEffect(() => {
        if (location.state?.selectedSubject) {
            setSelectedSubject(location.state.selectedSubject);
        } else if (subjects && subjects.length > 0 && !selectedSubject) {
            const firstSubject = subjects[0].name || subjects[0];
            setSelectedSubject(firstSubject);
        }
    }, [subjects, location.state]);

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

    if (!selectedSubject && subjects.length > 0) {
        return null; // or loading state
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <SEO
                title="BSc IT Practicals Solutions | Student Hub"
                description="Comprehensive and BSc IT practical solutions for Mumbai students. Access verified code and implementation guides."
                url="/dashboard/practicals"
            />
            <DashboardLayout
                // sidebar={
                //     <DashboardSidebar
                //         navItems={navItems}
                //         userName="Student Name"
                //         userEmail="student@email.com"
                //         searchQuery={searchQuery}
                //         setSearchQuery={setSearchQuery}
                //         isBell={isBell}
                //         setisBell={setIsBell}
                //     />
                // }
                // topNavProps={{
                //     userName: "Lucas Bennett",
                //     userEmail: "bennett02@gmail.com",
                //     userAvatar: "https://i.pravatar.cc/150?img=33",
                //     searchQuery: searchQuery,
                //     setSearchQuery: setSearchQuery,
                //     isBell: isBell,
                //     setisBell: setIsBell,
                // }}
            >
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
                                            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-black uppercase tracking-[0.18em]"
                                            style={{
                                                background: theme.colors.limeDim,
                                                color: theme.colors.dark,
                                                borderColor: theme.colors.limeDim,
                                            }}
                                        >
                                            <FlaskConical className="w-4 h-4" />
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

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                                    <button
                                        className="px-4 py-3 rounded-xl text-sm font-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
                                        style={{ background: theme.colors.lime, color: theme.colors.dark, boxShadow: "0 8px 0 rgba(17,17,19,0.12)" }}
                                        onClick={() => setShowAddSection(true)}
                                    >
                                        Add Section
                                    </button>
                                    <button
                                        className="px-4 py-3 rounded-xl text-sm font-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
                                        style={{ background: theme.colors.lime, color: theme.colors.dark, boxShadow: "0 8px 0 rgba(17,17,19,0.12)" }}
                                        onClick={() => setPracticalUploadOpen(true)}
                                    >
                                        Add Practical
                                    </button>
                                </div>
                            </div>

                            {/* Subject Filter Tabs */}
                            {subjects.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-sm font-semibold" style={{ color: theme.colors.darkGray }}>SUBJECT</span>
                                        <div className="h-[1px] flex-1" style={{ background: theme.colors.lightGray }} />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {subjects.map((subject, index) => {
                                            const subjectName = subject.name || subject;
                                            const isActive = selectedSubject === subjectName;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => { setSelectedSubject(subjectName); }}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                                                    style={{
                                                        background: isActive ? theme.colors.lime : theme.colors.white,
                                                        color: isActive ? theme.colors.dark : theme.colors.darkGray,
                                                        border: `1px solid ${theme.colors.lightGray}`,
                                                    }}
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
                                    <div className="flex gap-2 overflow-x-auto">
                                        {uniquePracticalNumbers.map((num, index) => {
                                            const isActive = selectedPracticalNo === num;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedPracticalNo(num)}
                                                    className="w-9 h-9 rounded-xl text-sm font-black transition-all flex items-center justify-center"
                                                    style={{
                                                        background: isActive ? theme.colors.lime : theme.colors.white,
                                                        color: isActive ? theme.colors.dark : theme.colors.darkGray,
                                                        border: `1px solid ${theme.colors.lightGray}`,
                                                    }}
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
                                requireAuth={requireAuth}
                            />
                        ))}
                        {filteredPracticals.length === 0 && (
                            <div className="text-center py-20" style={{ color: theme.colors.darkGray }}>
                                No practicals found for the selected criteria.
                            </div>
                        )}
                    </div>
                </div>


                {showAddSection && (
                    <AddSections
                        isOpen={showAddSection}
                        onClose={() => { setShowAddSection(false) }}
                        uniqueSubjectSections={uniqueSubjectSections}
                        subjects={practicals}
                        setUniqueSubjectSections={setUniqueSubjectSections}
                    />
                )}
            </DashboardLayout>
        </motion.div>
    );
}
