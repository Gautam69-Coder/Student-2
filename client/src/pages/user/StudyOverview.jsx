import React, { useState,useEffect } from "react";
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
    Home,
    BarChart3,
    Users,
    MessageSquare,
    Code2,
    FlaskConical,
    Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { Progress } from "/components/ui/progress";
import { Separator } from "/components/ui/separator";
import {
    DashboardLayout,
    DashboardSidebar,
    DashStatCard,
} from "@/components/dashboard";
import { theme } from "@/lib/theme";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { getMe,userProfileUpdate } from "@/Api/api";
import { toUpperName } from "../../utils/ToUpperName";
import { Link } from "react-router-dom";


function SubjectProgressRow({ name, progress, done, total, Icon }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: theme.colors.purpleLight }}
                    >
                        <Icon size={18} color={theme.colors.dark} />
                    </div>
                    <div className="font-semibold" style={{ color: theme.colors.dark }}>
                        {name}
                    </div>
                </div>
                <div
                    style={{
                        display: "inline-block",
                        background: theme.colors.limeDimmer,
                        color: theme.colors.dark,
                        borderRadius: 999,
                        fontWeight: 800,
                        padding: "4px 12px",
                        fontSize: "12px",
                    }}
                >
                    {done}/{total}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Progress
                    value={progress}
                    style={{
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: theme.colors.softGray,
                        color: theme.colors.lime,
                    }}
                />
                <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                    {done}/{total} practicals done
                </div>
            </div>
        </div>
    );
}

export default function StudyOverview() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isBell, setIsBell] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data on component mount
        const fetchUserData = async () => {
            try {
                const userData = await getMe();
                setUserData(userData.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const navItems = [
        { label: "Home", path: "/dashboard", icon: Home },
        { label: "Notes", path: "/dashboard/notes", icon: FileText },
        { label: "Practicals", path: "/dashboard/practicals", icon: FlaskConical },
        { label: "Practice", path: "/dashboard/coding-practice", icon: Code2 },
        { label: "Community", path: "/dashboard/community", icon: Users },
        { label: "Feedback", path: "/dashboard/feedback", icon: MessageSquare },
        { label: "About", path: "/dashboard/about-contact", icon: Info },
    ];

    const stats = {
        subjects: { value: 4, trend: "+12% this week", icon: LayoutGrid },
        practicals: { value: 23, trend: "+7% this week", icon: CheckCircle2 },
        notes: { value: "500+", trend: "+18% this week", icon: FileText },
        visits: { value: "7,958", trend: "+9% this week", icon: TrendingUp },
    };

    const subjects = [
        { name: "Scilab", progress: 80, done: 8, total: 10, icon: Zap },
        { name: "Java", progress: 65, done: 6, total: 9, icon: BookOpen },
        { name: "CN", progress: 55, done: 5, total: 9, icon: Clock },
        { name: "Figma", progress: 40, done: 4, total: 10, icon: Bell },
    ];

    const activityData = [
        { day: "Mon", sessions: 4, fill: theme.colors.lightGray },
        { day: "Tue", sessions: 7, fill: theme.colors.lime },
        { day: "Wed", sessions: 3, fill: theme.colors.lightGray },
        { day: "Thu", sessions: 9, fill: theme.colors.lime },
        { day: "Fri", sessions: 6, fill: theme.colors.lime },
        { day: "Sat", sessions: 2, fill: theme.colors.lightGray },
        { day: "Sun", sessions: 5, fill: theme.colors.lime },
    ];

    const recentNotesList = [
        {
            subject: "Java",
            title: "Java Multithreading — Thread lifecycle & synchronization",
            ts: "2 days ago",
        },
        {
            subject: "CN",
            title: "CN — OSI Model layers explained with examples",
            ts: "4 days ago",
        },
        {
            subject: "Scilab",
            title: "Scilab — Matrix operations & plotting basics",
            ts: "1 week ago",
        },
        {
            subject: "Figma",
            title: "Figma — Auto Layout & component variants",
            ts: "1 week ago",
        },
    ];

    const quickActions = [
        { label: "📝 Add Note", path: "/notes/" },
        { label: "📂 Browse Practicals", path: "/practicals" },
        { label: "💬 Ask Community", path: "/community" },
        { label: "⚡ Start Practice", path: "/practice" },
    ];

    return (
        <DashboardLayout
        >
            {/* Stat cards row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashStatCard
                    icon={stats.subjects.icon}
                    title="Active Subjects"
                    value={stats.subjects.value}
                    trend={stats.subjects.trend}
                />
                <DashStatCard
                    icon={stats.practicals.icon}
                    title="Total Practicals"
                    value={stats.practicals.value}
                    trend={stats.practicals.trend}
                />
                <DashStatCard
                    icon={stats.notes.icon}
                    title="Notes Saved"
                    value={stats.notes.value}
                    trend={stats.notes.trend}
                />
                <DashStatCard
                    icon={stats.visits.icon}
                    title="Platform Visits"
                    value={stats.visits.value}
                    trend={stats.visits.trend}
                />
            </div>

            {/* Subject Progress + Recent Notes + Activity row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Subject Progress - Col 1 */}
                <Card
                    className="rounded-2xl"
                    style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                >
                    <div className="sm:p-6 p-4">
                        <CardTitle
                            className="text-[16px] font-bold"
                            style={{ color: theme.colors.dark }}
                        >
                            Subject Progress
                        </CardTitle>
                        <div
                            className="text-[13px] font-medium"
                            style={{ color: theme.colors.darkGray, marginTop: 4 }}
                        >
                            4 key subjects · lime indicates active progress
                        </div>

                        <div className="mt-6 space-y-6">
                            {subjects.map((s) => (
                                <SubjectProgressRow
                                    key={s.name}
                                    name={s.name}
                                    progress={s.progress}
                                    done={s.done}
                                    total={s.total}
                                    Icon={s.icon}
                                />
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Recent Notes - Col 2-3 (middle) */}
                <Card
                    className="rounded-2xl lg:col-span-2"
                    style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                >
                    <div className="p-6">
                        <CardTitle
                            className="text-[16px] font-bold"
                            style={{ color: theme.colors.dark }}
                        >
                            Recent Notes
                        </CardTitle>
                        <div
                            className="text-[13px] font-medium"
                            style={{ color: theme.colors.darkGray, marginTop: 4 }}
                        >
                            Your last saved notes
                        </div>

                        <div className="mt-6 space-y-0">
                            {recentNotesList.map((note, idx) => (
                                <div key={idx} className="py-4">
                                    <div className="flex items-start gap-3">
                                        <div
                                            style={{
                                                display: "inline-block",
                                                background: theme.colors.limeDimmer,
                                                color: theme.colors.dark,
                                                borderRadius: 999,
                                                fontWeight: 800,
                                                padding: "4px 10px",
                                                fontSize: "11px",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {note.subject}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className="font-semibold text-[13px] truncate"
                                                style={{ color: theme.colors.dark }}
                                            >
                                                {note.title}
                                            </div>
                                            <div
                                                className="text-[11px] font-medium"
                                                style={{ color: theme.colors.darkGray, marginTop: 2 }}
                                            >
                                                {note.ts}
                                            </div>
                                        </div>
                                    </div>
                                    {idx !== recentNotesList.length - 1 && (
                                        <Separator className="my-4" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Link
                                to={"notes"}
                                className="text-[13px] font-bold"
                                style={{ color: theme.colors.lime }}
                            >
                                View all notes →
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Activity This Week - Col 4-5 */}
                <Card
                    className="rounded-2xl lg:col-span-2"
                    style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
                >
                    <div className="p-6">
                        <CardTitle
                            className="text-[16px] font-bold"
                            style={{ color: theme.colors.dark }}
                        >
                            Activity This Week
                        </CardTitle>
                        <div
                            className="text-[13px] font-medium"
                            style={{ color: theme.colors.darkGray, marginTop: 4 }}
                        >
                            Study sessions per day
                        </div>

                        <div className="mt-6" style={{ height: "160px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activityData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                                    <XAxis
                                        dataKey="day"
                                        stroke={theme.colors.darkGray}
                                        style={{ fontSize: "12px" }}
                                    />
                                    <Bar dataKey="sessions" radius={[4, 4, 0, 0]} width={28}>
                                        {activityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div
                            className="text-[12px] font-medium text-center mt-4"
                            style={{ color: theme.colors.darkGray }}
                        >
                            Avg 5.1 sessions/day · Best: Thursday
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions - Full width */}
            <Card
                className="rounded-2xl"
                style={{ background: theme.colors.white, borderColor: theme.colors.lightGray }}
            >
                <div className="p-6">
                    <CardTitle
                        className="text-[16px] font-bold"
                        style={{ color: theme.colors.dark }}
                    >
                        Quick Actions
                    </CardTitle>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={`/dashboard/${action.path}`}
                                className="h-12 px-4 rounded-xl border transition-all flex items-center justify-center font-bold text-sm hover:border-lime-400"
                                style={{
                                    borderColor: theme.colors.lightGray,
                                    background: theme.colors.white,
                                    color: theme.colors.dark,
                                }}
                            >
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </Card>
        </DashboardLayout>
    );
}

