import React, { useState } from "react";
import { submitFeedback } from "@/Api/api";
import { DashboardLayout } from "@/components/layout/layout";
import { SEO } from "@/components/common/SEO";
import {
    Send, MessageSquare, AlertCircle, Sparkles, HelpCircle,
    Bug,
    Lightbulb,
    ShieldAlert,
    Star,
    Loader2
} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { theme } from "@/lib/theme";

export const Feedback = ({ user, requireAuth }) => {
    useTitle("Feedback Center");
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        category: 'General'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const categories = [
        { name: 'General', icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
        { name: 'Bug Report', icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
        { name: 'Feature Request', icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" },
        { name: 'Content Issue', icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        requireAuth(async () => {
            setLoading(true);
            setStatus({ type: '', message: '' });

            try {
                await submitFeedback(formData);
                setStatus({ type: 'success', message: 'Feedback submitted successfully! Thank you for helping us improve.' });
                setFormData({ title: '', message: '', category: 'General' });
            } catch (err) {
                setStatus({ type: 'error', message: err.response?.data?.msg || 'Failed to submit feedback. Please try again.' });
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <DashboardLayout>
            <SEO
                title="Feedback Center — Help Us Improve | Student Hub"
                description="Share your feedback, ideas, or report technical bugs. We continuously improve Student Hub based on student reviews."
                url="/dashboard/feedback"
            />
            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Voices</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Feedback Center
                            </h1>
                            <p className="text-slate-500 text-sm mt-2 max-w-2xl">
                                Have an idea to make Student Hub better? Found a bug? Or have questions about our content? Let us know below—we review every submission.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Feedback</p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">124</p>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Suggestions</p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">56</p>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <Bug className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bug Reports</p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">18</p>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Rating</p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">4.8</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Feedback Form */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-slate-800 text-base">
                                    Share Your Feedback
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Tell us what you love or what needs improvement.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Brief summary of your feedback..."
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Category</label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 pl-4 pr-10 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.name} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px] font-extrabold">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Details</label>
                                <textarea
                                    rows={6}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Please describe your suggestion, question, or bug report in detail..."
                                    className="w-full rounded-xl p-4 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 text-sm leading-relaxed transition-all resize-none"
                                />
                            </div>

                            {status.message && (
                                <div
                                    className={`rounded-xl p-3 flex items-center gap-2.5 text-xs font-bold border ${
                                        status.type === "success"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}
                                >
                                    {status.type === "success" ? (
                                        <Sparkles size={14} className="shrink-0" />
                                    ) : (
                                        <AlertCircle size={14} className="shrink-0" />
                                    )}
                                    <span>{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <Send size={15} />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Category Guide & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Interactive Categories Guide */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                            <h3 className="font-extrabold text-sm text-slate-800 pb-3 border-b border-slate-100">
                                Categories
                            </h3>
                            <div className="space-y-2.5">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.name })}
                                        className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer text-left ${
                                            formData.category === cat.name
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-xs"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center shrink-0`}>
                                            <cat.icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold capitalize truncate">
                                                {cat.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                {formData.category === cat.name ? "Selected Category" : "Click to select"}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Callout Box */}
                        <div className="bg-indigo-50/50 border border-indigo-200/50 rounded-2xl p-5 shadow-xs space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <ShieldAlert size={16} />
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-xs">
                                Your voice matters
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Student Hub is built for Mumbai IT students, by students. Every bug report, layout suggestion, and note request is reviewed continuously by our dev team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
