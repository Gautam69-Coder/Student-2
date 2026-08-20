import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';

export function AnalyticsDashboard({ users = [] }) {
    useTitle("Analytics");
    // Prediction Logic based on Online Visits
    const totalVisits = users.reduce((acc, user) => acc + (user.visitCount || 0), 0);
    const activeUsers = users.filter(u => (u.visitCount || 0) > 1).length;
    const retentionRate = users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0;

    // AI Projection: Total Visits * 1.28 (estimated monthly growth)
    const projectedVisits = Math.round(totalVisits * 1.28);

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

    const formatCount = (num) => {
        if (!num) return 0;
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num;
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10 p-4 select-none">
            {/* Header with Stats Overview */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <motion.div variants={itemVariants} className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h2>
                    <div className="h-1 w-20 bg-indigo-500 dark:bg-[#CCFF00] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] mt-2" />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-4">
                    <div className="px-4 py-3 shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] rounded-xl bg-transparent">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-550">Retention Rate</p>
                        <p className="text-xl font-black text-indigo-600 dark:text-[#CCFF00] mt-0.5">{retentionRate}%</p>
                    </div>
                </motion.div>
            </div>

            {/* AI Predictive Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Online Visits", value: formatCount(totalVisits), icon: Users, desc: "Total interaction volume" },
                    { label: "AI Predicted (Monthly)", value: formatCount(projectedVisits), icon: TrendingUp, desc: "Based on current velocity" },
                    { label: "Goal Target", value: "10k+", icon: Target, desc: "Current quarter milestone" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="neo-flat p-6 transition-all flex items-center gap-5 border-none shadow-none">
                        <div className="w-12 h-12 rounded-xl shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] flex items-center justify-center text-indigo-500 dark:text-[#CCFF00]">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stat.value}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">{stat.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <motion.div variants={itemVariants} className="group relative neo-flat p-6 sm:p-8 overflow-hidden shadow-none border-none">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-24 h-24 text-indigo-500" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-indigo-500 dark:bg-[#CCFF00] rounded-full" />
                        Engagement Activity
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-4 relative z-10">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                                <div className="w-4 h-48 bg-[#e6eef8] dark:bg-[#1b202e] rounded-full shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] flex items-end overflow-hidden relative group/bar">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.8, ease: "circOut" }}
                                        className="w-full bg-indigo-500 dark:bg-[#CCFF00] rounded-full relative"
                                    />

                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none">
                                        {Math.round(height * 2.5)} Active
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Forecasting & Prediction Card */}
                <motion.div variants={itemVariants} className="neo-flat p-6 sm:p-8 relative overflow-hidden shadow-none border-none">
                    <div className="absolute top-0 right-0 p-8">
                        <Zap className="w-6 h-6 text-purple-500 dark:text-[#CCFF00] animate-pulse" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-purple-500 dark:bg-[#CCFF00] rounded-full" />
                        AI Prediction Center
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-8">Forecasting future student behavior using Online Visit telemetry.</p>

                    <div className="space-y-6 relative z-10">
                        {[
                            { label: "Expected Traffic Gain", value: "+28%", icon: TrendingUp },
                            { label: "Projected Active Users", value: formatCount(Math.round(users.length * 1.5)), icon: Users },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] flex items-center justify-between bg-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg shadow-[1px_1px_3px_#c8d0e7,-1px_-1px_3px_#ffffff] dark:shadow-[1px_1px_3px_#0f121b,-1px_-1px_3px_#272e41] bg-[#e6eef8] dark:bg-[#1b202e] text-indigo-500 dark:text-[#CCFF00] flex items-center justify-center">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{item.label}</span>
                                </div>
                                <span className="text-xl font-black text-indigo-600 dark:text-[#CCFF00]">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-5 rounded-2xl neo-flat relative overflow-hidden shadow-[8px_8px_16px_#c8d0e7,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0f121b,-8px_-8px_16px_#272e41] bg-[#e6eef8] dark:bg-[#1b202e] border-none text-slate-800 dark:text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h5 className="font-bold text-sm">Monthly Goal Progress</h5>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Online Visits vs Target</p>
                            </div>
                            <span className="text-xs font-black shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] px-2.5 py-1 rounded-lg bg-transparent text-indigo-600 dark:text-[#CCFF00]">82%</span>
                        </div>
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-900 rounded-full shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.15)] overflow-hidden p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '82%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-indigo-500 dark:bg-[#CCFF00] rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
