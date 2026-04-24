
import React, { useMemo, useCallback, useEffect } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { SubjectCard } from '../../components/user/subject-card';
import { PracticalCard } from '../../components/user/practical-card';
import { Link, useNavigate } from 'react-router-dom';
import { PracticalCardSkeleton } from '@/components/common/skeleton';
import { useTitle } from '@/hooks/useTitle';
import { sendTrackerHome } from "@/Api/api"
import { toUpperName } from '../../Utils/ToUpperName';



export function Home({ userName, subjects, practicals, subjectPracticals, loadingPracticals, requireAuth, stats = {} }) {
    useTitle("Home");
    const navigate = useNavigate();


    const trackHome = async () => {
        let section="home";
        const track = await sendTrackerHome(section);
        // console.log(track.data);
    }

    useEffect(() => {
        trackHome();
    }, [])


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

    const notesCount = stats.notesCount ?? 0;
    const visitCount = stats.visitCount ?? 0;
    const lastVisit = stats.lastVisit ? new Date(stats.lastVisit) : null;

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
                    <div className='sm:flex flex-wrap justify-between font-black mb-4 tracking-tight leading-tight'>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                            Welcome back, <br />
                            <span className="bg-linear-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 bg-clip-text text-transparent">
                                {toUpperName(userName)}!
                            </span>
                        </h1>

                        <div className='space-y-2 text-green-500 dark:text-green-400 text-sm font-medium '>
                            <div>
                                {new Date().toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    timeZone: 'Asia/Kolkata',
                                })}
                            </div>
                            <div>
                                {new Date().toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                    timeZone: 'Asia/Kolkata',
                                })}
                            </div>
                        </div>
                    </div>
                    <p className="hidden md:block text-slate-600 dark:text-slate-300 max-w-xl text-base sm:text-lg leading-relaxed">
                        You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{practicals.length} practical sets</span> with{" "}
                        <span className="text-lime-500 dark:text-lime-400 font-bold">{totalQuestions} questions</span> ready to explore today.
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

                    {/* Quick actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            to="/dashboard/practicals"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
                        >
                            Browse Practicals
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/dashboard/notes"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Open My Notes
                        </Link>
                        <Link
                            to="/dashboard/community"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                            Ask Community
                        </Link>
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

            {/* Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-4 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Notes Created
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {notesCount}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Personal notes saved in your workspace.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-4 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Visits
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {visitCount}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Times you’ve logged into Student Hub.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-4 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Last Active
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {lastVisit
                            ? lastVisit.toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'First time here 🎉'}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Based on your recent login activity.
                    </p>
                </div>
            </div>

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
                                requireAuth={requireAuth}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
