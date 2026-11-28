import React, { useState, useEffect } from "react";
import { fetchAllFeedback, updateFeedbackStatus } from "@/Api/api";
import {
    MessageSquare,
    CheckCircle,
    Clock,
    AlertCircle,
    Filter,
    Search,
    User,
    Calendar,
    Tag,
    ArrowUpRight,
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

export const ManageFeedback = () => {
    useTitle("Manage Feedback");
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const loadFeedback = async () => {
        try {
            const res = await fetchAllFeedback();
            setFeedbacks(res.data.data || []);
        } catch (err) {
            console.error("Failed to load feedback", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeedback();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateFeedbackStatus(id, newStatus);
            setFeedbacks(feedbacks.map((f) => (f._id === id ? { ...f, status: newStatus } : f)));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const filteredFeedbacks = feedbacks.filter((f) => {
        const matchesFilter = filter === "All" || f.status === filter;
        const matchesSearch =
            f.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "Resolved":
                return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";
            case "Reviewed":
                return "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25";
            default:
                return "bg-secondary text-muted-foreground border-border";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Resolved":
                return <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />;
            case "Reviewed":
                return <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />;
            default:
                return <Clock className="w-3.5 h-3.5" aria-hidden="true" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        User Feedback
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                        Review and resolve feedback submitted by students
                    </p>
                </div>

                <div className="surface-card px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-auto">
                    <MessageSquare className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-xs font-bold text-foreground tabular-nums">
                        {feedbacks.length} Total
                    </span>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="surface-card rounded-2xl p-4 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        placeholder="Search feedback content or user..."
                        aria-label="Search feedback"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 min-h-[42px] rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <select
                        aria-label="Filter by status"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="min-h-[42px] rounded-xl bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring px-4 text-xs font-bold text-foreground"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="w-9 h-9 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        Loading feedback...
                    </p>
                </div>
            ) : filteredFeedbacks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {filteredFeedbacks.map((f) => (
                        <div key={f._id} className="surface-card rounded-2xl overflow-hidden flex flex-col">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <span
                                        className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${getStatusStyle(
                                            f.status
                                        )}`}
                                    >
                                        {getStatusIcon(f.status)}
                                        {f.status || "Pending"}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium tabular-nums">
                                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                                        {new Date(f.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-foreground mb-1.5">{f.title}</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                                        {f.message}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center">
                                            <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-foreground">
                                                {f.userId?.username || "Unknown User"}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">{f.userId?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                        <span className="text-[11px] font-bold text-primary uppercase">
                                            {f.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2 bg-secondary/30">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Status:
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {["Pending", "Reviewed", "Resolved"].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleStatusUpdate(f._id, s)}
                                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border ${
                                                f.status === s
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="surface-card rounded-2xl border-dashed p-12 text-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-secondary border border-border">
                        <AlertCircle className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No feedback found</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1.5 leading-relaxed">
                        {searchQuery
                            ? `We couldn't find any results for "${searchQuery}".`
                            : "There's no feedback to review at the moment."}
                    </p>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="mt-4 inline-flex px-4 min-h-[38px] items-center rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-secondary"
                        >
                            Clear search filter
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
