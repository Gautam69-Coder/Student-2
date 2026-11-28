import React from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Users, Target, Zap } from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

export function AnalyticsDashboard({ users = [] }) {
    useTitle("Analytics");

    const totalVisits = users.reduce((acc, user) => acc + (user.visitCount || 0), 0);
    const activeUsers = users.filter((u) => (u.visitCount || 0) > 1).length;
    const retentionRate = users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0;
    const projectedVisits = Math.round(totalVisits * 1.28);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
    };

    const formatCount = (num) => {
        if (!num) return 0;
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        return num;
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div variants={itemVariants} className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        Analytics Dashboard
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">
                        Student engagement metrics and retention forecasts
                    </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="surface-card px-4 py-3 rounded-2xl flex items-center gap-3">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Retention Rate
                            </p>
                            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                {retentionRate}%
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Online Visits", value: formatCount(totalVisits), icon: Users, desc: "Cumulative visits" },
                    { label: "Predicted (Monthly)", value: formatCount(projectedVisits), icon: TrendingUp, desc: "Based on current velocity" },
                    { label: "Goal Target", value: "10k+", icon: Target, desc: "Current quarter milestone" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="surface-card rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-primary shrink-0">
                            <stat.icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </p>
                            <h3 className="text-2xl font-extrabold text-foreground mt-0.5 tabular-nums">
                                {stat.value}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="group relative surface-card rounded-3xl p-6 sm:p-8 overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Activity className="w-24 h-24 text-primary" aria-hidden="true" />
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-primary rounded-full" />
                        Engagement Activity
                    </h3>

                    <div className="h-60 flex items-end justify-between gap-4 relative z-10">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
                                <div className="w-5 sm:w-6 h-48 bg-secondary rounded-full flex items-end overflow-hidden relative group/bar border border-border">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full bg-gradient-to-t from-indigo-600 to-emerald-500 rounded-full"
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-border text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none shadow-sm">
                                        {Math.round(height * 2.5)} Active
                                    </div>
                                </div>
                                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="surface-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                                Prediction Center
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Forecasting student activity from visit telemetry.
                            </p>
                        </div>
                        <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    </div>

                    <div className="space-y-3">
                        {[
                            { label: "Expected Traffic Gain", value: "+28%", icon: TrendingUp },
                            { label: "Projected Active Users", value: formatCount(Math.round(users.length * 1.5)), icon: Users },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-2xl border border-border bg-background flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-500/10 text-primary">
                                        <item.icon className="w-4 h-4" aria-hidden="true" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="text-xl font-extrabold text-primary tabular-nums">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-5 rounded-2xl border border-border bg-background space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-sm text-foreground">Monthly Goal Progress</h4>
                                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Online Visits vs Target
                                </p>
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 tabular-nums">
                                82%
                            </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "82%" }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
