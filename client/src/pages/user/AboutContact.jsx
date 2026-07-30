import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Globe, Send, Info, PhoneCall } from "lucide-react";
import { DashboardLayout } from "@/components/layout/layout";
import { useTitle } from "@/hooks/useTitle";
import { theme } from "@/lib/theme";

export function AboutContact() {
    useTitle("About & Contact");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    const contactInfo = [
        { icon: Mail, label: "Email", value: "gautamdoliya69@gmail.com", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { icon: MapPin, label: "Location", value: "Mumbai, India", color: "bg-rose-50 text-rose-600 border-rose-100" },
        { icon: Globe, label: "Website", value: "student-2.pages.dev", color: "bg-purple-50 text-purple-600 border-purple-100" },
    ];

    return (
        <DashboardLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 max-w-7xl mx-auto"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center space-y-3 pt-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 shadow-xs text-xs font-bold uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Get to know us</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        About <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Student Hub</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-slate-500">
                        The ultimate learning command center for modern IT students. We're on a mission to streamline learning, academic resource sharing, and peer-to-peer collaboration.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Mission Section */}
                    <motion.div 
                        variants={itemVariants} 
                        className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs relative overflow-hidden group"
                    >
                        {/* Decorative background blur */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                        
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 tracking-tight">Our Mission</h2>
                            <div className="space-y-4 text-sm text-slate-500 leading-relaxed">
                                <p>
                                    Student Hub was born out of a simple realization: student life is cluttered. Between notes, practicals, viva sheets, and feedback, academic resources are scattered across a dozen unofficial groups.
                                </p>
                                <p>
                                    We've built a unified ecosystem—a digital workspace where everything you need is just a click away. From community help boards to shared study materials, we're redefining how students navigate their coursework.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-xl md:text-2xl font-black text-slate-900">10k+</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Students</p>
                                </div>
                                <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                <div>
                                    <p className="text-xl md:text-2xl font-black text-slate-900">500+</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Shared Notes</p>
                                </div>
                                <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                <div>
                                    <p className="text-xl md:text-2xl font-black text-slate-900">50+</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Expert Tutors</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info Card */}
                    <motion.div 
                        variants={itemVariants} 
                        className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs relative overflow-hidden text-slate-900"
                    >
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold mb-6 tracking-tight">Contact Us</h2>
                                <div className="space-y-4">
                                    {contactInfo.map((info, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group cursor-default">
                                            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${info.color}`}>
                                                <info.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{info.label}</p>
                                                <p className="text-sm md:text-base font-bold text-slate-800 mt-0.5 truncate">{info.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Social connections coming soon</p>
                                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-100 text-xs cursor-pointer">
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    Support Chat
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Form Section */}
                <motion.div 
                    variants={itemVariants} 
                    className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs"
                >
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                Have a specific <span className="text-indigo-600">Question?</span>
                            </h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Send us a message and our support team will get back to you within 24 hours. We love hearing suggestions from our student community!
                            </p>
                            <ul className="space-y-2 text-xs font-semibold text-slate-600">
                                {[
                                    "Feature requests & suggestions",
                                    "Report academic/content errors",
                                    "Technical portal issues",
                                    "University syllabus alignment queries"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-xs font-semibold transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-xs font-semibold transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700 ml-1">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help you?"
                                    className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-xs leading-relaxed transition-all resize-none font-semibold"
                                ></textarea>
                            </div>
                            <button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-2 cursor-pointer">
                                <Send className="w-3.5 h-3.5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
