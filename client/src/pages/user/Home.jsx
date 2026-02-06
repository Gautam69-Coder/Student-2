
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { SubjectCard } from '@/components/user/subject-card';
import { PracticalCard } from '@/components/user/practical-card';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Home({ userName, subjects, practicals, subjectPracticals }) {
    const navigate = useNavigate();
    const [selectedSubject, setSelectedSubject] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };


    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const handleSubjectClick = (subject) => {
        navigate('/dashboard/practicals', { state: { selectedSubject: subject.name || subject } });
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Welcome Banner - Ultra-Premium Glassmorphism */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl glass-card sm:p-8 p-5"
            >
                {/* Animated Gradient Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 mb-3">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">Good Morning</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        Hello, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{userName}</span>
                    </h1>
                    <p className="hidden md:block text-slate-600 dark:text-slate-300 max-w-xl text-base sm:text-lg leading-relaxed">
                        Ready to learn? You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">3 practicals</span> pending and <span className="text-lime-500 dark:text-lime-400 font-bold">2 PYQs</span> to review.
                    </p>

                    <div className="flex flex-wrap sm:gap-4 gap-3 mt-8">
                        <div className="flex flex-col glass-card p-4 rounded-xl min-w-[110px] items-center sm:items-start hover:border-indigo-500/30 transition-all group">
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{subjects.length}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Active Subjects</p>
                        </div>
                        <div className="hidden sm:block w-px h-14 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                        <div className="flex flex-col glass-card p-4 rounded-xl min-w-[110px] items-center sm:items-start hover:border-indigo-500/30 transition-all group">
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{practicals.map((practical) => practical.questions.length).reduce((a, b) => a + b, 0)}</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Total Questions</p>
                        </div>
                        <div className="hidden sm:block w-px h-14 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                        <div className="flex flex-col glass-card p-4 rounded-xl min-w-[110px] items-center sm:items-start hover:border-lime-500/30 transition-all group">
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-lime-500 transition-colors">68%</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">Progress</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Subjects Grid - Premium Glassmorphism */}
            <motion.div variants={itemVariants} className='glass-card rounded-2xl p-5'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Current Subjects</h2>
                    <Link
                        to="/dashboard/practicals"
                        className="group flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 gap-1 px-4 py-2 glass-card rounded-lg transition-all"
                    >
                        View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 sm:gap-5 gap-3">
                    {subjects.map((subject, index) => (
                        <SubjectCard
                            key={index}
                            subject={subject}
                            index={index}
                            subjectPracticals={subjectPracticals}
                            onClick={() => handleSubjectClick(subject)}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Recent Practicals - Enhanced Data Density */}
            <motion.div variants={itemVariants} className='glass-card p-5 rounded-2xl'>
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
                    {practicals.toReversed().slice(0, 2).map((practical, index) => (
                        <PracticalCard key={index} practical={practical} />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
