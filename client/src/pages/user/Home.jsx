
import React, { useMemo, useCallback } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { SubjectCard } from '../../components/user/subject-card';
import { PracticalCard } from '../../components/user/practical-card';
import { Link, useNavigate } from 'react-router-dom';
import { PracticalCardSkeleton } from '@/components/common/skeleton';
import { useTitle } from '@/hooks/useTitle';

export function Home({ userName, subjects, practicals, subjectPracticals, loadingPracticals, userBookmarks, onToggleBookmark }) {
    useTitle("Home");
    const navigate = useNavigate();

    const handleSubjectClick = useCallback((subject) => {
        navigate('/dashboard/practicals', { state: { selectedSubject: subject.name || subject } });
    }, [navigate]);

    // Memoize total questions calculation
    const totalQuestions = useMemo(() => {
        return practicals.reduce((acc, practical) => acc + practical.questions.length, 0);
    }, [practicals]);

    // Memoize recent practicals list to avoid re-reversing on every render
    const recentPracticals = useMemo(() => {
        return [...practicals].reverse().slice(0, 2);
    }, [practicals]);

    // Memoize saved practicals
    const savedPracticals = useMemo(() => {
        if (!userBookmarks || !practicals) return [];
        return practicals.filter(p => userBookmarks.includes(p._id));
    }, [practicals, userBookmarks]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Welcome Banner - Ultra-Premium Glassmorphism */}
            <div className="relative overflow-hidden rounded-2xl glass-card sm:p-8 p-5">
                {/* Simplified Gradient Background - Static */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-purple-500/10 via-cyan-500/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 mb-3">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">Good Morning</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                        Welcome back, <br />
                        <span className="bg-linear-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 bg-clip-text text-transparent">
                            {userName}!
                        </span>
                    </h1>
                    <p className="hidden md:block text-slate-600 dark:text-slate-300 max-w-xl text-base sm:text-lg leading-relaxed">
                        Ready to learn? You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">3 practicals</span> pending and <span className="text-lime-500 dark:text-lime-400 font-bold">2 PYQs</span> to review.
                    </p>

                    <div className="flex flex-wrap sm:gap-4 gap-3 mt-8">
                        <div className="flex flex-col glass-card p-4 rounded-xl min-w-[110px] items-center sm:items-start hover:border-indigo-500/30 transition-all group">
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{subjects.length}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Active Subjects</p>
                        </div>
                        <div className="hidden sm:block w-px h-14 bg-linear-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                        <div className="flex flex-col glass-card p-4 rounded-xl min-w-[110px] items-center sm:items-start hover:border-indigo-500/30 transition-all group">
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{totalQuestions}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Total Questions</p>
                        </div>
                        <div className="hidden sm:block w-px h-14 bg-linear-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                        <div className="flex flex-col glass-card p-4 rounded-xl min-w-[110px] items-center sm:items-start hover:border-lime-500/30 transition-all group">
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-lime-500 transition-colors">68%</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid - Premium Glassmorphism */}
            <div className='glass-card rounded-2xl p-5'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Current Subjects</h2>
                    <Link
                        to="/dashboard/practicals"
                        className="group flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 gap-1 px-4 py-2 glass-card rounded-lg transition-all"
                    >
                        View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 sm:gap-5 gap-3">
                    {subjects.map((subject, index) => (
                        <SubjectCard
                            key={subject.name || subject._id || index}
                            subject={subject}
                            index={index}
                            subjectPracticals={subjectPracticals}
                            onClick={() => handleSubjectClick(subject)}
                        />
                    ))}
                </div>
            </div>

            {/* Saved Practicals Section */}
            {savedPracticals.length > 0 && (
                <div className='glass-card p-5 rounded-2xl'>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Saved Practicals</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {savedPracticals.map((practical) => (
                            <PracticalCard
                                key={practical._id}
                                practical={practical}
                                isBookmarked={true}
                                onToggleBookmark={onToggleBookmark}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Practicals - Enhanced Data Density */}
            <div className='glass-card p-5 rounded-2xl'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Practicals</h2>
                    <Link
                        to="/dashboard/practicals"
                        className="group flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 gap-1 px-4 py-2 glass-card rounded-lg transition-all"
                    >
                        View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {loadingPracticals ? (
                        <>
                            <PracticalCardSkeleton />
                            <PracticalCardSkeleton />
                        </>
                    ) : (
                        recentPracticals.map((practical, index) => (
                            <PracticalCard
                                key={practical._id || index}
                                practical={practical}
                                isBookmarked={userBookmarks?.includes(practical._id)}
                                onToggleBookmark={onToggleBookmark}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
