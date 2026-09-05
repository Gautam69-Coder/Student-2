import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCodingPractices, fetchUserProgress } from "@/Api/api";
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
    AlertCircle,
    CircleCheck,
    Search,
    RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/layout/layout";

function StatPill({ icon: Icon, label, value, colorClass }) {
    return (
        <div
            className="flex items-center gap-4 rounded-2xl border p-4 bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 select-none"
            style={{
                borderColor: theme.colors.lightGray,
            }}
        >
            <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass || " text-indigo-600"}`}
            >
                <Icon size={20} className={"text-indigo-600"} />
            </div>
            <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-400">
                    {label}
                </div>
                <div className="text-base font-black text-zinc-950 truncate mt-0.5">
                    {value}
                </div>
            </div>
        </div>
    );
}

function InfoChip({ icon: Icon, label }) {
    return (
        <div
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold  select-none"
            style={{
                borderColor: theme.colors.lightGray,
                color: theme.colors.dark,
            }}
        >
            <Icon className="w-3.5 h-3.5 text-black" />
            <span>{label}</span>
        </div>
    );
}

function ProblemDifficulty({ difficulty }) {
    const variant =
        difficulty === "Easy"
            ? {
                bg: "rgba(34,197,94,0.10)",
                border: "rgba(34,197,94,0.22)",
                text: "#16A34A",
            }
            : difficulty === "Medium"
                ? {
                    bg: "rgba(245,158,11,0.10)",
                    border: "rgba(245,158,11,0.22)",
                    text: "#D97706",
                }
                : {
                    bg: "rgba(239,68,68,0.10)",
                    border: "rgba(239,68,68,0.22)",
                    text: "#DC2626",
                };

    return (
        <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-black"
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

function ProblemRow({ problem, index, language, navigate, completedProblems }) {
    const isCompleted = completedProblems.flat().includes(problem._id.toString());
    
    return (
        <tr className="border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors group">
            <td className="px-6 py-4 align-middle text-sm font-bold text-zinc-400 select-none">
                {String(index + 1).padStart(2, '0')}
            </td>
            <td className="px-6 py-4 align-middle">
                <div className="flex flex-col">
                    <button
                        onClick={() =>
                            navigate(
                                `/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(
                                    String(problem?._id || "").toLowerCase()
                                )}`
                            )
                        }
                        className="text-left font-bold text-zinc-800 hover:text-indigo-600 transition-colors cursor-pointer group-hover:underline underline-offset-4"
                    >
                        {problem?.question || "Untitled question"}
                    </button>
                    {problem?.description && (
                        <span className="mt-1 text-xs text-zinc-400 line-clamp-1 max-w-2xl select-none">
                            {problem.description}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 align-middle text-center select-none">
                {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CircleCheck className="w-3.5 h-3.5 fill-current text-emerald-600" />
                        Solved
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-zinc-50 text-zinc-400 border border-zinc-200">
                        <Circle className="w-3.5 h-3.5 text-zinc-400" />
                        Unsolved
                    </span>
                )}
            </td>
            <td className="px-6 py-4 align-middle text-right select-none">
                <ProblemDifficulty difficulty={problem?.difficulty} />
            </td>
            <td className="px-6 py-4 align-middle text-right select-none">
                <button
                    onClick={() =>
                        navigate(
                            `/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(
                                String(problem?._id || "").toLowerCase()
                            )}`
                        )
                    }
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-zinc-100 group-hover:bg-indigo-600 text-zinc-500 group-hover:text-white transition-all active:scale-95 shadow-sm border border-zinc-200 group-hover:border-indigo-600 cursor-pointer"
                    title={isCompleted ? "Review Code" : "Solve Challenge"}
                >
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

export default function PracticeDetails() {
    const { language } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [completedProblems, setCompletedProblems] = useState([]);
    
    // Filters & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const updateStatus = async () => {
        try {
            const res = await fetchUserProgress();
            const dataVal = res.data.data;
            setCompletedProblems(dataVal.map(i => i.completedProblems.map(c => c)));
        } catch (err) {
            console.error("Error updating user progress:", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchCodingPractices();
            const list = res.data.data;
            const currentLanguage = String(language || "").toLowerCase();

            const filtered = list.find(
                (item) => String(item?.language || "").toLowerCase() === currentLanguage
            );

            setData(filtered || {});
        } catch (error) {
            console.error("Error fetching coding practices:", error);
            setData({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        updateStatus();
        fetchData();
    }, [language]);

    const problems = useMemo(() => data?.problemList || [], [data]);

    // Correct User Progress calculations
    const completedCount = useMemo(() => {
        if (!problems.length || !completedProblems.length) return 0;
        const flatCompleted = completedProblems.flat().map(id => id.toString());
        return problems.filter(p => flatCompleted.includes(p._id.toString())).length;
    }, [problems, completedProblems]);

    const progressValue = useMemo(() => {
        return problems.length ? Math.round((completedCount / problems.length) * 100) : 0;
    }, [completedCount, problems.length]);

    const stats = useMemo(
        () => [
            { icon: BookOpen, label: "Lessons", value: "22+", colorClass: "bg-indigo-50 text-indigo-655" },
            { icon: Clock3, label: "Duration", value: "10 Hours", colorClass: "bg-cyan-50 text-cyan-600" },
            { icon: ListChecks, label: "Problems", value: `${problems.length || 0}`, colorClass: "bg-amber-50 text-amber-600" },
            { icon: Users, label: "Learners", value: data?.learners || "N/A", colorClass: "bg-emerald-50 text-emerald-655" },
        ],
        [data?.learners, problems.length]
    );

    const startLearning = () => {
        const firstProblem = problems[0];
        if (!firstProblem?._id) return;
        navigate(
            `/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(
                String(firstProblem._id).toLowerCase()
            )}`
        );
    };

    // Filter problems
    const filteredProblems = useMemo(() => {
        const flatCompleted = completedProblems.flat().map(id => id.toString());
        return problems.filter(p => {
            const matchesSearch = p?.question?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = difficultyFilter === "all" || p?.difficulty?.toLowerCase() === difficultyFilter;
            
            const isCompleted = flatCompleted.includes(p?._id?.toString());
            const matchesStatus = statusFilter === "all" || 
                (statusFilter === "solved" && isCompleted) || 
                (statusFilter === "unsolved" && !isCompleted);

            return matchesSearch && matchesDifficulty && matchesStatus;
        });
    }, [problems, completedProblems, searchQuery, difficultyFilter, statusFilter]);

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto space-y-6">
                
                {/* Hero Section Card */}
                <Card
                    className="rounded-2xl overflow-hidden border"
                    style={{
                        background: theme.colors.white,
                        borderColor: theme.colors.lightGray,
                        boxShadow: "0 4px 12px rgba(17,17,19,0.03)",
                    }}
                >
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider bg-indigo-650 text-black border-indigo-600 shadow-sm select-none">
                                        <Sparkles className="w-3.5 h-3.5 mr-0.5 animate-pulse" />
                                        {language || "Language"}
                                    </span>

                                    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3.5 py-1.5 text-xs font-bold bg-zinc-50 text-zinc-950 select-none">
                                        <Code2 className="w-3.5 h-3.5 text-black" />
                                        Practice Track
                                    </span>
                                </div>

                                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950">
                                    Practice {String(language || "N/A").toUpperCase()}
                                </h1>

                                <p className="mt-3.5 max-w-3xl text-sm sm:text-base text-black leading-relaxed">
                                    {data?.description ||
                                        "Sharpen your fundamentals, solve real problems, and build confidence with structured practice."}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    <InfoChip icon={BookOpen} label="Lessons" />
                                    <InfoChip icon={Clock3} label="10 Hours" />
                                    <InfoChip icon={ListChecks} label={`${problems.length || 0} Problems`} />
                                    <InfoChip icon={Users} label={data?.learners || "Learners"} />
                                    <InfoChip icon={Circle} label={`${data?.level || "All"} Level`} />
                                </div>

                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {stats.map((stat) => (
                                        <StatPill
                                            key={stat.label}
                                            icon={stat.icon}
                                            label={stat.label}
                                            value={stat.value}
                                            colorClass={stat.colorClass}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Progress panel */}
                            <div className="w-full lg:w-[330px] shrink-0 select-none">
                                <div
                                    className="rounded-2xl border p-5 bg-zinc-50/50 shadow-sm"
                                    style={{
                                        borderColor: theme.colors.lightGray,
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                                            <span className="text-sm font-bold text-zinc-800">4.8</span>
                                            <span className="text-xs text-zinc-400">(25.9k+ reviews)</span>
                                        </div>
                                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-indigo-55 text-indigo-700 border border-indigo-200">
                                            Trending
                                        </span>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wide">
                                            <span>Your Progress</span>
                                            <span className="text-indigo-650 font-black">{progressValue}%</span>
                                        </div>

                                        <div className="mt-3">
                                            <Progress
                                                value={progressValue}
                                                style={{
                                                    height: 8,
                                                    borderRadius: 999,
                                                    backgroundColor: "rgba(17,17,19,0.08)",
                                                }}
                                            />
                                        </div>
                                        <div className="text-[11px] text-zinc-400 mt-2 font-medium">
                                            Completed {completedCount} of {problems.length} challenges
                                        </div>
                                    </div>

                                    <button
                                        onClick={startLearning}
                                        disabled={!problems.length}
                                        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-black bg-indigo-700 hover:text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-indigo-100 cursor-pointer"
                                    >
                                        Start Learning
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Problems Panel Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Card
                        className="rounded-2xl border overflow-hidden"
                        style={{
                            background: theme.colors.white,
                            borderColor: theme.colors.lightGray,
                            boxShadow: "0 4px 12px rgba(17,17,19,0.03)",
                        }}
                    >
                        <CardHeader className="pb-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                                    <ListChecks className="w-5 h-5 text-indigo-950" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-zinc-950">
                                        Practice Problems
                                    </CardTitle>
                                    <div className="text-xs font-semibold text-zinc-400 mt-0.5">
                                        Select a challenge below to open the interactive coding workspace.
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200">
                                Total: {filteredProblems.length} Problem{filteredProblems.length === 1 ? "" : "s"}
                            </div>
                        </CardHeader>

                        {/* Search & Filters Component */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-50/50 border-b border-zinc-100 select-none">
                            <div className="relative flex-1 max-w-sm">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search challenges by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border text-black border-zinc-200 rounded-xl bg-white text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">Difficulty:</span>
                                    <select
                                        value={difficultyFilter}
                                        onChange={(e) => setDifficultyFilter(e.target.value)}
                                        className="text-xs font-bold text-zinc-700 bg-white border border-zinc-200 rounded-xl px-2 py-1 shadow-sm outline-none cursor-pointer focus:border-indigo-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">Status:</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="text-xs font-bold text-zinc-700 bg-white border border-zinc-200 rounded-xl px-2 py-1 shadow-sm outline-none cursor-pointer focus:border-indigo-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="solved">Solved</option>
                                        <option value="unsolved">Unsolved</option>
                                    </select>
                                </div>

                                {(searchQuery || difficultyFilter !== "all" || statusFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setDifficultyFilter("all");
                                            setStatusFilter("all");
                                        }}
                                        className="text-xs text-black font-bold text-indigo-650 hover:text-indigo-855 flex items-center gap-1 bg-white border border-indigo-200 rounded-xl px-2.5 py-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
                                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="font-semibold text-sm">Loading practice problems...</span>
                                </div>
                            ) : filteredProblems.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[720px] border-separate border-spacing-0">
                                        <thead>
                                            <tr className="bg-zinc-50/50 border-b border-zinc-100 select-none text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                                                <th className="px-6 py-3.5 text-left border-b border-zinc-100">
                                                    No.
                                                </th>
                                                <th className="px-6 py-3.5 text-left border-b border-zinc-100">
                                                    Challenge Question
                                                </th>
                                                <th className="px-6 py-3.5 text-center border-b border-zinc-100">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3.5 text-right border-b border-zinc-100">
                                                    Difficulty
                                                </th>
                                                <th className="px-6 py-3.5 text-right border-b border-zinc-100">
                                                    Workspace
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredProblems.map((problem, index) => (
                                                <ProblemRow
                                                    key={problem?._id || index}
                                                    problem={problem}
                                                    index={index}
                                                    language={language}
                                                    navigate={navigate}
                                                    completedProblems={completedProblems}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-16 text-center select-none">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                                        <AlertCircle className="w-6 h-6 text-indigo-650" />
                                    </div>
                                    <div className="text-base font-bold text-zinc-950">
                                        No challenges found
                                    </div>
                                    <div className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
                                        Try adjusting your search query, difficulty filters, or solve states.
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
