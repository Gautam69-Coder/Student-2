import React, { useState } from 'react';
import { submitFeedback } from '@/Api/api';
import { Send, MessageSquare, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

export const Feedback = () => {
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
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-900 rounded-xl">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Share Your Feedback</h2>
                            <p className="text-slate-500 text-sm mt-1">Help us improve your experience with the student portal.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Suggestion for new feature"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all bg-slate-50/50 appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Your Message</label>
                            <textarea
                                required
                                rows="5"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us more about your feedback..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all bg-slate-50/50 resize-none"
                            ></textarea>
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                {status.type === 'success' ? <Sparkles className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="text-sm font-medium">{status.message}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold transition-all active:scale-[0.98] ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                                }`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Quick Select Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat.name })}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.category === cat.name
                                        ? 'bg-white border-slate-900 shadow-sm scale-105'
                                        : 'bg-transparent border-slate-200 hover:border-slate-400 text-slate-500'
                                    }`}
                            >
                                <cat.icon className={`w-5 h-5 ${formData.category === cat.name ? 'text-slate-900' : 'text-slate-400'}`} />
                                <span className="text-xs font-bold">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
