import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCodingPractices, fetchUserProgress } from "@/Api/api";
import { useData } from "@/context/DataContext";
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
    RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/layout/layout";

function StatPill({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3.5 rounded-2xl border border-border p-4 bg-background/80 hover:border-primary/30 transition-colors">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Icon size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <div className="text-xs font-semibold text-muted-foreground">{label}</div>
                <div className="text-base font-extrabold text-foreground truncate tabular-nums mt-0.5">
                    {value}
                </div>
            </div>
        </div>
    );
}

function InfoChip({ icon: Icon, label }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground">
            <Icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>{label}</span>
        </div>
    );
}

function ProblemDifficulty({ difficulty }) {
    const cls =
        difficulty === "Easy"
            ? "bg-emerald-500/12 border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
            : difficulty === "Medium"
            ? "bg-amber-500/12 border-amber-500/25 text-amber-700 dark:text-amber-300"
            : "bg-rose-500/12 border-rose-500/25 text-rose-700 dark:text-rose-300";

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cls}`}>
            {difficulty || "Unknown"}
        </span>
    );
}

function ProblemRow({ problem, index, language, navigate, completedProblems }) {
    const isCompleted = completedProblems.flat().includes(problem._id.toString());
    const targetUrl = `/dashboard/code-editor/${encodeURIComponent(String(language).toLowerCase())}/${encodeURIComponent(
        String(problem?._id || "").toLowerCase()
    )}`;

    return (
        <tr className="border-b border-border hover:bg-secondary/50 transition-colors group">
            <td className="px-6 py-4 align-middle text-xs font-mono font-bold text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
            </td>
            <td className="px-6 py-4 align-middle">
                <div className="flex flex-col">
                    <button
                        type="button"
                        onClick={() => navigate(targetUrl)}
                        className="text-left font-bold text-sm text-foreground hover:text-primary transition-colors group-hover:underline underline-offset-4"
                    >
                        {problem?.question || "Untitled question"}
                    </button>
                    {problem?.description && (
                        <span className="mt-1 text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                            {problem.description}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 align-middle text-center">
                {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        <CircleCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        Solved
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-secondary text-muted-foreground border border-border">
                        <Circle className="w-3.5 h-3.5" aria-hidden="true" />
                        Unsolved
                    </span>
                )}
            </td>
            <td className="px-6 py-4 align-middle text-right">
                <ProblemDifficulty difficulty={problem?.difficulty} />
            </td>
            <td className="px-6 py-4 align-middle text-right">
                <button
                    type="button"
                    onClick={() => navigate(targetUrl)}
                    className="inline-flex items-center justify-center min-h-[38px] min-w-[38px] p-2 rounded-xl bg-secondary group-hover:bg-primary text-muted-foreground group-hover:text-primary-foreground transition-all active:scale-95 border border-border group-hover:border-primary"
                    aria-label={isCompleted ? "Review Code" : "Solve Challenge"}
                    title={isCompleted ? "Review Code" : "Solve Challenge"}
                >
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
            </td>
        </tr>
    );
}

export default function PracticeDetails() {
    const { language } = useParams();
    const navigate = useNavigate();
    const { codingPractices } = useData();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [completedProblems, setCompletedProblems] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const updateStatus = async () => {
        try {
            const res = await fetchUserProgress();
            const dataVal = res.data.data;
            setCompletedProblems(dataVal.map((i) => i.completedProblems.map((c) => c)));
        } catch (err) {
            console.error("Error updating user progress:", err);
        }
    };

    const applyTrackData = (list) => {
        if (!Array.isArray(list)) return;
        const currentLanguage = String(language || "").toLowerCase();
        const filtered = list.find(
            (item) =>
                String(item?.language || "").toLowerCase() === currentLanguage ||
                String(item?.language || item?.title || "")
                    .toLowerCase()
                    .replace(/^practice\s*/i, "") === currentLanguage
        );
        if (filtered) {
            setData(filtered);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchCodingPractices();
            const list = res?.data?.data || [];
            applyTrackData(list);
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

    useEffect(() => {
        if (codingPractices && codingPractices.length > 0) {
            applyTrackData(codingPractices);
            setLoading(false);
        }
    }, [codingPractices, language]);

    useEffect(() => {
        const handleSync = () => fetchData();
        window.addEventListener("coding-practice-sync", handleSync);
        return () => window.removeEventListener("coding-practice-sync", handleSync);
    }, [language]);

    const problems = useMemo(() => data?.problemList || [], [data]);

    const completedCount = useMemo(() => {
        if (!problems.length || !completedProblems.length) return 0;
        const flatCompleted = completedProblems.flat().map((id) => id.toString());
        return problems.filter((p) => flatCompleted.includes(p._id.toString())).length;
    }, [problems, completedProblems]);

    const progressValue = useMemo(() => {
        return problems.length ? Math.round((completedCount / problems.length) * 100) : 0;
    }, [completedCount, problems.length]);

    const stats = useMemo(
        () => [
            { icon: BookOpen, label: "Lessons", value: "22+" },
            { icon: Clock3, label: "Duration", value: "10 Hours" },
            { icon: ListChecks, label: "Problems", value: `${problems.length || 0}` },
            { icon: Users, label: "Learners", value: data?.learners || "Active" },
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

    const filteredProblems = useMemo(() => {
        const flatCompleted = completedProblems.flat().map((id) => id.toString());
        return problems.filter((p) => {
            const matchesSearch = p?.question?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty =
                difficultyFilter === "all" || p?.difficulty?.toLowerCase() === difficultyFilter;

            const isCompleted = flatCompleted.includes(p?._id?.toString());
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "solved" && isCompleted) ||
                (statusFilter === "unsolved" && !isCompleted);

            return matchesSearch && matchesDifficulty && matchesStatus;
        });
    }, [problems, completedProblems, searchQuery, difficultyFilter, statusFilter]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Track Hero Card */}
                <Card className="surface-card rounded-3xl py-0 overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                                        {language || "Language"}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1 text-xs font-semibold bg-background text-foreground">
                                        <Code2 className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                        Practice Track
                                    </span>
                                </div>

                                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                    Practice {String(language || "N/A").toUpperCase()}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {data?.description ||
                                        "Sharpen your fundamentals, solve real problems, and build confidence with structured practice."}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <InfoChip icon={BookOpen} label="Lessons" />
                                    <InfoChip icon={Clock3} label="10 Hours" />
                                    <InfoChip icon={ListChecks} label={`${problems.length || 0} Problems`} />
                                    <InfoChip icon={Users} label={data?.learners || "Learners"} />
                                    <InfoChip icon={Circle} label={`${data?.level || "All"} Level`} />
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

                            {/* Progress Card */}
                            <div className="w-full lg:w-[320px] shrink-0">
                                <div className="rounded-2xl border border-border p-5 bg-background/80 space-y-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                                            <span className="text-sm font-bold text-foreground tabular-nums">4.8</span>
                                            <span className="text-xs text-muted-foreground">(Student rated)</span>
                                        </div>
                                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                                            Active
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            <span>Your Progress</span>
                                            <span className="text-primary font-extrabold tabular-nums">{progressValue}%</span>
                                        </div>
                                        <div className="mt-2.5">
                                            <Progress value={progressValue} className="h-2.5" />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2 tabular-nums">
                                            Completed {completedCount} of {problems.length} challenges
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={startLearning}
                                        disabled={!problems.length}
                                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-5 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm shadow-indigo-500/20"
                                    >
                                        <span>Start Learning</span>
                                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Problems Table Card */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <Card className="surface-card rounded-3xl py-0 overflow-hidden">
                        <CardHeader className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                    <ListChecks className="w-5 h-5 text-primary" aria-hidden="true" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold text-foreground">Practice Problems</CardTitle>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        Select any problem to open the interactive Monaco workspace.
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-xl border border-border tabular-nums self-start sm:self-center">
                                Total: {filteredProblems.length} Problem{filteredProblems.length === 1 ? "" : "s"}
                            </div>
                        </CardHeader>

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/40 border-b border-border">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                                <input
                                    type="text"
                                    placeholder="Search challenges by title..."
                                    aria-label="Search challenges"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full min-h-[40px] pl-9 pr-4 border border-input rounded-xl bg-card text-foreground placeholder:text-muted-foreground text-xs outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <label className="flex items-center gap-1.5 text-xs">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Difficulty:</span>
                                    <select
                                        value={difficultyFilter}
                                        onChange={(e) => setDifficultyFilter(e.target.value)}
                                        className="min-h-[38px] text-xs font-semibold text-foreground bg-card border border-input rounded-xl px-2.5 outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="all">All</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </label>

                                <label className="flex items-center gap-1.5 text-xs">
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Status:</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="min-h-[38px] text-xs font-semibold text-foreground bg-card border border-input rounded-xl px-2.5 outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="all">All</option>
                                        <option value="solved">Solved</option>
                                        <option value="unsolved">Unsolved</option>
                                    </select>
                                </label>

                                {(searchQuery || difficultyFilter !== "all" || statusFilter !== "all") && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setDifficultyFilter("all");
                                            setStatusFilter("all");
                                        }}
                                        className="min-h-[38px] text-xs font-bold text-primary hover:bg-secondary flex items-center gap-1 bg-card border border-border rounded-xl px-3 transition-colors"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="font-semibold text-sm">Loading practice problems...</span>
                                </div>
                            ) : filteredProblems.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px] border-separate border-spacing-0">
                                        <thead>
                                            <tr className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                                                <th className="px-6 py-3.5 text-left border-b border-border">No.</th>
                                                <th className="px-6 py-3.5 text-left border-b border-border">Challenge</th>
                                                <th className="px-6 py-3.5 text-center border-b border-border">Status</th>
                                                <th className="px-6 py-3.5 text-right border-b border-border">Difficulty</th>
                                                <th className="px-6 py-3.5 text-right border-b border-border">Workspace</th>
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
                                <div className="py-16 text-center px-4">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                        <AlertCircle className="w-6 h-6 text-primary" aria-hidden="true" />
                                    </div>
                                    <div className="text-base font-bold text-foreground">No challenges found</div>
                                    <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                                        Try clearing your search or switching difficulty and status filters.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
