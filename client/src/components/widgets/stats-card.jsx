import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function StatsCard({ title, value, change, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="surface-card rounded-2xl p-5 sm:p-6"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-secondary border border-border">
                    <Icon className="w-5 h-5" style={{ color }} aria-hidden="true" />
                </div>
                {change && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 tabular-nums">
                        <TrendingUp className="w-3 h-3" aria-hidden="true" />
                        {change}
                    </div>
                )}
            </div>
            <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight tabular-nums">
                    {value}
                </p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                    {title}
                </p>
            </div>
        </motion.div>
    );
}
