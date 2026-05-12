
import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Code2,
    Sparkles,
    ShieldCheck,
    Zap,
    ArrowRight,
    Github,
    Trophy,
    Users,
    MessageSquare,
    ChevronRight,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { ThemeToggle } from '@/components/common/theme-toggle';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="glass-card p-8 rounded-3xl group hover:border-indigo-500/50 transition-all duration-500"
    >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
            <Icon className="w-7 h-7 text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const StatCard = ({ label, value, icon: Icon }) => (
    <div className="flex flex-col items-center p-6 bg-white/50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-indigo-500" />
        </div>
        <span className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{value}</span>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{label}</span>
    </div>
);

export default function LandingPage() {
    const homeSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Student Hub",
        "url": "https://student-2.pages.dev/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://student-2.pages.dev/blog?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://student-2.pages.dev/"
        }]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            <SEO 
                title="Student Hub — Free MERN Notes, Practicals & Resources for IT Students"
                description="Access premium  notes, IT student notes. The ultimate resource for BSc IT notes and IT student resources India."
                url="/"
                schema={[homeSchema, breadcrumbSchema]}
            />
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between glass py-3 px-6 rounded-2xl border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-xl">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Student Hub Logo"
                            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="eager"
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Blog', 'About', 'Contact'].map((item) => (
                            item === 'Blog' ? (
                                <Link
                                    key={item}
                                    to="/blog"
                                    className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                >
                                    {item}
                                </Link>
                            ) : (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                                >
                                    {item}
                                </a>
                            )
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            to="/dashboard"
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Explore Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6">
                {/* Decorative Gradients */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-indigo-600/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-500/20">
                            <Star className="w-3.2 h-3.2 fill-current" /> High-Performance Learning
                        </span>

                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                            IT Student Notes & <br />
                            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent italic">
                                Practicals
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">
                            The all-in-one platform for  notes and BSc IT notes Mumbai. Organized practicals, previous year questions, and IT student resources India at your fingertips.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/dashboard"
                                className="group relative px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Learning Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-violet-600 opacity-100 group-hover:scale-105 transition-transform" />
                            </Link>

                            <a
                                href="#features"
                                className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Explore Features
                            </a>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
                    >
                        <StatCard icon={Users} label="Active Students" value="10k+" />
                        <StatCard icon={BookOpen} label="Study Materials" value="500+" />
                        <StatCard icon={Trophy} label="Completion Rate" value="94%" />
                        <StatCard icon={Zap} label="Speed Boost" value="3x" />
                    </motion.div>

                    {/* App Showcase Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-32 relative mx-auto max-w-5xl group"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative glass-card rounded-3xl p-4 overflow-hidden shadow-2xl border-white/40 dark:border-white/10">
                            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
                                {/* Simulated App Interface Elements */}
                                <div className="absolute top-8 left-8 right-8 bottom-8 grid grid-cols-12 gap-6 opacity-40">
                                    <div className="col-span-3 space-y-4">
                                        <div className="h-24 bg-indigo-500/10 rounded-xl" />
                                        <div className="h-48 bg-slate-500/10 rounded-xl" />
                                    </div>
                                    <div className="col-span-6 space-y-6">
                                        <div className="h-12 bg-indigo-500/20 rounded-xl w-3/4" />
                                        <div className="h-64 bg-slate-500/10 rounded-2xl" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 bg-purple-500/10 rounded-xl" />
                                            <div className="h-32 bg-cyan-500/10 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-4">
                                        <div className="h-64 bg-slate-500/10 rounded-xl" />
                                        <div className="h-12 bg-lime-500/10 rounded-xl" />
                                    </div>
                                </div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center mb-6">
                                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">Seamless Dashboard</h4>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">v2.0 Cyber-Minimalism</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"> Notes & IT Resources</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Powerful tools designed to simplify your BSc IT journey with student notes and .
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Code2}
                            title="Interactive Practicals"
                            description="Access a library of programming practicals with clean code previews and multi-language support."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="AI Assistant"
                            description="Stuck on a problem? Our integrated AI assistant helps you understand complex concepts instantly."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant PYQs"
                            description="Never miss important questions with our curated collection of previous year examination papers."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Secure Dashboard"
                            description="Personalized study experience with progress tracking and secure user authentication."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={MessageSquare}
                            title="Expert Support"
                            description="Direct communication channels with administrators for feedback and technical support."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Github}
                            title="Open Source"
                            description="Built with the latest technologies like React, Vite, and Tailwind for maximum performance."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative glass-card bg-slate-900 dark:bg-slate-900/40 rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden">
                        {/* Abstract Background for CTA */}
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)]"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                                Ready To Transform <br /> Your Grades?
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                                Join thousands of students who are already using Student Hub to ace their exams and manage their academic journey.
                            </p>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-slate-900 font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                            >
                                Get Started Free <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-100 dark:border-slate-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Student Hub Logo" className="h-8 w-auto object-contain" loading="lazy" />
                    </Link>

                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        &copy; 2026 Student Hub. Designed for excellence.
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-8 text-sm font-medium">
                        <Link to="/blog" className="text-slate-500 hover:text-indigo-600 transition-colors">Study Blog</Link>
                        <Link to="/notes" className="text-slate-500 hover:text-indigo-600 transition-colors"> Notes</Link>
                        <Link to="/practicals" className="text-slate-500 hover:text-indigo-600 transition-colors">MERN Practicals</Link>
                        <Link to="/community" className="text-slate-500 hover:text-indigo-600 transition-colors">Student Community</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" aria-label="Github Repository" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" aria-label="Student Community" className="text-slate-400 hover:text-indigo-600 transition-colors"><Users className="w-5 h-5" /></a>
                        <a href="#" aria-label="Contact Support" className="text-slate-400 hover:text-indigo-600 transition-colors"><MessageSquare className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
