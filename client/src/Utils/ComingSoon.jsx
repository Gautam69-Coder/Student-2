import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from "react-router-dom";

const ComingSoonPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-[80vh] bg-white dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative transition-colors duration-300">
            {/* Animated background circles */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-slate-100 dark:bg-slate-900 rounded-full blur-3xl opacity-30 dark:opacity-20"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200 dark:bg-slate-900 rounded-full blur-3xl opacity-20 dark:opacity-20"
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -30, 0],
                    y: [0, -50, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="max-w-4xl w-full text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo or Icon */}
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="mb-8 inline-block"
                >
                    <motion.div
                        className="w-20 h-20 mx-auto bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl dark:shadow-slate-900/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <svg
                            className="w-10 h-10 text-white dark:text-slate-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
                >
                    Something Amazing
                    <br />
                    <span className="text-slate-700 dark:text-slate-300">
                        Is Coming Soon
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    We're crafting something extraordinary for you. Stay tuned and be the first to experience it.
                </motion.p>

                <motion.button
                    type="submit"
                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => {
                        navigate("/")
                    }}
                >
                    Return Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ComingSoonPage;
