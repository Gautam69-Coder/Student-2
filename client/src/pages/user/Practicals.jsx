
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { PracticalCard } from '../../components/user/practical-card';
import { SEO } from '@/components/common/SEO';

export function Practicals({ practicals, subjects, setPracticalUploadOpen, requireAuth }) {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sm:space-y-6 space-y-3 sm:p-4 p-2">
            <SEO
                title="BSc IT Practicals Solutions | Student Hub"
                description="Comprehensive   and BSc IT practical solutions for Mumbai students. Access verified code and implementation guides."
                url="/dashboard/practicals"
            />
            <div className="flex flex-col sm:gap-4 gap-2">
                <div className="flex justify-between items-end">
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all 
                       bg-white hover:dark:bg-white hover:dark:text-black dark:bg-slate-800 text-black dark:text-white shadow-md border border-slate-200 dark:border-slate-700
                        `}
                        onClick={() => { setPracticalUploadOpen(true) }}
                    >
                        Add Practical
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Subject Filters */}
                    {subjects.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide border dark:border-slate-800 rounded-2xl p-2 bg-white dark:bg-slate-900">
                            {subjects.map((subject, index) => {
                                const subjectName = subject.name || subject;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => { setSelectedSubject(subjectName); }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedSubject === subjectName
                                            ? "bg-white dark:bg-slate-800 text-black dark:text-white shadow-md border border-slate-200 dark:border-slate-700"
                                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        {subjectName}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Practical Number Filters */}
                    {uniquePracticalNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
                            <div className=" text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mr-2 ">Practical No:</div>
                            {uniquePracticalNumbers.map((num, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPracticalNo(num)}
                                    className={`h-8 px-3 min-w-8 flex items-center justify-center rounded-full text-xs font-bold transition-all shrink-0 ${selectedPracticalNo === num
                                        ? "bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div >


            <div className="sm:w-full ">
                {filteredPracticals.map((practical, index) => (
                    <PracticalCard
                        key={index}
                        practical={practical}
                        requireAuth={requireAuth}
                    />
                ))}
            </div>

            {
                filteredPracticals.length === 0 && (
                    <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                        No practicals found for the selected criteria.
                    </div>
                )
            }
        </motion.div >
    );
}
