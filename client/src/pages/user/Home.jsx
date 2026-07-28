import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Bell,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    TrendingUp,
    Zap,
    BookOpen,
    LayoutGrid,
    Home as HomeIcon,
    BarChart3,
    Users,
    MessageSquare,
    Notebook,
    Code2,
    FlaskConical,
    Info,
    Icon,
    Sparkles,
} from "lucide-react";

import { Card, CardTitle } from "/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    // ChartConfig
} from "/components/ui/chart";

import { Progress } from "/components/ui/progress";
import { Separator } from "/components/ui/separator";
import { DashboardLayout } from "@/components/layout/layout";
import { DashStatCard, DashStatCard as DashboardStatCard } from "@/components/widgets/stat-card";
import RippleLoader from "@/components/ui/nurui/ripple-loader";
import { theme } from "@/lib/theme";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, CartesianGrid, YAxis } from "recharts";
import { fetchUserProgress } from "@/Api/api";
import { Link } from "react-router-dom";
import { DotLoader } from "@/Utils/loaders";
import { useData } from "@/context/DataContext"

function SubjectProgressRow({ name, progress, done, total, Icon }) {
    const remaining = Math.max(0, total - done);
    const percent = Math.round(progress || 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold"
                    >
                        <Icon size={16} className="text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-sm capitalize truncate text-slate-900">
                            {name}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500">
                            <span className="text-emerald-700 font-semibold">{done} completed</span> · <span className="text-amber-700 font-semibold">{remaining} remaining</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {done}/{total}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1 mt-0.5">
                <Progress
                    value={percent}
                    style={{
                        height: 7,
                        borderRadius: 999,
                        backgroundColor: "#F1F5F9",
                        color: "#4F46E5",
                    }}
                />
            </div>
        </div>
    );
}

export function Home() {

    const {
        user,
        practicals,
        notes,
    } = useData();

    const [userProgress, setUserProgress] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        practicalSections: 0,
        noteSections: 0,
        totalPracticals: 0,
        platformVisits: 0,
        totalNotes: 0,
        privateNotes: 0,
        publicNotes: 0,
        recentNotes: [],
    });

    // Fetch user data on component mount
    const fetchUserData = useCallback(async () => {
        try {
            setDashboardStats(prev => ({
                ...prev,
                platformVisits: user?.visitCount
            }))
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [user]);


    // Fetch user progress data & build weekly activity chart
    const fetchUserProgressData = async () => {
        try {
            const progressData = await fetchUserProgress();
            const list = Array.isArray(progressData?.data?.data) ? progressData.data.data : [];
            setUserProgress(list);

            const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const countsMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

            list.forEach(item => {
                const rawDay = String(item?.day || "");
                const count = Array.isArray(item?.completedProblems) ? item.completedProblems.length : 0;
                const matchedDay = WEEKDAYS.find(d => rawDay.toLowerCase().startsWith(d.toLowerCase()));
                if (matchedDay) {
                    countsMap[matchedDay] += count;
                }
            });

            const formattedChart = WEEKDAYS.map(day => ({
                day,
                questions: countsMap[day] || 0
            }));

            setChartData(formattedChart);
        } catch (error) {
            console.error("Error fetching user progress data:", error);
        }
    };

    const totalWeeklyQuestions = useMemo(() => {
        if (!chartData || !Array.isArray(chartData)) return 0;
        return chartData.reduce((sum, item) => sum + (item.questions || 0), 0);
    }, [chartData]);

    const bestActivityDay = useMemo(() => {
        if (!chartData || !Array.isArray(chartData)) return "N/A";
        const best = chartData.reduce((max, item) => (item.questions > max.questions ? item : max), { day: "N/A", questions: 0 });
        return best.questions > 0 ? best.day : "N/A";
    }, [chartData]);

    const avgDailyQuestions = useMemo(() => {
        return (totalWeeklyQuestions / 7).toFixed(1);
    }, [totalWeeklyQuestions]);

    const defaultTrackLanguages = ["javascript", "python", "cpp", "java", "dsa"];

    const mergedUserProgress = useMemo(() => {
        const list = Array.isArray(userProgress) ? userProgress : [];
        const trackMap = {};

        defaultTrackLanguages.forEach(lang => {
            trackMap[lang] = {
                codingLanguage: lang,
                done: 0,
                totalProblems: 10
            };
        });

        list.forEach(item => {
            const lang = String(item?.codingLanguage || "").toLowerCase();
            if (lang) {
                const done = Array.isArray(item?.completedProblems) ? item.completedProblems.length : 0;
                const total = item?.totalProblems || 10;
                trackMap[lang] = {
                    codingLanguage: lang,
                    done,
                    totalProblems: total
                };
            }
        });

        return Object.values(trackMap);
    }, [userProgress]);

    const overallPracticeStats = useMemo(() => {
        let completed = 0;
        let total = 0;
        mergedUserProgress.forEach(t => {
            completed += t.done;
            total += t.totalProblems;
        });
        return {
            completed,
            total,
            remaining: Math.max(0, total - completed)
        };
    }, [mergedUserProgress]);



    const fetchPracticalsSectionsAndTotalPracticals = useMemo(() => {
        setDashboardStats(prev => ({
            ...prev,
            practicalSections: [...new Set(practicals.map(p => p.section))].length,
            totalPracticals: practicals.length,
        }));
    }, [practicals])

    const fetchNotesSectionsAndTotalNotes = useMemo(() => {
        setDashboardStats(prev => ({
            ...prev,
            noteSections: [...new Set(notes.map(n => n.section))].length,
            totalNotes: notes.length,
            privateNotes: notes.filter(n => n.isGlobal).length,
            publicNotes: notes.filter(n => !n.isGlobal).length,
            recentNotes: notes.slice(0, 4),
        }));
    }, [notes]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                await Promise.all([
                    fetchUserData(),
                    fetchUserProgressData(),
                    fetchPracticalsSectionsAndTotalPracticals(),
                    fetchNotesSectionsAndTotalNotes(),
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const quickActions = [
        { label: "Add Note", path: "notes", icon: Notebook },
        { label: "Browse Practicals", path: "practicals", icon: FlaskConical },
        { label: "AI Chatbot", path: "chatbot", icon: Sparkles },
        { label: "Ask Community", path: "community", icon: Users },
        { label: "Start Practice", path: "coding-practice", icon: Code2 },
    ];

    const chartiData = [
        { day: "Mon", questions: 4 },
        { day: "Tue", questions: 7 },
        { day: "Wed", questions: 3 },
        { day: "Thu", questions: 9 },
        { day: "Fri", questions: 6 },
        { day: "Sat", questions: 2 },
        { day: "Sun", questions: 5 },
    ];


    const chartConfig = {
        desktop: {
            label: "Questions",
            color: "#6366F1",
        },
    };

    const stats = {
        subjects: {
            icon: BookOpen,
            trend: "up",
        },
        notes: {
            icon: FileText,
            trend: "up",
        },
        visits: {
            icon: HomeIcon,
            trend: "down",
        },

    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RippleLoader />
                    <p className="font-medium tracking-tight text-slate-500">
                        Loading your dashboard...
                    </p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            {/* Website Info & Platform Highlights Banner */}
            <div className="rounded-2xl border border-indigo-100 p-6 shadow-xs bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200/60">
                            <Sparkles size={14} /> Welcome to Student Hub Platform
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Learn, Practice & Master Coding
                        </h1>
                        <p className="text-sm text-slate-600 font-medium">
                            Everything you need in one place: 50+ practice problems in JavaScript, Python, C++, Java & DSA, study notes, AI assistance, and student community!
                        </p>
                    </div>
                    <Link
                        to="/dashboard/coding-practice"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:scale-105 shrink-0"
                    >
                        <Code2 size={18} /> Start Coding Practice
                    </Link>
                </div>

                {/* Key Platform Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/80">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                            <Code2 size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-slate-900">50+ Challenges</div>
                            <div className="text-[11px] text-slate-500 font-medium">JS, Python, C++, Java, DSA</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-slate-900">Notes & PYQs</div>
                            <div className="text-[11px] text-slate-500 font-medium">Syllabus & Practicals</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-slate-900">AI Tutor 24/7</div>
                            <div className="text-[11px] text-slate-500 font-medium">Instant Code Explanation</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                            <Users size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-slate-900">Community</div>
                            <div className="text-[11px] text-slate-500 font-medium">Peer Collaboration</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Practice Tracks Row */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Featured Practice Tracks</h2>
                        <p className="text-xs text-slate-500 font-medium">10 practice problems per track ready for you to solve</p>
                    </div>
                    <Link to="/dashboard/coding-practice" className="text-xs font-bold text-indigo-600 hover:underline">
                        View All Tracks →
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { title: "JavaScript", lang: "javascript", count: "10 Problems", color: "bg-amber-50 text-amber-800", border: "hover:border-amber-400" },
                        { title: "Python", lang: "python", count: "10 Problems", color: "bg-blue-50 text-blue-800", border: "hover:border-blue-400" },
                        { title: "C++", lang: "cpp", count: "10 Problems", color: "bg-indigo-50 text-indigo-800", border: "hover:border-indigo-400" },
                        { title: "Java", lang: "java", count: "10 Problems", color: "bg-orange-50 text-orange-800", border: "hover:border-orange-400" },
                        { title: "DSA", lang: "dsa", count: "10 Problems", color: "bg-emerald-50 text-emerald-800", border: "hover:border-emerald-400" },
                    ].map((track) => (
                        <Link
                            key={track.lang}
                            to={`/dashboard/coding-practice/${track.lang}`}
                            className={`p-4 rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 shadow-xs hover:shadow-md ${track.border}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${track.color}`}>
                                    {track.title}
                                </span>
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded">
                                    Ready
                                </span>
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 mt-1">10 Questions</div>
                            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Easy · Medium · Hard</div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stat cards row */}
            <div className="flex items-center sm:flex-nowrap flex-wrap justify-between gap-4 ">

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <DashStatCard
                        icon={stats.subjects.icon}
                        title="Practicals Sections"
                        value={dashboardStats.practicalSections || 0}
                        trend={stats.subjects.trend}
                    />
                    <DashStatCard
                        icon={stats.subjects.icon}
                        title="Note Sections"
                        value={dashboardStats.noteSections || 0}
                        trend={stats.subjects.trend}
                    />

                    <DashStatCard
                        icon={stats.notes.icon}
                        title="Total Practicals"
                        value={dashboardStats.totalPracticals || 0}
                        trend={stats.notes.trend}
                    />
                    <DashStatCard
                        icon={stats.visits.icon}
                        title="Platform Visits"
                        value={dashboardStats.platformVisits || 0}
                        trend={stats.visits.trend}
                    />
                </div>
                <div className="space-y-2.5 p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div
                        className="h-12 p-3 w-60 rounded-xl border border-slate-200 bg-slate-50/50 transition-all flex items-center justify-between font-bold text-sm hover:border-indigo-300 text-slate-800"
                    >
                        Notes saved
                        <p className="mx-2 text-indigo-600 font-extrabold"> {dashboardStats.totalNotes}</p>
                    </div>

                    <div
                        className="h-12 p-3 w-60 rounded-xl border border-slate-200 bg-slate-50/50 transition-all flex items-center justify-between font-bold text-sm hover:border-indigo-300 text-slate-800"
                    >
                        Private Note
                        <p className="mx-2 text-indigo-600 font-extrabold"> {dashboardStats.privateNotes}</p>
                    </div>

                    <div
                        className="h-12 p-3 w-60 rounded-xl border border-slate-200 bg-slate-50/50 transition-all flex items-center justify-between font-bold text-sm hover:border-indigo-300 text-slate-800"
                    >
                        Public Note
                        <p className="mx-2 text-indigo-600 font-extrabold"> {dashboardStats.publicNotes}</p>
                    </div>
                </div>
            </div>

            {/* Subject Progress + Recent Notes + Activity row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Subject Progress - Col 1 */}
                <Card
                    className="rounded-2xl bg-white border border-slate-200 shadow-xs"
                >
                    <div className="sm:p-6 p-4">
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle
                                className="text-[16px] font-bold text-slate-900"
                            >
                                Practices Progress
                            </CardTitle>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                {overallPracticeStats.completed}/{overallPracticeStats.total} Total
                            </span>
                        </div>
                        <div
                            className="text-[12px] font-medium flex items-center gap-1.5 mt-1 text-slate-500"
                        >
                            <span className="text-emerald-700 font-bold">{overallPracticeStats.completed} completed</span>
                            <span>•</span>
                            <span className="text-amber-700 font-bold">{overallPracticeStats.remaining} remaining</span>
                        </div>

                        <div className="mt-5 space-y-4">
                            {mergedUserProgress.map((s) => (
                                <SubjectProgressRow
                                    key={s.codingLanguage}
                                    name={s.codingLanguage}
                                    progress={(s.done / s.totalProblems) * 100}
                                    done={s.done}
                                    total={s.totalProblems}
                                    Icon={Zap}
                                />
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Recent Notes - Col 2-3 (middle) */}
                <Card
                    className="rounded-2xl lg:col-span-2 bg-white border border-slate-200 shadow-xs"
                >
                    <div className="p-6">
                        <CardTitle
                            className="text-[16px] font-bold text-slate-900"
                        >
                            Recent Notes
                        </CardTitle>
                        <div
                            className="text-[13px] font-medium text-slate-500 mt-1"
                        >
                            Your last saved notes
                        </div>

                        <div className="mt-6 space-y-0">
                            {dashboardStats.recentNotes?.map((note, idx) => (
                                <div key={idx} className="py-4">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md font-extrabold px-2.5 py-1 text-[11px] shrink-0"
                                        >
                                            {note.section}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className="font-bold text-[13px] text-slate-900 truncate hover:text-indigo-600 transition-colors"
                                            >
                                                {note.title}
                                            </div>
                                            <div
                                                className="text-[11px] font-medium text-slate-500 mt-0.5"
                                            >
                                                {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : "Unknown date"}
                                            </div>
                                        </div>
                                    </div>
                                    {idx !== (dashboardStats.recentNotes?.length || 0) - 1 && (
                                        <Separator className="my-4 bg-slate-100" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Link
                                to={"notes"}
                                className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700"
                            >
                                View all notes →
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Activity This Week - Col 4-5 */}
                <Card
                    className="rounded-2xl lg:col-span-2 bg-white border border-slate-200 shadow-xs"
                >
                    <div className="p-6">
                        <CardTitle
                            className="text-[16px] font-bold text-slate-900"
                        >
                            Activity This Week
                        </CardTitle>
                        <div
                            className="text-[13px] font-medium text-slate-500 mt-1"
                        >
                            Practice sessions per day
                        </div>

                        <div className="my-6" style={{ height: "160px" }}>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData || chartiData}>
                                        <CartesianGrid vertical={false} stroke="#F1F5F9" />

                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                            stroke="#64748B"
                                        />

                                        <YAxis
                                            domain={[0, 'auto']}
                                            allowDecimals={false}
                                            stroke="#64748B"
                                        />

                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent />}
                                        />

                                        <Bar
                                            dataKey="questions"
                                            fill="#6366F1"
                                            radius={8}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>

                        <div
                            className="text-[12px] font-medium text-center mt-4 text-slate-500"
                        >
                            Avg {avgDailyQuestions} questions/day · Best: {bestActivityDay}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Student Reviews & Community Feedback Section */}
            <Card
                className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs"
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[16px] font-bold text-slate-900">
                                Student Reviews & Community Feedback ⭐
                            </CardTitle>
                            <p className="text-[13px] font-medium text-slate-500 mt-1">
                                What engineering students & peer developers say about Student Hub
                            </p>
                        </div>
                        <Link to="/dashboard/feedback" className="text-xs font-bold text-indigo-600 hover:underline">
                            Share Feedback →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {[
                            {
                                name: "Aarav Sharma",
                                role: "Computer Engineering (3rd Year)",
                                rating: "★★★★★",
                                comment: "Student Hub's 50+ built-in practice questions helped me clear my DSA technical rounds. The online Monaco editor with test cases feels just like LeetCode!",
                                avatarBg: "bg-indigo-100 text-indigo-700 border border-indigo-200/60"
                            },
                            {
                                name: "Priya Mehta",
                                role: "Information Technology (2nd Year)",
                                rating: "★★★★★",
                                comment: "The AI Assistant combined with practical solution codes is a lifesaver during exams. Having C++, Python, and Java tracks pre-loaded makes practicing super easy.",
                                avatarBg: "bg-purple-100 text-purple-700 border border-purple-200/60"
                            },
                            {
                                name: "Rahul Kadam",
                                role: "B.Tech CSE Student",
                                rating: "★★★★★",
                                comment: "Clean UI, instant access to notes & PYQs without annoying popups. The community discussion and coding tracks are the best features of this platform!",
                                avatarBg: "bg-amber-100 text-amber-800 border border-amber-200/60"
                            }
                        ].map((fb, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/60 hover:bg-slate-50 transition-all shadow-2xs"
                            >
                                <div className="space-y-2">
                                    <div className="text-amber-500 text-xs font-black tracking-widest">{fb.rating}</div>
                                    <p className="text-xs italic text-slate-700 leading-relaxed font-medium">
                                        "{fb.comment}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/70">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs ${fb.avatarBg}`}>
                                        {fb.name[0]}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">{fb.name}</div>
                                        <div className="text-[10px] font-medium text-slate-500">{fb.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Quick Actions - Full width */}
            <Card
                className="rounded-2xl bg-white border border-slate-200 shadow-xs"
            >
                <div className="p-6">
                    <CardTitle
                        className="text-[16px] font-bold text-slate-900"
                    >
                        Quick Actions
                    </CardTitle>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={`/dashboard/${action.path}`}
                                className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2 font-bold text-sm text-slate-800 shadow-2xs"
                            >
                                <action.icon size={18} className="text-indigo-600" />
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </Card>
        </DashboardLayout>
    );
}
