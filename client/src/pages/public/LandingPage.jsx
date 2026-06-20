
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
        "name": "Velorah",
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
                title="Student Notes Management System"
                description="Student Hub — Student Notes Management System"
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
            <div className="absolute inset-0 z-0 bg-[hsl(var(--background))]">
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
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.55))' }}
                />
            </div>

            {/* Glassmorphic Navigation */}
            <nav className="relative z-10 flex row justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/circle_logo.png"
                        alt="Student Hub Circle Logo"
                        className="h-10 w-10 object-contain"
                        loading="eager"
                    />
                    <span
                        className="text-3xl tracking-tight"
                        style={{ fontFamily: "'Instrument Serif', serif", color: 'hsl(var(--foreground))' }}
                    >
                        Student Hub<sup className="text-xs">®</sup>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <Link
                        to="/"
                        className="text-sm transition-colors hover:text-[hsl(var(--foreground))]"
                        style={{ color: 'hsl(var(--foreground))' }}
                    >
                        Home
                    </Link>
                    <Link
                        to="/studio"
                        className="text-sm transition-colors hover:text-[hsl(var(--foreground))]"
                    >
                        Studio
                    </Link>
                    <a
                        href="#about"
                        className="text-sm transition-colors hover:text-[hsl(var(--foreground))]"
                    >
                        About
                    </a>
                    <Link
                        to="/journal"
                        className="text-sm transition-colors hover:text-[hsl(var(--foreground))]"
                    >
                        Journal
                    </Link>
                    <a
                        href="#reach-us"
                        className="text-sm transition-colors hover:text-[hsl(var(--foreground))]"
                    >
                        Reach Us
                    </a>
                </div>

                <Link
                    to="/signup"
                    className="liquid-glass rounded-full px-6 py-2.5 text-sm"
                    style={{ color: 'hsl(var(--foreground))' }}
                >
                    Begin Journey
                </Link>
            </nav>

            {/* Hero Section */}
            <section
                className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-28 py-[90px]"
            >
                <h1
                    className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal"
                    style={{ fontFamily: "'Instrument Serif', serif", color: 'hsl(var(--foreground))' }}
                >
                    Where dreams rise through the silence.
                </h1>

                <p
                    className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                    Student Notes Management System — organize your notes, manage practicals, and study with focused clarity.
                </p>

                <Link
                    to="/signup"
                    className="liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] cursor-pointer"
                    style={{ color: 'hsl(var(--foreground))' }}
                >
                    Begin Journey
                </Link>
            </section>

            {/* Content Sections */}
            <main className="relative z-10 pb-10">
                <section className="px-6 pt-10" aria-label="Notes and resources">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-100 dark:text-white mb-6">
                                Notes &amp; IT Resources
                            </h2>
                            <p className="text-slate-300 dark:text-slate-300/90 max-w-2xl mx-auto text-lg">
                                Powerful tools designed to simplify your   journey with student notes and resources.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <Code2 className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Interactive Practicals</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Access a library of programming practicals with clean code previews and multi-language support.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <Sparkles className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">AI Assistant</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Stuck on a problem? Our integrated AI assistant helps you understand complex concepts instantly.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <Zap className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Instant PYQs</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Never miss important questions with our curated collection of previous year examination papers.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Secure Dashboard</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Personalized study experience with progress tracking and secure user authentication.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                                    <MessageSquare className="w-7 h-7 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-100">Expert Support</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Direct communication channels with administrators for feedback and technical support.
                                </p>
                            </div>

                            <div className="glass-card p-8 rounded-3xl group transition-all duration-500">
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
                        <Link
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            to="/studio"
                        >
                            Studio
                        </Link>
                        <a
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            href="#about"
                        >
                            About
                        </a>
                        <Link
                            className="hover:text-[hsl(var(--foreground))] transition-colors"
                            to="/journal"
                        >
                            Journal
                        </Link>
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

