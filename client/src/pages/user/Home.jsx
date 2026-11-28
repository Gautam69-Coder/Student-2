import { useState, useEffect, useMemo } from "react";
import {
    FileText,
    BookOpen,
    Home as HomeIcon,
    Users,
    Notebook,
    Code2,
    FlaskConical,
    Sparkles,
    Zap,
    ArrowRight,
} from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import FeedbackMarquee from "@/components/features/feedback/feedback-marquee";
import { formatDate } from "@/Utils/date";
import { DotLoader } from "@/Utils/loaders";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/layout/layout";
import { DashStatCard } from "@/components/widgets/stat-card";
import RippleLoader from "@/components/ui/nurui/ripple-loader";
import { BarChart, Bar, XAxis, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";
import { fetchUserProgress } from "@/Api/api";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { usePracticals } from "@/hooks/usePracticals";
import { useNotes } from "@/hooks/useNotes";
import { canAccessPracticals } from "@/Utils/vesCheck";

const DEFAULT_TRACK_LANGUAGES = ["javascript", "python", "cpp", "java", "dsa"];

function SubjectProgressRow({ name, progress, done, total, Icon }) {
    const remaining = Math.max(0, total - done);
    const percent = Math.round(progress || 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <Icon size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-sm capitalize truncate text-foreground">
                            {name}
                        </div>
                        <div className="text-[11px] font-medium text-muted-foreground tabular-nums">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                {done} completed
                            </span>{" "}
                            · <span>{remaining} remaining</span>
                        </div>
                    </div>
                </div>

                <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border tabular-nums shrink-0">
                    {done}/{total}
                </span>
            </div>

            <Progress value={percent} className="h-2" />
        </div>
    );
}

export function Home() {
    const { user } = useData();
    const { practicals } = usePracticals();
    const { notes } = useNotes();

    const [userProgress, setUserProgress] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    const dashboardStats = useMemo(() => {
        const practicalList = Array.isArray(practicals) ? practicals : [];
        const notesList = Array.isArray(notes) ? notes : [];
        return {
            practicalSections: [...new Set(practicalList.map((p) => p.section))].length,
            totalPracticals: practicalList.length,
            noteSections: [...new Set(notesList.map((n) => n.section))].length,
            totalNotes: notesList.length,
            privateNotes: notesList.filter((n) => n.isGlobal).length,
            publicNotes: notesList.filter((n) => !n.isGlobal).length,
            recentNotes: notesList.slice(0, 4),
            platformVisits: user?.visitCount || 0,
        };
    }, [practicals, notes, user]);

    const fetchUserProgressData = async () => {
        try {
            const progressData = await fetchUserProgress();
            const list = Array.isArray(progressData?.data?.data) ? progressData.data.data : [];
            setUserProgress(list);

            const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const countsMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

            list.forEach((item) => {
                const rawDay = String(item?.day || "");
                const count = Array.isArray(item?.completedProblems) ? item.completedProblems.length : 0;
                const matchedDay = WEEKDAYS.find((d) => rawDay.toLowerCase().startsWith(d.toLowerCase()));
                if (matchedDay) {
                    countsMap[matchedDay] += count;
                }
            });

            setChartData(
                WEEKDAYS.map((day) => ({
                    day,
                    questions: countsMap[day] || 0,
                }))
            );
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
        const best = chartData.reduce(
            (max, item) => (item.questions > max.questions ? item : max),
            { day: "N/A", questions: 0 }
        );
        return best.questions > 0 ? best.day : "N/A";
    }, [chartData]);

    const avgDailyQuestions = useMemo(() => {
        return (totalWeeklyQuestions / 7).toFixed(1);
    }, [totalWeeklyQuestions]);

    const mergedUserProgress = useMemo(() => {
        const list = Array.isArray(userProgress) ? userProgress : [];
        const trackMap = {};

        DEFAULT_TRACK_LANGUAGES.forEach((lang) => {
            trackMap[lang] = { codingLanguage: lang, done: 0, totalProblems: 10 };
        });

        list.forEach((item) => {
            const lang = String(item?.codingLanguage || "").toLowerCase();
            if (lang) {
                const done = Array.isArray(item?.completedProblems) ? item.completedProblems.length : 0;
                const total = item?.totalProblems || 10;
                trackMap[lang] = { codingLanguage: lang, done, totalProblems: total };
            }
        });

        return Object.values(trackMap);
    }, [userProgress]);

    const overallPracticeStats = useMemo(() => {
        let completed = 0;
        let total = 0;
        mergedUserProgress.forEach((t) => {
            completed += t.done;
            total += t.totalProblems;
        });
        return {
            completed,
            total,
            remaining: Math.max(0, total - completed),
            pct: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    }, [mergedUserProgress]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                await fetchUserProgressData();
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
        ...(canAccessPracticals(user) ? [{ label: "Browse Practicals", path: "practicals", icon: FlaskConical }] : []),
        { label: "Ask Community", path: "community", icon: Users },
        { label: "Start Practice", path: "coding-practice", icon: Code2 },
    ];

    const chartConfig = {
        questions: {
            label: "Problems Solved",
            color: "#6366F1",
        },
    };

    const stats = {
        subjects: { icon: BookOpen },
        notes: { icon: FileText },
        visits: { icon: HomeIcon },
    };

    const userFeedback = [
        {
            name: "Aarav Sharma",
            role: "Computer Engineering (3rd Year)",
            rating: "★★★★★",
            comment:
                "Student Hub's 50+ built-in practice questions helped me clear my DSA technical rounds. The Monaco editor feels snappy and distraction-free!",
            avatarBg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25",
        },
        {
            name: "Priya Mehta",
            role: "Information Technology (2nd Year)",
            rating: "★★★★★",
            comment:
                "The AI Assistant combined with practical solution codes is a lifesaver during exams. Having C++, Python, and Java tracks preloaded makes practice effortless.",
            avatarBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25",
        },
        {
            name: "Rahul Kadam",
            role: "B.Tech CSE Student",
            rating: "★★★★★",
            comment:
                "Clean UI and instant access to study notes without clutter. Community discussions and coding tracks keep everything in one place!",
            avatarBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25",
        },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RippleLoader />
                    <p className="text-sm font-medium text-muted-foreground">
                        Loading your study workspace...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Study Cockpit Hero */}
            <div className="surface-card rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-500/[0.07] via-card to-emerald-500/[0.06]">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                            <Sparkles size={13} aria-hidden="true" />
                            <span>Welcome back, {user?.username || "Student"}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            Your Study & Coding Cockpit
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Jump back into your 50+ coding challenges across JavaScript, Python, C++, Java & DSA, manage study notes, and collaborate with peers.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
                        <div className="px-4 py-2.5 rounded-2xl bg-background/80 border border-border flex items-center gap-3">
                            <div>
                                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Overall Mastery
                                </div>
                                <div className="text-lg font-extrabold text-foreground tabular-nums">
                                    {overallPracticeStats.completed}/{overallPracticeStats.total}{" "}
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        ({overallPracticeStats.pct}%)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/dashboard/coding-practice"
                            className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm shadow-indigo-500/20"
                        >
                            <Code2 size={17} aria-hidden="true" />
                            <span>Start Coding</span>
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                {/* Quick Highlight Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-background/80 border border-border">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Code2 size={17} aria-hidden="true" />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-foreground">50+ Challenges</div>
                            <div className="text-[11px] text-muted-foreground">JS, Python, C++, Java, DSA</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-background/80 border border-border">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <BookOpen size={17} aria-hidden="true" />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-foreground">Study Notes</div>
                            <div className="text-[11px] text-muted-foreground">
                                {canAccessPracticals(user) ? "Syllabus & Practicals" : "Syllabus & Materials"}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-background/80 border border-border">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Sparkles size={17} aria-hidden="true" />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-foreground">AI Tutor 24/7</div>
                            <div className="text-[11px] text-muted-foreground">Instant Code Explanation</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-background/80 border border-border">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Users size={17} aria-hidden="true" />
                        </div>
                        <div>
                            <div className="font-bold text-xs text-foreground">Community</div>
                            <div className="text-[11px] text-muted-foreground">Peer Collaboration</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Practice Tracks */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Featured Practice Tracks</h2>
                        <p className="text-xs text-muted-foreground">
                            10 practice problems per track ready inside your Monaco IDE
                        </p>
                    </div>
                    <Link
                        to="/dashboard/coding-practice"
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                        View All Tracks
                        <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { title: "JavaScript", lang: "javascript", badgeCls: "bg-amber-500/12 text-amber-700 dark:text-amber-300" },
                        { title: "Python", lang: "python", badgeCls: "bg-sky-500/12 text-sky-700 dark:text-sky-300" },
                        { title: "C++", lang: "cpp", badgeCls: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300" },
                        { title: "Java", lang: "java", badgeCls: "bg-orange-500/12 text-orange-700 dark:text-orange-300" },
                        { title: "DSA", lang: "dsa", badgeCls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
                    ].map((track) => (
                        <Link
                            key={track.lang}
                            to={`/dashboard/coding-practice/${track.lang}`}
                            className="p-4 rounded-2xl surface-card hover:-translate-y-0.5 transition-all"
                        >
                            <div className="flex items-center justify-between mb-2.5">
                                <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md ${track.badgeCls}`}>
                                    {track.title}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/12 border border-emerald-500/25 px-1.5 py-0.5 rounded-md">
                                    Ready
                                </span>
                            </div>
                            <div className="text-sm font-bold text-foreground tabular-nums">10 Questions</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">Easy · Medium · Hard</div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stat Cards & Notes Summary Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                <div
                    className={`xl:col-span-8 grid grid-cols-2 ${
                        canAccessPracticals(user) ? "sm:grid-cols-4" : "sm:grid-cols-2"
                    } gap-4`}
                >
                    {canAccessPracticals(user) && (
                        <DashStatCard
                            icon={stats.subjects.icon}
                            title="Practical Sections"
                            value={dashboardStats.practicalSections || 0}
                        />
                    )}
                    <DashStatCard
                        icon={stats.subjects.icon}
                        title="Note Sections"
                        value={dashboardStats.noteSections || 0}
                    />
                    {canAccessPracticals(user) && (
                        <DashStatCard
                            icon={stats.notes.icon}
                            title="Total Practicals"
                            value={dashboardStats.totalPracticals || 0}
                        />
                    )}
                    <DashStatCard
                        icon={stats.visits.icon}
                        title="Platform Visits"
                        value={dashboardStats.platformVisits || 0}
                    />
                </div>

                <div className="xl:col-span-4 surface-card rounded-2xl p-4 flex flex-col justify-center gap-2.5">
                    {[
                        { label: "Notes Saved", value: dashboardStats.totalNotes },
                        { label: "Global Notes", value: dashboardStats.privateNotes },
                        { label: "Personal Notes", value: dashboardStats.publicNotes },
                    ].map((row) => (
                        <div
                            key={row.label}
                            className="h-11 px-3.5 rounded-xl border border-border bg-background/70 flex items-center justify-between text-xs font-semibold text-foreground"
                        >
                            <span>{row.label}</span>
                            <span className="text-primary font-extrabold tabular-nums">
                                {row.value === null || row.value === "" || row.value === 0 ? (
                                    <DotLoader size="18" color="#4F46E5" />
                                ) : (
                                    row.value
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Practice Progress */}
            <Card className="surface-card rounded-2xl py-0">
                <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base font-bold text-foreground">
                            Practice Track Progress
                        </CardTitle>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25 tabular-nums">
                            {overallPracticeStats.completed}/{overallPracticeStats.total} Total
                        </span>
                    </div>
                    <div className="text-xs font-medium flex items-center gap-1.5 mt-1 text-muted-foreground tabular-nums">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {overallPracticeStats.completed} completed
                        </span>
                        <span>·</span>
                        <span>{overallPracticeStats.remaining} remaining</span>
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

            {/* Recent Notes + Weekly Activity */}
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 w-full">
                <Card className="surface-card rounded-2xl py-0 w-full">
                    <div className="p-6">
                        <CardTitle className="text-base font-bold text-foreground">
                            Recent Notes
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Your latest saved materials</p>

                        <div className="mt-5 space-y-0">
                            {dashboardStats.recentNotes?.length > 0 ? (
                                dashboardStats.recentNotes.map((note, idx) => (
                                    <div key={note._id || idx} className="py-2">
                                        <div className="flex items-start gap-3">
                                            <span className="inline-block bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 rounded-lg font-bold px-2.5 py-1 text-[11px] shrink-0">
                                                {note.section || "General"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm text-foreground truncate">
                                                    {note.title}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                                                    {formatDate(note.updatedAt)}
                                                </div>
                                            </div>
                                        </div>
                                        {idx !== (dashboardStats.recentNotes?.length || 0) - 1 && (
                                            <Separator className="my-3.5" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground py-6">No notes uploaded yet.</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Link to="notes" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                                View all notes
                                <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </Card>

                <Card className="surface-card rounded-2xl w-full py-0 h-fit">
                    <div className="p-6">
                        <CardTitle className="text-base font-bold text-foreground">
                            Activity This Week
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                            Practice problems solved per day
                        </p>

                        <div className="my-6 overflow-hidden">
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData || []}>
                                        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            domain={[0, "auto"]}
                                            allowDecimals={false}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="questions" fill="#6366F1" radius={8} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>

                        <div className="text-xs font-medium text-center text-muted-foreground tabular-nums">
                            Avg {avgDailyQuestions} questions/day · Best: {bestActivityDay}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Student Reviews Marquee */}
            <Card className="surface-card rounded-2xl overflow-hidden py-0">
                <FeedbackMarquee feedbacks={userFeedback} />
            </Card>

            {/* Quick Actions */}
            <Card className="surface-card rounded-2xl py-0">
                <div className="p-6">
                    <CardTitle className="text-base font-bold text-foreground">Quick Actions</CardTitle>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={`/dashboard/${action.path}`}
                                className="min-h-[46px] px-4 rounded-xl border border-border bg-background hover:bg-secondary hover:border-primary/40 transition-all flex items-center justify-center gap-2 font-bold text-xs sm:text-sm text-foreground"
                            >
                                <action.icon size={16} className="text-primary" aria-hidden="true" />
                                <span>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </Card>
        </DashboardLayout>
    );
}
