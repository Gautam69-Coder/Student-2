import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/layout";
import { useCodingPractices } from "@/hooks/useCodingPractices";
import { Code2, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const BRAND_COLORS = {
    javascript: "#F7DF1E",
    js: "#F7DF1E",
    python: "#3776AB",
    py: "#3776AB",
    cpp: "#00599C",
    "c++": "#00599C",
    c: "#64748B",
    java: "#E76F00",
    html: "#E34F26",
    css: "#1572B6",
    typescript: "#3178C6",
    ts: "#3178C6",
    react: "#61DAFB",
    node: "#5FA04E",
    dsa: "#6366F1",
    sql: "#CC292B",
    go: "#00ADD8",
    rust: "#DEA584",
    php: "#777BB4",
    ruby: "#CC342D",
};

const CodingPractice = () => {
    const navigate = useNavigate();
    const { codingPractices: cards, isLoading: loading, error } = useCodingPractices();

    function getBrandColor(language = "") {
        const key = String(language).toLowerCase().trim();
        return BRAND_COLORS[key] || "#4F46E5";
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="surface-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                            <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Monaco Coding Studio</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            Coding Practice Tracks
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            Sharpen problem-solving daily—open any language track below to solve curated challenges inside your browser IDE.
                        </p>
                    </div>
                </div>

                {/* Practice Tracks */}
                <div>
                    <h2 className="text-base font-bold text-foreground mb-4">Choose a practice track</h2>

                    {loading ? (
                        <div className="surface-card rounded-2xl py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" aria-hidden="true" />
                            <p className="text-sm font-medium">Loading coding tracks...</p>
                        </div>
                    ) : error ? (
                        <div className="surface-card rounded-2xl py-16 flex flex-col items-center justify-center gap-2 text-destructive">
                            <AlertCircle className="w-6 h-6" aria-hidden="true" />
                            <p className="text-sm font-semibold">Failed to load tracks</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {cards.map((item, index) => {
                                const color = getBrandColor(item.language);
                                const targetLang = encodeURIComponent(
                                    String(item.language || item.title || "html")
                                        .replace(/^practice\s*/i, "")
                                        .toLowerCase()
                                );

                                return (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        key={item._id || item.language || index}
                                        onClick={() => navigate(`/dashboard/coding-practice/${targetLang}`)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                navigate(`/dashboard/coding-practice/${targetLang}`);
                                            }
                                        }}
                                        className="group relative overflow-hidden rounded-2xl surface-card hover:-translate-y-1 cursor-pointer flex flex-col"
                                    >
                                        <div
                                            className="h-24 relative"
                                            style={{
                                                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-black/10" />
                                        </div>

                                        <div className="absolute top-14 left-4">
                                            <div
                                                className="w-14 h-14 rounded-2xl shadow-md flex items-center justify-center border-2 bg-card"
                                                style={{ borderColor: color }}
                                            >
                                                <img
                                                    src={
                                                        String(item.language || "").toLowerCase() === "cpp"
                                                            ? "https://cdn.simpleicons.org/cplusplus"
                                                            : String(item.language || "").toLowerCase() === "dsa"
                                                            ? "https://cdn.simpleicons.org/leetcode"
                                                            : `https://cdn.simpleicons.org/${String(item.language || "").toLowerCase()}`
                                                    }
                                                    alt={item.language}
                                                    className="w-7 h-7"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="px-4 pt-9 pb-4 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <h3 className="font-bold text-base text-foreground truncate">
                                                    {item.title}
                                                </h3>
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border uppercase shrink-0">
                                                    {item.language}
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                                {item.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                                                <div className="p-2.5 rounded-xl bg-background border border-border">
                                                    <p className="text-[11px] font-semibold text-muted-foreground">
                                                        Problems
                                                    </p>
                                                    <p className="text-base font-extrabold text-foreground tabular-nums mt-0.5">
                                                        {item.problemList?.length || 0}
                                                    </p>
                                                </div>

                                                <div className="p-2.5 rounded-xl bg-background border border-border">
                                                    <p className="text-[11px] font-semibold text-muted-foreground">
                                                        Level
                                                    </p>
                                                    <p className="text-base font-extrabold text-foreground mt-0.5 truncate">
                                                        {item.level}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="w-full min-h-[40px] rounded-xl text-xs font-bold text-primary-foreground bg-primary group-hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5">
                                                <span>Start Practice</span>
                                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export { CodingPractice };
