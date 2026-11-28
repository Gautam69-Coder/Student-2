import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Code2,
    Sparkles,
    ShieldCheck,
    Zap,
    ArrowRight,
    Users,
    MessageSquare,
    ChevronDown,
    Menu,
    X,
    CheckCircle2,
    Play,
    Terminal,
    FileText,
    FlaskConical,
    Layers,
    Cpu,
    Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CODE_DEMOS = {
    javascript: {
        label: 'JavaScript',
        file: 'twoSum.js',
        code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`,
        output: 'Passed 3/3 test cases · Runtime 4ms · O(n) Space',
    },
    python: {
        label: 'Python',
        file: 'two_sum.py',
        code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for idx, val in enumerate(nums):
        diff = target - val
        if diff in seen:
            return [seen[diff], idx]
        seen[val] = idx`,
        output: 'Passed 3/3 test cases · Runtime 11ms · O(n) Space',
    },
    cpp: {
        label: 'C++',
        file: 'two_sum.cpp',
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
        output: 'Passed 3/3 test cases · Runtime 2ms · O(n) Space',
    },
    java: {
        label: 'Java',
        file: 'Solution.java',
        code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (map.containsKey(need)) return new int[]{map.get(need), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
        output: 'Passed 3/3 test cases · Runtime 3ms · O(n) Space',
    },
};

const FAQS = [
    {
        q: 'Is Student Hub completely free for students?',
        a: 'Yes. Student Hub gives students open access to organized study notes, 50+ preloaded coding challenges in the browser IDE, and community discussions at no cost.',
    },
    {
        q: 'What makes the Coding Practice & Monaco IDE different?',
        a: 'Every track (JavaScript, Python, C++, Java, and DSA) runs inside an embedded Monaco editor with curated problem descriptions, sample inputs/outputs, instant code checking, and an AI Code Helper when you get stuck.',
    },
    {
        q: 'How do Practicals and Verified Notes work?',
        a: 'Study notes are organized cleanly by subject section with PDF/file previews and markdown formatting. Verified college email accounts also unlock dedicated lab practical sheets and ready-to-copy practical implementations.',
    },
    {
        q: 'How does the AI Assistant help with coursework and debugging?',
        a: 'The integrated AI Assistant can analyze your code, suggest time/space optimizations, explain tricky concepts step-by-step, and help refine your study notes.',
    },
];

function WorkflowBeamCard() {
    const containerRef = useRef(null);
    const notesRef = useRef(null);
    const labsRef = useRef(null);
    const codeRef = useRef(null);
    const hubRef = useRef(null);
    const masteryRef = useRef(null);

    return (
        <div className="surface-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full">
            <div className="space-y-2 mb-6">
                <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-semibold">
                    <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
                    Unified Study Graph
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    Everything connects in one workspace
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    No more bouncing between Drive folders, WhatsApp PDFs, and random compilers. Your notes, lab practicals, and coding tracks feed directly into one fast workflow.
                </p>
            </div>

            <div
                ref={containerRef}
                className="relative flex items-center justify-between gap-3 sm:gap-6 rounded-2xl border border-border bg-secondary/40 dark:bg-background/70 p-5 sm:p-7 overflow-hidden min-h-[210px]"
            >
                {/* Left inputs */}
                <div className="flex flex-col gap-3 z-10">
                    <div
                        ref={notesRef}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border shadow-xs text-xs font-semibold text-foreground"
                    >
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                        <span>Study Notes</span>
                    </div>
                    <div
                        ref={labsRef}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border shadow-xs text-xs font-semibold text-foreground"
                    >
                        <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                        <span>Lab Practicals</span>
                    </div>
                    <div
                        ref={codeRef}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border shadow-xs text-xs font-semibold text-foreground"
                    >
                        <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                        <span>Monaco Code</span>
                    </div>
                </div>

                {/* Center AI Core */}
                <div
                    ref={hubRef}
                    className="z-10 flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-indigo-500/25 border border-white/20 shrink-0"
                >
                    <Cpu className="w-7 h-7 mb-1" aria-hidden="true" />
                    <span className="text-[11px] font-bold tracking-tight">AI Tutor</span>
                </div>

                {/* Right Outcome */}
                <div
                    ref={masteryRef}
                    className="z-10 flex flex-col gap-1.5 px-3.5 py-3 rounded-xl bg-card border border-emerald-500/30 shadow-xs shrink-0"
                >
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Exam Ready</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                        +32% faster prep
                    </span>
                </div>

                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={notesRef}
                    toRef={hubRef}
                    curvature={-28}
                    gradientStartColor="#4F46E5"
                    gradientStopColor="#10B981"
                    pathColor="currentColor"
                    pathOpacity={0.14}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={labsRef}
                    toRef={hubRef}
                    curvature={0}
                    gradientStartColor="#10B981"
                    gradientStopColor="#4F46E5"
                    pathColor="currentColor"
                    pathOpacity={0.14}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={codeRef}
                    toRef={hubRef}
                    curvature={28}
                    gradientStartColor="#4F46E5"
                    gradientStopColor="#10B981"
                    pathColor="currentColor"
                    pathOpacity={0.14}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={hubRef}
                    toRef={masteryRef}
                    curvature={0}
                    gradientStartColor="#6366F1"
                    gradientStopColor="#10B981"
                    pathColor="currentColor"
                    pathOpacity={0.18}
                />
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('ide');
    const [activeLang, setActiveLang] = useState('javascript');
    const [demoTested, setDemoTested] = useState(false);
    const [faqIndex, setFaqIndex] = useState(0);
    const [contactSent, setContactSent] = useState(false);

    const activeDemo = CODE_DEMOS[activeLang];

    const homeSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Student Hub',
        url: 'https://student-2.pages.dev/',
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            <SEO
                title="Student Hub | Study Notes, Coding Practice & AI Assistant"
                description="Save study notes, practice coding tracks, and collaborate with an AI tutor in one unified student workspace."
                url="/"
                schema={[homeSchema]}
            />

            {/* Subtle Background Engineering Grid + Radial Accent */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-studio-grid opacity-70" />
                <div
                    className="absolute inset-x-0 -top-40 h-[520px]"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(79, 70, 229, 0.14), rgba(16, 185, 129, 0.06) 50%, transparent 100%)',
                    }}
                />
            </div>

            {/* Sticky Top Navbar */}
            <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                <nav
                    aria-label="Primary navigation"
                    className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
                >
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <img
                            src="/circle_logo.png"
                            alt="Student Hub Logo"
                            className="h-8 w-8 object-contain"
                            loading="eager"
                        />
                        <span className="text-lg font-extrabold tracking-tight text-foreground">
                            Student Hub
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
                        <a href="#workspace-preview" className="hover:text-foreground transition-colors">
                            Workspace
                        </a>
                        <a href="#bento-features" className="hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#tracks" className="hover:text-foreground transition-colors">
                            Coding Tracks
                        </a>
                        <a href="#faq" className="hover:text-foreground transition-colors">
                            FAQ
                        </a>
                        <a href="#reach-us" className="hover:text-foreground transition-colors">
                            Contact
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-2.5">
                        <ThemeToggle />
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="sm" className="gap-1.5 shadow-sm shadow-indigo-500/20">
                                Get Started
                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileMenuOpen}
                            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl px-4 py-4 space-y-2 overflow-hidden"
                        >
                            {[
                                { label: 'Workspace Preview', href: '#workspace-preview' },
                                { label: 'Features', href: '#bento-features' },
                                { label: 'Coding Tracks', href: '#tracks' },
                                { label: 'FAQ', href: '#faq' },
                                { label: 'Contact', href: '#reach-us' },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center min-h-[44px] px-3 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="grid grid-cols-2 gap-2.5 pt-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="relative z-10">
                {/* Product-Led Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                            <span>Notes · Lab Practicals · Monaco IDE · AI Assistant</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground"
                        >
                            Study notes, code practice, and{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-emerald-400">
                                AI clarity
                            </span>{' '}
                            in one workspace.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                        >
                            Stop juggling Drive folders, scattered practical PDFs, and disconnected tabs. Organize coursework, solve 50+ coding challenges in a built-in Monaco editor, and get instant AI explanations.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
                        >
                            <Link to="/signup" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto px-7 shadow-md shadow-indigo-500/20">
                                    Start Studying Free
                                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                </Button>
                            </Link>
                            <a href="#workspace-preview" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto px-7">
                                    <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                    Try Live Preview
                                </Button>
                            </a>
                        </motion.div>
                    </div>

                    {/* Interactive Product-Led Hero Workbench */}
                    <motion.div
                        id="workspace-preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.2 }}
                        className="mt-12 sm:mt-16 rounded-3xl border border-border bg-card shadow-xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden"
                    >
                        {/* Window Top Bar + Interactive Workspace Switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border bg-secondary/40">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-400/80" aria-hidden="true" />
                                <span className="w-3 h-3 rounded-full bg-amber-400/80" aria-hidden="true" />
                                <span className="w-3 h-3 rounded-full bg-emerald-400/80" aria-hidden="true" />
                                <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline">
                                    student-hub / workspace
                                </span>
                            </div>

                            <div className="flex items-center gap-1 p-1 rounded-xl bg-background border border-border overflow-x-auto">
                                {[
                                    { id: 'ide', label: 'Monaco Coding IDE', icon: Code2 },
                                    { id: 'notes', label: 'Notes & Practicals', icon: BookOpen },
                                    { id: 'ai', label: 'AI Code & Study Helper', icon: Sparkles },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const active = activeWorkspaceTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveWorkspaceTab(tab.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                                                active
                                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="p-4 sm:p-6">
                            {activeWorkspaceTab === 'ide' && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                    {/* Left Problem Brief */}
                                    <div className="lg:col-span-5 rounded-2xl border border-border bg-background p-5 flex flex-col justify-between space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge variant="success">DSA · Medium</Badge>
                                                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                                                    Problem #04 / 50
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-bold text-foreground">
                                                1. Two Sum (Hash Map Optimization)
                                            </h2>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Given an array of integers <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground">nums</code> and an integer <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground">target</code>, return indices of the two numbers such that they add up to target.
                                            </p>
                                            <div className="rounded-xl border border-border bg-secondary/40 p-3 font-mono text-xs space-y-1">
                                                <div className="text-muted-foreground">
                                                    Input: <span className="text-foreground">nums = [2, 7, 11, 15], target = 9</span>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    Output: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">[0, 1]</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
                                                AI Hint Ready
                                            </span>
                                            <span className="font-mono">Time: O(n) · Space: O(n)</span>
                                        </div>
                                    </div>

                                    {/* Right Interactive Editor */}
                                    <div className="lg:col-span-7 rounded-2xl border border-border bg-[#0D1117] text-slate-100 overflow-hidden flex flex-col">
                                        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                                            <div className="flex items-center gap-1.5">
                                                {Object.entries(CODE_DEMOS).map(([key, item]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveLang(key);
                                                            setDemoTested(false);
                                                        }}
                                                        className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                                                            activeLang === key
                                                                ? 'bg-indigo-600 text-white font-semibold'
                                                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setDemoTested(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all active:scale-[0.98]"
                                            >
                                                <Play className="w-3 h-3" aria-hidden="true" />
                                                Run Check
                                            </button>
                                        </div>
                                        <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto text-slate-200 flex-1">
                                            <code>{activeDemo.code}</code>
                                        </pre>
                                        <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 text-xs font-mono">
                                            <div className="flex items-center gap-2">
                                                <Terminal className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                                <span className={demoTested ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                                                    {demoTested
                                                        ? `✓ ${activeDemo.output}`
                                                        : `Ready: ${activeDemo.file} — click "Run Check" to test`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeWorkspaceTab === 'notes' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            section: 'Operating Systems',
                                            title: 'CPU Scheduling & Deadlock Avoidance Notes',
                                            meta: 'PDF + Summary · Verified',
                                            tag: 'Notes',
                                        },
                                        {
                                            section: 'DBMS Lab',
                                            title: 'Practical 05: SQL Joins, Views & Triggers',
                                            meta: 'Ready-to-run Code · Output',
                                            tag: 'Practical',
                                        },
                                        {
                                            section: 'Data Structures',
                                            title: 'Binary Trees, AVL Rotations & Traversals',
                                            meta: 'Markdown + C++ Code',
                                            tag: 'Notes',
                                        },
                                    ].map((note, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-2xl border border-border bg-background p-5 flex flex-col justify-between gap-4"
                                        >
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Badge variant="outline" className="text-[11px]">
                                                        {note.section}
                                                    </Badge>
                                                    <Badge variant={note.tag === 'Practical' ? 'success' : 'secondary'} className="text-[11px]">
                                                        {note.tag}
                                                    </Badge>
                                                </div>
                                                <h3 className="font-bold text-sm text-foreground leading-snug">
                                                    {note.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                                                <span>{note.meta}</span>
                                                <span className="text-primary font-semibold">Preview →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeWorkspaceTab === 'ai' && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                    <div className="lg:col-span-5 rounded-2xl border border-border bg-background p-5 space-y-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Active Context Attached
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                'Note: Dynamic Programming Patterns.pdf',
                                                'Code: twoSum.js (Current Editor Buffer)',
                                            ].map((ctx) => (
                                                <div
                                                    key={ctx}
                                                    className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/25 bg-indigo-500/5 text-xs font-semibold text-foreground"
                                                >
                                                    <span className="truncate">{ctx}</span>
                                                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="lg:col-span-7 rounded-2xl border border-border bg-background p-5 space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                                            AI Study & Code Helper Response
                                        </div>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            Your nested loop solution works in <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">O(n²)</span> time. Using a <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">HashMap</span> reduces lookup to <span className="font-mono font-semibold">O(1)</span> average time, bringing total complexity down to <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">O(n)</span>.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </section>

                {/* Metrics Strip */}
                <section className="border-y border-border bg-card/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { value: '50+', label: 'Coding Challenges', icon: Code2 },
                            { value: '5 Tracks', label: 'JS · Python · C++ · Java · DSA', icon: Layers },
                            { value: '24/7', label: 'AI Code & Note Helper', icon: Sparkles },
                            { value: '100%', label: 'Browser Monaco IDE', icon: Zap },
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Bento Grid Feature Showcase */}
                <section id="bento-features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                    <div className="max-w-2xl mb-12 space-y-3">
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            Built for Real Academic Workflows
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                            Every tool a technical student uses daily, thoughtfully unified.
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
                            Designed to eliminate friction between reading lecture notes, completing lab practicals, practicing DSA, and getting peer help.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Large Bento 1: Animated Beam */}
                        <div className="md:col-span-7">
                            <WorkflowBeamCard />
                        </div>

                        {/* Bento 2: Language Tracks Progress */}
                        <div id="tracks" className="md:col-span-5 surface-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                            <div className="space-y-2 mb-6">
                                <Badge variant="secondary">5 Structured Tracks</Badge>
                                <h3 className="text-xl font-bold text-foreground">
                                    Preloaded Coding Tracks
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Track progress per language from Easy fundamentals to Hard interview prep.
                                </p>
                            </div>
                            <div className="space-y-3.5">
                                {[
                                    { name: 'JavaScript', done: 8, total: 10, pct: 80 },
                                    { name: 'Python', done: 6, total: 10, pct: 60 },
                                    { name: 'C++ & STL', done: 7, total: 10, pct: 70 },
                                    { name: 'Java Core', done: 5, total: 10, pct: 50 },
                                    { name: 'DSA Foundations', done: 9, total: 10, pct: 90 },
                                ].map((t) => (
                                    <div key={t.name} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-semibold">
                                            <span className="text-foreground">{t.name}</span>
                                            <span className="font-mono tabular-nums text-muted-foreground">
                                                {t.done}/{t.total}
                                            </span>
                                        </div>
                                        <Progress value={t.pct} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bento 3 */}
                        <div className="md:col-span-4 surface-card rounded-3xl p-6 space-y-4">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Organized Notes Library</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Browse clean subject sections, preview PDFs and markdown code notes inline, and keep personal + shared materials tidy.
                            </p>
                        </div>

                        {/* Bento 4 */}
                        <div className="md:col-span-4 surface-card rounded-3xl p-6 space-y-4">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Verified Practicals Vault</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                College-verified students unlock structured practical sheets with clean syntax highlighting and one-click copy.
                            </p>
                        </div>

                        {/* Bento 5 */}
                        <div className="md:col-span-4 surface-card rounded-3xl p-6 space-y-4">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Real-Time Community</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Ask questions, share solutions, react to peer posts, and receive live Socket.io updates across your cohort.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                    <div className="text-center mb-10 space-y-2">
                        <h2 className="text-3xl font-extrabold text-foreground">Frequently Asked Questions</h2>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Quick answers about Student Hub features, coding tracks, and access.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, idx) => {
                            const isOpen = faqIndex === idx;
                            return (
                                <div key={idx} className="surface-card rounded-2xl overflow-hidden">
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        onClick={() => setFaqIndex(isOpen ? null : idx)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 min-h-[56px] hover:bg-secondary/40 transition-colors"
                                    >
                                        <span className="font-semibold text-sm sm:text-base text-foreground">{faq.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180 text-primary' : ''
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 pt-2 text-sm text-muted-foreground border-t border-border leading-relaxed">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Reach Us / Closing CTA */}
                <section id="reach-us" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                    <div className="surface-card rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-5">
                            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                                Ready When You Are
                            </Badge>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                                Bring calm structure to every semester.
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Create your Student Hub account in seconds or reach out to our team if you want to contribute study notes or report feedback.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-1">
                                <Link to="/signup">
                                    <Button size="lg">
                                        Create Free Account
                                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                <MessageSquare className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                                <span>support@studenthub.edu</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-background p-6">
                            {contactSent ? (
                                <div className="py-10 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">Message received</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Thanks for reaching out! Our team will respond shortly.
                                    </p>
                                    <Button variant="outline" size="sm" onClick={() => setContactSent(false)}>
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setContactSent(true);
                                        e.target.reset();
                                    }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-lg font-bold text-foreground">Send us a quick note</h3>
                                    <div>
                                        <label htmlFor="contact-name" className="block text-xs font-semibold text-foreground mb-1.5">
                                            Name
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            placeholder="Your full name"
                                            className="w-full min-h-[44px] rounded-xl border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            placeholder="student@university.edu"
                                            className="w-full min-h-[44px] rounded-xl border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-message" className="block text-xs font-semibold text-foreground mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            rows="3"
                                            required
                                            placeholder="How can we help you?"
                                            className="w-full rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Send Message
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-border bg-card/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <img src="/circle_logo.png" alt="Student Hub" className="h-7 w-7 object-contain" loading="lazy" />
                        <span className="font-bold text-sm text-foreground">Student Hub</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">· Study Notes, Labs & Coding IDE</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
                        <a href="#workspace-preview" className="hover:text-foreground transition-colors">Workspace</a>
                        <a href="#bento-features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
                        <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Student Hub
                    </div>
                </div>
            </footer>
        </div>
    );
}
