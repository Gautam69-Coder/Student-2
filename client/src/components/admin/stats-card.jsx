
import React from "react"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function StatsCard({ title, value, change, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)" }}
            className="bg-white dark:bg-slate-900 rounded-[10px] p-6 border border-[#E5E5E5] dark:border-slate-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                    <TrendingUp className="w-3 h-3" />
                    {change}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{title}</p>
            </div>
        </motion.div>
    )
}
