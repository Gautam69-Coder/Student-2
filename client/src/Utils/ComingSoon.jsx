import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from "react-router-dom";

const ComingSoonPage = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        const targetDate = new Date('2026-03-01T00:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
        <div className="h-[70vh] bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            {/* Animated background circles */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-30"
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
                className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-20"
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
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl flex items-center justify-center shadow-2xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <svg
                            className="w-10 h-10 text-white"
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
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold text-violet-600 mb-6 tracking-tight"
                >
                    Something Amazing
                    <br />
                    <span className="bg-gradient-to-r from-violet-600 via-violet-700 to-violet-800 bg-clip-text text-transparent">
                        Is Coming Soon
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl text-violet-500 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    We're crafting something extraordinary for you. Stay tuned and be the first to experience it.
                </motion.p>

                <motion.button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-full font-semibold shadow-lg"
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(124, 58, 237, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={()=>{
                        navigate("/")
                    }}
                >
                   Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ComingSoonPage;
