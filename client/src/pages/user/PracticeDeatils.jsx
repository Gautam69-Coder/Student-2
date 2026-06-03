import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCodingPractices } from "@/Api/api";
import { theme } from "@/lib/theme";
import {
    ArrowUpRight,
    BookOpen,
    Circle,
    Code2,
    Clock3,
    ListChecks,
    Sparkles,
    Star,
    Users,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { Progress } from "/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard/layout";

function StatPill({ icon: Icon, label, value }) {
    return (
        <div
            className="flex items-center gap-3 rounded-2xl border px-4 py-3"
            style={{
                background: theme.colors.white,
                borderColor: theme.colors.lightGray,
                boxShadow: "0 8px 0 rgba(17,17,19,0.05)",
            }}
        >
            <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: theme.colors.limeDim }}
            >
                <Icon size={18} color={theme.colors.dark} />
            </div>
            <div className="min-w-0">
                <div className="text-[12px] font-medium" style={{ color: theme.colors.darkGray }}>
                    {label}
                </div>
                <div className="text-[15px] font-bold truncate" style={{ color: theme.colors.dark }}>
                    {value}
                </div>
            </div>
        </div>
    );
}

function InfoChip({ icon: Icon, label }) {
    return (
        <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold"
            style={{
                background: theme.colors.white,
                borderColor: theme.colors.lightGray,
                color: theme.colors.dark,
            }}
        >
            <Icon className="w-4 h-4" style={{ color: theme.colors.dark }} />
            <span>{label}</span>
        </div>
    );
}

function ProblemDifficulty({ difficulty }) {
    const variant =
        difficulty === "Easy"
            ? {
                  bg: "rgba(16,185,129,0.12)",
                  border: "rgba(16,185,129,0.30)",
                  text: "#059669",
              }
            : difficulty === "Medium"
                ? {
                      bg: "rgba(245,158,11,0.12)",
                      border: "rgba(245,158,11,0.30)",
                      text: "#D97706",
                  }
                : {
                      bg: "rgba(239,68,68,0.12)",
                      border: "rgba(239,68,68,0.30)",
                      text: "#DC2626",
                  };

    return (
        <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold"
            style={{
                background: variant.bg,
                borderColor: variant.border,
                color: variant.text,
            }}
        >
            {difficulty || "Unknown"}
        </span>
    );
}

function ProblemRow({ problem, index, language, navigate }) {
    return (
        <tr className="border-t border-slate-100 hover:bg-lime-50/60 transition-colors">
            <td className="px-4 sm:px-6 py-4 align-middle text-sm font-bold text-slate-500">
                {index + 1}
            </td>
            <td className="px-4 sm:px-6 py-4 align-middle">
                <button
                    onClick={() =>
                        navigate(
                            `/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(
                                String(problem?._id || "").toLowerCase()
                            )}`
                        )
                    }
                    className="text-left font-semibold text-slate-900 hover:text-lime-700 hover:underline underline-offset-4 transition-colors"
                >
                    {problem?.question || "Untitled question"}
                </button>
                {problem?.description && (
                    <div className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2">
                        {problem.description}
                    </div>
                )}
            </td>
            <td className="px-4 sm:px-6 py-4 align-middle text-center">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-slate-50">
                    <Circle className="w-3 h-3 text-slate-300" />
                </span>
            </td>
            <td className="px-4 sm:px-6 py-4 align-middle text-right">
                <ProblemDifficulty difficulty={problem?.difficulty} />
            </td>
        </tr>
    );
}

export default function PracticeDeatils() {
    const { language } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchCodingPractices();
                const list = Array.isArray(res?.data) ? res.data : [];
                const currentLanguage = String(language || "").toLowerCase();

                const filtered = list.find(
                    (item) => String(item?.language || "").toLowerCase() === currentLanguage
                );

                if (mounted) setData(filtered || {});
            } catch (error) {
                console.error("Error fetching coding practices:", error);
                if (mounted) setData({});
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [language]);

    const problems = useMemo(() => data?.problemList || [], [data]);

    const stats = useMemo(
        () => [
            { icon: BookOpen, label: "Lessons", value: "22+" },
            { icon: Clock3, label: "Duration", value: "10 Hours" },
            { icon: ListChecks, label: "Problems", value: `${problems.length || 0}` },
            { icon: Users, label: "Learners", value: data?.learners || "N/A" },
        ],
        [data?.learners, problems.length]
    );

    const completedCount = 0;
    const progressValue = problems.length ? Math.round((completedCount / problems.length) * 100) : 0;

    const startLearning = () => {
        const firstProblem = problems[0];
        if (!firstProblem?._id) return;
        navigate(
            `/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(
                String(firstProblem._id).toLowerCase()
            )}`
        );
    };

    return (
        <DashboardLayout>
        <div
            
        >
            <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
                <Card
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                    }}
                >
                    <CardContent className="p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span
                                        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-black uppercase tracking-[0.18em]"
                                        style={{
                                            background: theme.colors.lime,
                                            color: theme.colors.dark,
                                            borderColor: theme.colors.lime,
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        {language || "Language"}
                                    </span>

                                    <span
                                        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold"
                                        style={{
                                            background: theme.colors.white,
                                            color: theme.colors.dark,
                                            borderColor: theme.colors.lightGray,
                                        }}
                                    >
                                        <Code2 className="w-4 h-4" />
                                        Practice Path
                                    </span>
                                </div>

                                <h1
                                    className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
                                    style={{ color: theme.colors.dark }}
                                >
                                    Practice {String(language || "N/A").toUpperCase()}
                                </h1>

                                <p
                                    className="mt-4 max-w-3xl text-sm sm:text-base leading-7"
                                    style={{ color: theme.colors.darkGray }}
                                >
                                    {data?.description ||
                                        "Sharpen your fundamentals, solve real problems, and build confidence with structured practice."}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <InfoChip icon={BookOpen} label="Lessons" />
                                    <InfoChip icon={Clock3} label="10 Hours" />
                                    <InfoChip icon={ListChecks} label={`${problems.length || 0} Problems`} />
                                    <InfoChip icon={Users} label={data?.learners || "Learners"} />
                                    <InfoChip icon={Circle} label={`${data?.level || "All"} Level`} />
                                </div>

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                    {stats.map((stat) => (
                                        <StatPill
                                            key={stat.label}
                                            icon={stat.icon}
                                            label={stat.label}
                                            value={stat.value}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="w-full lg:w-[330px] shrink-0">
                                <div
                                    className="rounded-2xl border p-5"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        boxShadow: "0 10px 0 rgba(17,17,19,0.06)",
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4" style={{ color: theme.colors.lime }} />
                                            <span className="text-sm font-bold" style={{ color: theme.colors.dark }}>
                                                4.5
                                            </span>
                                            <span className="text-xs" style={{ color: theme.colors.darkGray }}>
                                                (25.9k+)
                                            </span>
                                        </div>
                                        <span
                                            className="text-[11px] px-2.5 py-1 rounded-full font-bold"
                                            style={{
                                                background: theme.colors.limeDim,
                                                color: theme.colors.dark,
                                            }}
                                        >
                                            Trending
                                        </span>
                                    </div>

                                    <div className="mt-5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span style={{ color: theme.colors.darkGray }}>Your Progress</span>
                                            <span className="font-bold" style={{ color: theme.colors.dark }}>
                                                {progressValue}% Completed
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <Progress
                                                value={progressValue}
                                                style={{
                                                    height: 10,
                                                    borderRadius: 999,
                                                    backgroundColor: theme.colors.softGray,
                                                    color: theme.colors.lime,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={startLearning}
                                        disabled={!problems.length}
                                        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                        style={{
                                            background: theme.colors.lime,
                                            color: theme.colors.dark,
                                            boxShadow: "0 8px 0 rgba(17,17,19,0.18)",
                                        }}
                                    >
                                        Start Learning
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Card
                        className="rounded-2xl"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 10px 0 rgba(17,17,19,0.05)",
                        }}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: theme.colors.limeDim }}
                                >
                                    <ListChecks className="w-5 h-5" style={{ color: theme.colors.dark }} />
                                </div>
                                <div>
                                    <CardTitle className="text-[16px] sm:text-[18px] font-bold" style={{ color: theme.colors.dark }}>
                                        Practice Problems
                                    </CardTitle>
                                    <div className="text-[13px] font-medium" style={{ color: theme.colors.darkGray }}>
                                        Choose a question to open the code editor
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {loading ? (
                                <div
                                    className="rounded-2xl border p-6 text-center font-semibold"
                                    style={{
                                        background: theme.colors.white,
                                        borderColor: theme.colors.lightGray,
                                        color: theme.colors.darkGray,
                                    }}
                                >
                                    Loading practice problems...
                                </div>
                            ) : problems.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[720px] border-separate border-spacing-0">
                                        <thead>
                                            <tr style={{ background: theme.colors.softGray }}>
                                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold" style={{ color: theme.colors.darkGray }}>
                                                    Sr. No.
                                                </th>
                                                <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold" style={{ color: theme.colors.darkGray }}>
                                                    Question
                                                </th>
                                                <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold" style={{ color: theme.colors.darkGray }}>
                                                    Status
                                                </th>
                                                <th className="px-4 sm:px-6 py-4 text-right text-sm font-bold" style={{ color: theme.colors.darkGray }}>
                                                    Difficulty
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {problems.map((problem, index) => (
                                                <ProblemRow
                                                    key={problem?._id || index}
                                                    problem={problem}
                                                    index={index}
                                                    language={language}
                                                    navigate={navigate}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="rounded-2xl border p-10 text-center" style={{ borderColor: theme.colors.lightGray }}>
                                    <div
                                        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                                        style={{ background: theme.colors.limeDim }}
                                    >
                                        <AlertCircle className="w-6 h-6" style={{ color: theme.colors.dark }} />
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: theme.colors.dark }}>
                                        No problems available for this practice set
                                    </div>
                                    <div className="mt-1 text-sm" style={{ color: theme.colors.darkGray }}>
                                        This language does not currently have any practice questions.
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
        </DashboardLayout>
    );
}
