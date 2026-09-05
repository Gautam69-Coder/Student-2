
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Star,
    Menu,
    X
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [faqIndex, setFaqIndex] = useState(null);

    const faqs = [
        {
            q: "Is Student Hub completely free for students?",
            a: "Yes, Student Hub is designed as an open-access platform for students to save notes, practice coding, and learn with an AI tutor at no cost."
        },
        {
            q: "How does the AI Assistant help with my coursework?",
            a: "The built-in AI assistant can answer conceptual questions, debug programming code, suggest optimizations, and explain complicated topics with clear step-by-step guides."
        },
        {
            q: "Can I upload my own notes or study materials?",
            a: "Currently, administrators review and upload resources to maintain verified and high-quality materials. If you have great resources, you can submit them to any admin."
        },
        {
            q: "Does the platform support real-time chat with other students?",
            a: "Absolutely! Once logged in, you can view online peers and start direct messaging, collaborating, and discussing assignments in real-time."
        }
    ];

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
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                '--background': '201 100% 13%',
                '--foreground': '0 0% 100%',
                '--muted-foreground': '240 4% 66%',
                '--primary': '0 0% 100%',
                '--primary-foreground': '0 0% 4%',
                '--secondary': '0 0% 10%',
                '--accent': '0 0% 10%',
                '--border': '0 0% 18%',
                '--input': '0 0% 18%'
            }}
        >
            <SEO
                title="Student Hub | Study Notes, Coding Practice & AI Assistant"
                description="Save study notes, practice coding tracks, and collaborate with an AI tutor in one unified student workspace."
                url="/"
                schema={[homeSchema, breadcrumbSchema]}
            />

            {/* Fonts + cinematic background */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Instrumental+Serif:wght@400&family=Inter:wght@400;500&display=swap"
                rel="stylesheet"
            />

            {/* Fullscreen looping video background */}
            <div className="fixed inset-0 z-0 bg-[hsl(var(--background))]">
                <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
                />

                {/* subtle readability fade; no blobs/overlays */}
                <div
                    className="absolute inset-0 bg-black/60"
                />
            </div>

            {/* Glassmorphic Sticky/Floating Navigation */}
            <header className="sticky top-4 left-0 right-0 z-50 w-[95%] sm:w-[90%] max-w-7xl mx-auto">
                <nav className="rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-xl px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl transition-all duration-300">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/circle_logo.png"
                            alt="Student Hub Circle Logo"
                            className="h-9 w-9 object-contain"
                            loading="eager"
                        />
                        <span
                            className="text-2xl sm:text-3xl tracking-tight font-medium"
                            style={{ fontFamily: "'Instrument Serif', serif", color: 'hsl(var(--foreground))' }}
                        >
                            Student Hub<sup className="text-xs">®</sup>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-slate-300">
                        <Link to="/" className="text-sm font-medium transition-colors hover:text-white">
                            Home
                        </Link>
                        <a href="#about" className="text-sm font-medium transition-colors hover:text-white">
                            About
                        </a>
                        <a href="#features" className="text-sm font-medium transition-colors hover:text-white">
                            Features
                        </a>
                        <a href="#stats" className="text-sm font-medium transition-colors hover:text-white">
                            Stats
                        </a>
                        <a href="#faq" className="text-sm font-medium transition-colors hover:text-white">
                            FAQ
                        </a>
                        <a href="#reach-us" className="text-sm font-medium transition-colors hover:text-white">
                            Reach Us
                        </a>
                    </div>

                    {/* Desktop CTA & Theme */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle className="!bg-transparent hover:!bg-white/10 !border-0 text-white rounded-full p-2.5 cursor-pointer" />
                        <Link
                            to="/signup"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-600/20"
                        >
                            Begin Journey
                        </Link>
                    </div>

                    {/* Mobile Menu & Theme Buttons */}
                    <div className="flex md:hidden items-center gap-3">
                        <ThemeToggle className="!bg-transparent hover:!bg-white/10 !border-0 text-white rounded-full p-2 cursor-pointer" />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-300 hover:text-white focus:outline-none p-1 cursor-pointer"
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-16 left-0 right-0 mx-auto w-full rounded-3xl bg-slate-950/95 border border-white/10 backdrop-blur-2xl p-6 shadow-2xl flex flex-col gap-4 md:hidden"
                        >
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                            >
                                Home
                            </Link>
                            <a
                                href="#about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                            >
                                About
                            </a>
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                            >
                                Features
                            </a>
                            <a
                                href="#stats"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                            >
                                Stats
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                            >
                                FAQ
                            </a>
                            <a
                                href="#reach-us"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
                            >
                                Reach Us
                            </a>
                            <Link
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full py-3 text-center text-base font-semibold mt-4 shadow-lg shadow-indigo-600/20"
                            >
                                Begin Journey
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section
                className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40 pb-28 md:py-[120px]"
                id="hero"
            >
                
                
                <h1
                    className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal"
                    style={{ fontFamily: "'Instrument Serif', serif", color: 'hsl(var(--foreground))' }}
                >
                    Conquer your studies with clarity.
                </h1>

                <p
                    className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                    Tired of scattered notes and no guidance when stuck? Student Hub brings all your study notes, coding challenges, AI assistance, and peers together into one powerful, distraction-free platform.
                </p>

                <Link
                    to="/signup"
                    className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] cursor-pointer shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                    style={{ color: 'hsl(var(--foreground))' }}
                >
                    Begin Journey
                </Link>
            </section>

            {/* Content Sections */}
            <main className="relative z-10 pb-10">
                {/* About / Core Vision Section */}
                <section id="about" className="px-6 py-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6 text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" /> Our Mission
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                Simplifying academic collaboration.
                            </h2>
                            <p className="text-slate-350 leading-relaxed text-lg">
                                Student Hub was born out of a simple realization: students waste too much time searching for disorganized notes, searching for past question papers, and struggling alone with complex coding challenges.
                            </p>
                            <p className="text-slate-400 leading-relaxed text-base">
                                We built a centralized, distraction-free environment that combines premium study resources, real-time peer collaboration, and an intelligent AI assistant trained to help you code and learn.
                            </p>
                            <div className="pt-4 flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <Users className="w-8 h-8 text-indigo-400" />
                                    <div>
                                        <div className="font-bold text-white">Peer Network</div>
                                        <div className="text-xs text-slate-400">Learn together in real-time</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                                    <div>
                                        <div className="font-bold text-white">Verified Content</div>
                                        <div className="text-xs text-slate-400">Checked by administrators</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative lg:ml-10 text-left"
                        >
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-3xl -z-10" />
                            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl" />
                                <h3 className="text-2xl font-bold text-white mb-4">Why Student Hub?</h3>
                                <ul className="space-y-4">
                                    {[
                                        { title: "One-Stop Portal", desc: "No more switching between Drive links and chat groups." },
                                        { title: "AI-Powered Help", desc: "Get debugging assistance and concept summaries instantly." },
                                        { title: "Coding Practice Tracks", desc: "View multi-language coding tracks with clean interactive layouts." },
                                        { title: "Active Community", desc: "Discuss topics, share blogs, and send direct messages." }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold text-xs mt-0.5 shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                                <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-6 py-20 border-t border-white/5" aria-label="Notes and resources">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-100 dark:text-white mb-6">
                                Notes &amp; IT Resources
                            </h2>
                            <p className="text-slate-300 dark:text-slate-300/90 max-w-2xl mx-auto text-lg">
                                Powerful tools designed to simplify your journey with student notes and resources.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <Code2 className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Coding Practice Tracks</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Access preloaded coding practice tracks with a built-in Monaco editor and multi-language support.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <Sparkles className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">AI Assistant</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Stuck on a problem? Our integrated AI assistant helps you understand complex concepts instantly.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <Zap className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Live Code Compiler</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Write, run, and test code directly in your browser with our integrated Monaco-powered editor.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Secure Dashboard</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Personalized study experience with progress tracking and secure user authentication.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <MessageSquare className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Expert Support</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Direct communication channels with administrators for feedback and technical support.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <BookOpen className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Study Resources</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Learn with organized materials, notes, and guided resources—built for deep study and faster revision.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats / Social Proof Section */}
                <section id="stats" className="px-6 py-20 border-t border-white/5 bg-slate-950/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                                Empowering Academic Success
                            </h2>
                            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-base sm:text-lg">
                                Our stats speak for themselves. We provide students with the ultimate ecosystem for deep study.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                            >
                                <StatCard label="Study Materials" value="5,000+" icon={BookOpen} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <StatCard label="AI Answers" value="15,000+" icon={Sparkles} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <StatCard label="Active Students" value="1,200+" icon={Users} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                <StatCard label="Exams Covered" value="250+" icon={Trophy} />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="px-6 py-20 border-t border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-slate-400 mt-3 text-base sm:text-lg">
                                Got questions? We have answers. If you need further help, feel free to reach us.
                            </p>
                        </div>

                        <div className="space-y-4 text-left">
                            {faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.08]"
                                >
                                    <button
                                        onClick={() => setFaqIndex(faqIndex === idx ? null : idx)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none cursor-pointer"
                                    >
                                        <span className="font-semibold text-white md:text-lg">{faq.q}</span>
                                        <ChevronRight
                                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                                                faqIndex === idx ? "rotate-90 text-indigo-400" : ""
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {faqIndex === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className="px-6 pb-5 text-slate-300 border-t border-white/5 pt-3 leading-relaxed text-sm md:text-base">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Reach Us / Contact Form Section */}
                <section id="reach-us" className="px-6 py-20 border-t border-white/5 bg-slate-950/20">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="text-left">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                    Get in Touch
                                </h2>
                                <p className="text-slate-300 leading-relaxed mb-6 text-base">
                                    Have a question about Student Hub, feedback on notes, or need technical help? Send us a message and our administration team will get back to you shortly.
                                </p>
                                <div className="space-y-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                                        <span>support@studenthub.edu</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-indigo-400" />
                                        <span>Active admin office: Room 304, IT Block</span>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden text-left"
                            >
                                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); e.target.reset(); }} className="space-y-4">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Name</label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            placeholder="Your name"
                                            className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            placeholder="name@email.com"
                                            className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Message</label>
                                        <textarea
                                            id="contact-message"
                                            rows="4"
                                            required
                                            placeholder="How can we help you?"
                                            className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 text-sm resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20 cursor-pointer text-center"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer
                className="relative z-10 border-t"
                style={{ borderColor: 'hsl(var(--border))' }}
            >
                <div
                    className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src="/circle_logo.png"
                            alt="Student Hub Circle Logo"
                            className="h-10 w-10 object-contain"
                            loading="lazy"
                        />
                        <div>
                            <div
                                className="text-lg"
                                style={{ fontFamily: "'Instrument Serif', serif", color: 'hsl(var(--foreground))' }}
                            >
                                Student Hub
                            </div>
                            <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                                Student Notes Management System
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex flex-wrap gap-x-8 gap-y-3 text-sm"
                        style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                        <a
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            href="#"
                        >
                            Home
                        </a>
                        <a
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            href="#about"
                        >
                            About
                        </a>
                        <a
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            href="#features"
                        >
                            Features
                        </a>
                        <a
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            href="#reach-us"
                        >
                            Reach Us
                        </a>
                    </div>

                    <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        © {new Date().getFullYear()} Student Hub. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

