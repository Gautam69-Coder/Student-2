
import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

export const ServerOffline = ({ onRetry }) => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white dark:bg-slate-950 px-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border-red-500/20 shadow-2xl relative z-10 text-center"
            >
                <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-8 relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-red-500/20 rounded-3xl blur-xl"
                    />
                    <WifiOff className="w-12 h-12 text-red-500 relative z-10" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    Connection Lost
                </h1>

                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
                    We're unable to reach our servers right now. Please check your internet connection or try again in a few moments.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={onRetry || (() => window.location.reload())}
                        className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Retry Connection
                    </button>

                    <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        <ShieldAlert className="w-3 h-3 text-red-500" />
                        Backend Unavailable
                    </div>
                </div>

                {/* Status indicator */}
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between px-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Code</span>
                        <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-black tracking-widest uppercase">
                            Err_Network
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Floating Warning Icons */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[20%] text-red-500/20"
            >
                <AlertTriangle size={80} strokeWidth={1} />
            </motion.div>
        </div>
    );
};
