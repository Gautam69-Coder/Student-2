
import React from 'react';
import { motion } from 'framer-motion';

export function AnalyticsDashboard() {
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

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">User Growth</h3>
                    <div className="h-56 flex items-end justify-between gap-3">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="flex-1 bg-slate-900 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-[#E5E5E5] shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Content Distribution</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Notes", value: 45, color: "#0f172a" },
                            { label: "Practicals", value: 30, color: "#64748b" },
                            { label: "PYQs", value: 25, color: "#cbd5e1" },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-700">{item.label}</span>
                                    <span className="text-slate-900">{item.value}%</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
