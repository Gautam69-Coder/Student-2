
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

    useEffect(() => {
        console.log(subjectPracticals);       
    }, []);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const handleSubjectClick = (subject) => {
        navigate('/dashboard/practicals', { state: { selectedSubject: subject.name || subject } });
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Welcome Banner - Minimal Paper Card */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-xl bg-white sm:p-8 p-4 border border-[#E5E5E5] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            >
                {/* Subtle Abstract Pattern */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50/80 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-slate-500 mb-3">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium uppercase tracking-wider">Good Morning</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Hello, {userName}</h1>
                    <p className="hidden text-slate-500 max-w-xl text-lg font-light leading-relaxed">
                        Ready to learn? You have <span className="text-slate-900 font-medium">3 practicals</span> pending and <span className="text-slate-900 font-medium">2 PYQs</span> to review.
                    </p>

                    <div className=" flex flex-wrap sm:gap-6 gap-3  mt-8">
                        <div className="flex flex-col border p-2 rounded-2xl">
                            <p className="sm:text-3xl text-[15px] font-bold text-slate-900">{subjects.length}</p>
                            <p className="sm:text-sm text-[15px] text-slate-500 font-medium">Active Subjects</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex flex-col border p-2 rounded-2xl">
                            <p className="sm:text-3xl text-[15px] font-bold text-slate-900">{practicals.map((practical) => practical.questions.length).reduce((a, b) => a + b, 0)}</p>
                            <p className="sm:text-sm text-[15px] text-slate-500 font-medium">Notes Uploaded</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200" />
                        <div className="flex flex-col border p-2 rounded-2xl">
                            <p className="sm:text-3xl text-[15px] font-bold text-slate-900">68%</p>
                            <p className="sm:text-sm text-[15px] text-slate-500 font-medium">Progress</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Subjects Grid - Bento Style */}
            <motion.div variants={itemVariants} className='border rounded-2xl p-4'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Current Subjects</h2>
                    <Link
                        to="/dashboard/practicals"
                        className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-900 gap-1 px-3 py-2 rounded-md transition-colors"
                    >
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-4">
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

            {/* Recent Practicals */}
            <motion.div variants={itemVariants} className='border p-4 rounded-2xl'>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Practicals</h2>
                    <Link
                        to="/dashboard/practicals"
                        className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-900 gap-1 px-3 py-2 rounded-md transition-colors"
                    >
                        View All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {practicals.slice(0, 2).map((practical, index) => (
                        <PracticalCard key={index} practical={practical} />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
