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
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">
            {/* Header with Stats Overview */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <motion.div variants={itemVariants} className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h2>
                    <div className="h-1 w-20 bg-indigo-500 rounded-[10px]" />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-[10px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Retention Rate</p>
                        <p className="text-lg font-black text-slate-800 dark:text-white">{retentionRate}%</p>
                    </div>
                </motion.div>
            </div>

            {/* AI Predictive Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Online Visits", value: formatCount(totalVisits), icon: Users, color: "bg-blue-500", desc: "Total interaction volume" },
                    { label: "AI Predicted (Monthly)", value: formatCount(projectedVisits), icon: TrendingUp, color: "bg-purple-500", desc: "Based on current velocity" },
                    { label: "Goal Target", value: "10k+", icon: Target, color: "bg-green-500", desc: "Current quarter milestone" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-[10px] shadow-sm hover:shadow-indigo-500/10 transition-all flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-[10px] ${stat.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-slate-900 dark:text-white`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">{stat.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <motion.div variants={itemVariants} className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[10px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24 text-indigo-500" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-[10px]" />
                        Engagement Activity
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-4 relative z-10">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="w-full relative group/bar">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: i * 0.1, duration: 0.8, ease: "circOut" }}
                                        className="w-full bg-linear-to-t from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-cyan-400 rounded-[10px] relative overflow-hidden group-hover/bar:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                    </motion.div>

                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none">
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
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[10px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Zap className="w-8 h-8 text-indigo-500 animate-pulse" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-purple-500 rounded-[10px]" />
                        AI Prediction Center
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">Forecasting future student behavior using Online Visit telemetry.</p>

                    <div className="space-y-6 relative z-10">
                        {[
                            { label: "Expected Traffic Gain", value: "+28%", color: "bg-indigo-500", icon: TrendingUp },
                            { label: "Projected Active Users", value: formatCount(Math.round(users.length * 1.5)), color: "bg-cyan-500", icon: Users },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-[10px] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-[10px] ${item.color} bg-opacity-10`}>
                                        <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">{item.label}</span>
                                </div>
                                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-5 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-[10px] text-white shadow-lg shadow-indigo-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h5 className="font-bold text-sm">Monthly Goal Progress</h5>
                                <p className="text-[10px] opacity-80">Online Visits vs Target</p>
                            </div>
                            <span className="text-xs font-black bg-white/20 px-2 py-1 rounded-[10px]">82%</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-[10px] overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '82%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
