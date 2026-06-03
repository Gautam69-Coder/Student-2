import React, { useState } from "react";
import { submitFeedback } from "@/Api/api";
import { DashboardLayout } from "@/components/dashboard";
import {
    Send, MessageSquare, AlertCircle, Sparkles, HelpCircle,
    Bug,
    Lightbulb,
    ShieldAlert,
    Star

} from "lucide-react";
import { useTitle } from "@/hooks/useTitle";
import { theme } from "@/lib/theme";


export const Feedback = ({ user, requireAuth }) => {


    useTitle("Feedback");
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        category: 'General'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const categories = [
        { name: 'General', icon: MessageSquare },
        { name: 'Bug Report', icon: AlertCircle },
        { name: 'Feature Request', icon: Sparkles },
        { name: 'Content Issue', icon: HelpCircle }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await submitFeedback(formData);
            setStatus({ type: 'success', message: 'Feedback submitted successfully! Thank you for your input.' });
            setFormData({ title: '', message: '', category: 'General' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.msg || 'Failed to submit feedback. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className=" rounded-3xl border border-slate-200  p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-black">
                                Feedback Center
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7" style={{ color: theme.colors.darkGray }}>
                                Browse your code notes, files, and attachments in a clean dashboard layout.
                            </p>
                        </div>

                        <div className="bg-lime-100 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400 px-4 py-2 rounded-full font-semibold">
                            +24 feedbacks this month
                        </div>
                    </div>


                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 text-black shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5" />
                        </div>

                        <h3 className="mt-5 text-slate-500">
                            Total Feedback
                        </h3>

                        <p className="text-4xl font-bold mt-2">124</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 text-black shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5" />
                        </div>

                        <h3 className="mt-5 text-slate-500">
                            Suggestions
                        </h3>

                        <p className="text-4xl font-bold mt-2">56</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 text-black shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <Bug className="w-5 h-5" />
                        </div>

                        <h3 className="mt-5 text-slate-500">
                            Bug Reports
                        </h3>

                        <p className="text-4xl font-bold mt-2">18</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 text-black shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <Star className="w-5 h-5" />
                        </div>

                        <h3 className="mt-5 text-slate-500">
                            Avg Rating
                        </h3>

                        <p className="text-4xl font-bold mt-2">4.8</p>
                    </div>

                </div>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-3 gap-6 ">

                    {/* Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 text-black p-6 shadow-sm">

                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6" />
                            </div>

                            <div>
                                <h2 className="font-bold text-2xl">
                                    Share Your Feedback
                                </h2>

                                <p className="text-slate-500">
                                    Tell us what can be improved.
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Feedback title..."
                                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-400  outline-none focus:border-lime-500"
                            />

                            <div className="border rounded-2xl border-slate-400 px-4 ">


                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full h-14  bg-slate-50 rounded-2xl   outline-none focus:none"
                                >
                                    {categories.map((cat) => (
                                        <option
                                            key={cat.name}
                                            value={cat.name}
                                        >
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <textarea
                                rows={8}
                                required
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        message: e.target.value,
                                    })
                                }
                                placeholder="Describe your feedback..."
                                className="w-full rounded-2xl p-5 bg-slate-50 border border-slate-400  outline-none focus:border-lime-500 resize-none"
                            />

                            {status.message && (
                                <div
                                    className={`rounded-2xl p-4 flex items-center gap-3 ${status.type === "success"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                        }`}
                                >
                                    {status.type === "success" ? (
                                        <Sparkles size={18} />
                                    ) : (
                                        <AlertCircle size={18} />
                                    )}

                                    {status.message}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-lime-400 hover:bg-lime-500 transition-all text-black font-bold flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-3xl border border-slate-200 text-black p-6 shadow-sm">

                        <h3 className="font-bold text-xl mb-6">
                            Categories
                        </h3>

                        <div className="space-y-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            category: cat.name,
                                        })
                                    }
                                    className={`w-full p-4 rounded-2xl border border-slate-200 transition-all flex items-center  gap-4 
                                        ${formData.category === cat.name
                                            ? `bg-[#ccff00]`
                                            : "border-slate-400 "
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <cat.icon size={20} />
                                    </div>

                                    <div className="text-left">
                                        <p className="font-semibold">
                                            {cat.name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Select category
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-5 rounded-2xl bg-lime-50 dark:bg-lime-500/10 border border-lime-200 dark:border-lime-500/20">
                            <ShieldAlert
                                className="mb-3"
                                size={22}
                            />

                            <h4 className="font-bold">
                                Your voice matters
                            </h4>

                            <p className="text-sm text-slate-500 mt-2">
                                Every feedback is reviewed by our
                                development team.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>

    );
};


