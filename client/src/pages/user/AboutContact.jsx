
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Github, Twitter, Linkedin, MessageCircle, Info, Send, PhoneCall } from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';

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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const contactInfo = [
        { icon: Mail, label: "Email", value: "gautamdoliya69@gmail.com", color: "bg-blue-500" },
        // { icon: Phone, label: "Phone", value: "+1 (555) 000-0000", color: "bg-green-500" },
        { icon: MapPin, label: "Location", value: "Mumbai, India", color: "bg-red-500" },
        { icon: Globe, label: "Website", value: "https://student-2.pages.dev", color: "bg-purple-500" },
    ];

    const socials = [
        // { icon: Github, link: "#", color: "hover:text-white hover:bg-slate-900" },
        // { icon: Linkedin, link: "#", color: "hover:text-white hover:bg-blue-600" },
        // { icon: Twitter, link: "#", color: "hover:text-white hover:bg-sky-500" },
        // { icon: MessageCircle, link: "#", color: "hover:text-white hover:bg-green-500" },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 md:space-y-12 pb-10"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center space-y-4 px-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    Get to know us
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    About <span className="text-indigo-600 dark:text-indigo-400">Student Hub</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                    The ultimate command center for modern students. We're on a mission to streamline learning,
                    collaboration, and academic success through cutting-edge technology.
                </p>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Mission Section */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 hidden sm:block">
                        <Globe size={120} className="text-indigo-500" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Our Mission</h2>
                        <div className="space-y-4">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg text-justify sm:text-left">
                                Student Hub was born out of a simple realization: student life is cluttered. Between notes,
                                practicals, PYQs, and feedback, information is scattered across a dozen platforms.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg text-justify sm:text-left">
                                We've built a unified ecosystem—a "Learning Command Center"—where everything you need
                                is just one click away. From AI-powered assistance to peer-to-peer note sharing,
                                we're redefining how students interact with their curriculum.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-6 pt-4">
                            <div className="text-center sm:text-left">
                                <p className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400">10k+</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Active Students</p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-slate-800" />
                            <div className="text-center sm:text-left">
                                <p className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400">500+</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Shared Notes</p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-slate-800" />
                            <div className="text-center sm:text-left">
                                <p className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400">50+</p>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Expert Tutors</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Info Card */}
                <motion.div variants={itemVariants} className="bg-slate-900 dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
                        <PhoneCall size={120} />
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 tracking-tight">Contact Us</h2>
                        <div className="space-y-5 md:space-y-6 flex-1">
                            {contactInfo.map((info, idx) => (
                                <div key={idx} className="flex items-center gap-4 group cursor-default">
                                    <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${info.color} bg-opacity-20 flex items-center justify-center transition-all group-hover:scale-110`}>
                                        <info.icon className={`w-5 h-5 md:w-6 md:h-6 ${info.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{info.label}</p>
                                        <p className="text-base md:text-lg font-bold truncate max-w-[200px] sm:max-w-none">{info.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex gap-3">
                                {socials.length > 0 ? socials.map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.link}
                                        className={`p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 transition-all ${social.color} hover:shadow-lg hover:-translate-y-1`}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                )) : (
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Social links coming soon</p>
                                )}
                            </div>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-xl font-black hover:bg-indigo-50 transition-all active:scale-95 shadow-xl text-sm">
                                <Send className="w-4 h-4" />
                                Support Chat
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Form Section */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight lead-tight">
                            Have a specific <span className="text-indigo-600 dark:text-indigo-400">question?</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                            Send us a message and our team will get back to you within 24 hours. We love hearing from our community!
                        </p>
                        <ul className="space-y-3 md:space-y-4">
                            {[
                                "Feature requests & suggestions",
                                "Report technical issues",
                                "Partnership opportunities",
                                "General academic inquiries"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full h-11 md:h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full h-11 md:h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                            <textarea
                                rows={4}
                                placeholder="How can we help you?"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-medium resize-none text-sm"
                            ></textarea>
                        </div>
                        <button className="w-full h-13 md:h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-base md:text-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2">
                            <Send className="w-5 h-5" />
                            Launch Message
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}

