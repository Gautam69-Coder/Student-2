import React, { useState, useEffect } from 'react';
import { fetchAllFeedback, updateFeedbackStatus } from '@/Api/api';
import {
    MessageSquare, CheckCircle, Clock, AlertCircle,
    Filter, Search, User, Calendar, Tag,
    ArrowUpRight
} from 'lucide-react';
import { useTitle } from '@/hooks/useTitle';

export const ManageFeedback = () => {
    useTitle("Manage Feedback");
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const loadFeedback = async () => {
        try {
            const res = await fetchAllFeedback();
            setFeedbacks(res.data.data);
        } catch (err) {
            console.error('Failed to load feedback', err);
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
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesFilter = filter === 'All' || f.status === filter;
        const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none shadow-[inset_1px_1px_2px_rgba(16,185,129,0.15)]';
            case 'Reviewed': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none shadow-[inset_1px_1px_2px_rgba(245,158,11,0.15)]';
            default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-none shadow-[inset_1px_1px_2px_rgba(100,116,139,0.15)]';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="w-4 h-4" />;
            case 'Reviewed': return <ArrowUpRight className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 p-4 select-none animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Feedback</h1>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Review and manage feedback submitted by students</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-3.5 py-2 shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] rounded-xl flex items-center gap-2 bg-transparent">
                        <MessageSquare className="w-4 h-4 text-indigo-500 dark:text-[#CCFF00]" />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">{feedbacks.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="neo-flat p-4 flex flex-col md:flex-row gap-4 border-none shadow-none">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-555" />
                    <input
                        type="text"
                        placeholder="Search feedback content or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 neo-inset focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400 dark:text-slate-555" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="neo-inset focus:outline-none px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-900/10 dark:border-white/10 border-t-indigo-500 dark:border-t-[#CCFF00] rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Loading feedback...</p>
                </div>
            ) : filteredFeedbacks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFeedbacks.map((f) => (
                        <div key={f._id} className="neo-flat hover:translate-y-[-2px] transition-all overflow-hidden flex flex-col group border-none shadow-none">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyle(f.status)}`}>
                                        {getStatusIcon(f.status)}
                                        {f.status}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {new Date(f.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 font-semibold line-clamp-3">
                                    {f.message}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg shadow-[inset_1.5px_1.5px_3px_#c8d0e7,inset_-1.5px_-1.5px_3px_#ffffff] dark:shadow-[inset_1.5px_1.5px_3px_#0f121b,inset_-1.5px_-1.5px_3px_#272e41] bg-transparent flex items-center justify-center">
                                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white">{f.userId?.username || 'Unknown User'}</p>
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{f.userId?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-indigo-500 dark:text-[#CCFF00]" />
                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{f.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-slate-100/10 dark:bg-slate-900/10">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Update Status:</span>
                                <div className="flex items-center gap-2">
                                    {['Pending', 'Reviewed', 'Resolved'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusUpdate(f._id, s)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                                f.status === s
                                                    ? 'shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] text-indigo-600 dark:text-[#CCFF00]'
                                                    : 'neo-btn text-slate-500 hover:text-slate-600'
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
                <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-transparent shadow-[inset_3px_3px_6px_#c8d0e7,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_#0f121b,inset_-3px_-3px_6px_#272e41]">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[inset_2px_2px_4px_#c8d0e7,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#0f121b,inset_-2px_-2px_4px_#272e41] bg-transparent">
                        <AlertCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">No feedback found</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-2 font-bold leading-relaxed">
                        {searchQuery ? `We couldn't find any results for "${searchQuery}".` : "There's no feedback to review at the moment."}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-6 inline-flex px-4 py-2 neo-btn text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider cursor-pointer active:scale-[0.98]"
                        >
                            Clear search filter
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
