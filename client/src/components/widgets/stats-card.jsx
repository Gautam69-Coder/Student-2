
import React from "react"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function StatsCard({ title, value, change, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="neo-flat p-6 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="p-3 rounded-xl shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41]">
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[inset_1px_1px_2px_#c8d0e7,inset_-1px_-1px_2px_#ffffff] dark:shadow-[inset_1px_1px_2px_#0f121b,inset_-1px_-1px_2px_#272e41] text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    {change}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">{title}</p>
            </div>
        </motion.div>
    )
}
