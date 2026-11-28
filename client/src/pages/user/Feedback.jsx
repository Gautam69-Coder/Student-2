import React, { useState, useEffect, useMemo } from "react";
import { submitFeedback, fetchMyFeedback } from "@/Api/api";
import { DashboardLayout } from "@/components/layout/layout";
import { SEO } from "@/components/common/SEO";
import {
    Send,
    MessageSquare,
    AlertCircle,
    Sparkles,
    HelpCircle,
    ShieldAlert,
    Clock,
    CheckCircle2,
    Eye,
    Loader2,
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";

export const Feedback = () => {
    useTitle("Feedback Center");
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        category: "General",
    });
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [status, setStatus] = useState({ type: "", message: "" });

    const categories = [
        { name: "General", icon: MessageSquare, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" },
        { name: "Bug Report", icon: AlertCircle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
        { name: "Feature Request", icon: Sparkles, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
        { name: "Content Issue", icon: HelpCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    ];

    useEffect(() => {
        let active = true;
        fetchMyFeedback()
            .then((res) => {
                if (active) {
                    setSubmissions(Array.isArray(res.data?.data) ? res.data.data : []);
                }
            })
            .catch((err) => console.error("Failed to load user feedback:", err))
            .finally(() => {
                if (active) setHistoryLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const stats = useMemo(
        () => ({
            total: submissions.length,
            pending: submissions.filter((f) => f.status === "Pending" || !f.status).length,
            reviewed: submissions.filter((f) => f.status === "Reviewed").length,
            resolved: submissions.filter((f) => f.status === "Resolved").length,
        }),
        [submissions]
    );

    const getStatusBadge = (itemStatus) => {
        switch (itemStatus) {
            case "Resolved":
                return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";
            case "Reviewed":
                return "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25";
            default:
                return "bg-secondary text-muted-foreground border-border";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const res = await submitFeedback(formData);
            if (res.data?.data) {
                setSubmissions((prev) => [res.data.data, ...prev]);
            }
            setStatus({
                type: "success",
                message: "Feedback submitted successfully! Thank you for helping us improve.",
            });
            setFormData({ title: "", message: "", category: "General" });
        } catch (err) {
            setStatus({
                type: "error",
                message:
                    err.response?.data?.message ||
                    err.response?.data?.msg ||
                    "Failed to submit feedback. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <SEO
                title="Feedback Center — Help Us Improve | Student Hub"
                description="Share your feedback, ideas, or report technical bugs."
                url="/dashboard/feedback"
            />
            <div className="space-y-6">
                {/* Header */}
                <div className="surface-card rounded-3xl p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Student Voices
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        Feedback Center
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2 max-w-2xl leading-relaxed">
                        Have an idea to make Student Hub better or noticed a bug? Submit your thoughts below—we track and review every request.
                    </p>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Your Submissions", value: stats.total, icon: MessageSquare, cls: "bg-indigo-500/10 text-primary" },
                        { label: "Pending", value: stats.pending, icon: Clock, cls: "bg-secondary text-muted-foreground" },
                        { label: "Reviewed", value: stats.reviewed, icon: Eye, cls: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
                        { label: "Resolved", value: stats.resolved, icon: CheckCircle2, cls: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" },
                    ].map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="surface-card rounded-2xl p-5 flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.cls}`}>
                                    <Icon className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        {s.label}
                                    </p>
                                    <p className="text-2xl font-extrabold text-foreground mt-0.5 tabular-nums">
                                        {s.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Form + Category Guide */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 surface-card rounded-3xl p-5 sm:p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-primary flex items-center justify-center shrink-0">
                                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <div>
                                <h2 className="font-bold text-foreground text-base">Share Your Feedback</h2>
                                <p className="text-xs text-muted-foreground">
                                    Tell us what you love or what needs improvement.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="fb-title" className="text-xs font-bold text-foreground">
                                    Title
                                </label>
                                <input
                                    id="fb-title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Brief summary of your feedback..."
                                    className="w-full min-h-[44px] px-4 rounded-xl bg-background border border-input focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="fb-category" className="text-xs font-bold text-foreground">
                                    Category
                                </label>
                                <select
                                    id="fb-category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full min-h-[44px] px-4 bg-background border border-input rounded-xl outline-none focus:ring-2 focus:ring-ring text-sm font-semibold text-foreground"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="fb-details" className="text-xs font-bold text-foreground">
                                    Details
                                </label>
                                <textarea
                                    id="fb-details"
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Describe your suggestion, question, or bug report in detail..."
                                    className="w-full rounded-xl p-4 bg-background border border-input focus:ring-2 focus:ring-ring outline-none text-foreground placeholder:text-muted-foreground text-sm leading-relaxed resize-none"
                                />
                            </div>

                            {status.message && (
                                <div
                                    role="status"
                                    className={`rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold border ${
                                        status.type === "success"
                                            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                                            : "bg-destructive/10 text-destructive border-destructive/25"
                                    }`}
                                >
                                    {status.type === "success" ? (
                                        <Sparkles size={14} className="shrink-0" aria-hidden="true" />
                                    ) : (
                                        <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
                                    )}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-indigo-500/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                ) : (
                                    <>
                                        <Send size={15} aria-hidden="true" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="surface-card rounded-2xl p-5 space-y-4">
                            <h3 className="font-bold text-sm text-foreground pb-3 border-b border-border">
                                Categories
                            </h3>
                            <div className="space-y-2.5">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.name })}
                                        className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left ${
                                            formData.category === cat.name
                                                ? "bg-indigo-500/10 border-primary/40 text-foreground"
                                                : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center shrink-0`}>
                                            <cat.icon size={16} aria-hidden="true" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{cat.name}</p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {formData.category === cat.name ? "Selected" : "Click to select"}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="surface-card rounded-2xl p-5 space-y-3 bg-indigo-500/[0.06] border-indigo-500/20">
                            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-primary flex items-center justify-center shrink-0">
                                <ShieldAlert size={16} aria-hidden="true" />
                            </div>
                            <h4 className="font-bold text-foreground text-xs">Your voice matters</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Student Hub evolves directly from student feedback. Bug reports, feature ideas, and note requests are reviewed continuously.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submission History */}
                <div className="surface-card rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                        <div>
                            <h2 className="font-bold text-foreground text-base">My Submissions</h2>
                            <p className="text-xs text-muted-foreground">
                                Track the review status of feedback you have sent.
                            </p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border tabular-nums">
                            {submissions.length} Total
                        </span>
                    </div>

                    {historyLoading ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground gap-2 text-xs font-semibold">
                            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                            Loading your submissions...
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground">
                            You have not submitted any feedback yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {submissions.map((item) => (
                                <div
                                    key={item._id}
                                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-foreground">{item.title}</span>
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                                {item.category || "General"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {item.message}
                                        </p>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(item.status)}`}>
                                            {item.status || "Pending"}
                                        </span>
                                        {item.createdAt && (
                                            <span className="text-[11px] text-muted-foreground tabular-nums">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
