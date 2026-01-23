
import React from "react"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function StatsCard({ title, value, change, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)" }}
            className="bg-white rounded-xl p-6 border border-[#E5E5E5] transition-all duration-300 hover:border-slate-300"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                    <TrendingUp className="w-3 h-3" />
                    {change}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
            </div>
        </motion.div>
    )
}
